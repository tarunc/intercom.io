/**
 * Module dependencies.
 */
var request = require('request'),
    qs = require('qs'),
    _ = require('lodash/dist/lodash.underscore'),
    debug = require('debug')('intercom.io'),
    // Represents errors thrown by intercom, see [IntercomError.js](./IntercomError.js.html)
    IntercomError = require('./IntercomError'),
    url = require('url'),
    Q = require('q');

// Define some sane default options
// Right now we only have one endpoint for intercom data
var defaultOptions = {
  endpoint: 'https://api.intercom.io/'
};

/**
 * `Intercom` constructor.
 *
 * @param {String} appId - your app Id
 * @param {String} apiKey - your api key
 * @param {Object} options - an options object
 * @api public
 */
function Intercom(appId, apiKey, options) {
  // Overload the contractor
  // Parse out single option objects
  if (_.isObject(appId) && !_.isString(appId) && appId.apiKey && appId.appId) {
    apiKey = appId.apiKey;
    options = _.omit(appId, 'apiKey', 'appId');
    appId = appId.appId;
  }

  // Preform some sane validation checks and throw errors
  // We need the appId
  if (!appId) {
    throw new IntercomError('Invalid App ID: ' + appId);
  }

  // The api key is also required
  if (!apiKey) {
    throw new IntercomError('Invalid API Key: ' + apiKey);
  }

  // Copy over the relavant data
  this.appId = appId;
  this.apiKey = apiKey;

  // Extend the defaults
  this.options = _.defaults(options || {}, Intercom.defaultOptions);

  // Contruct the endpoint with the correct auth from the appId and apiKey
  this.endpoint = Intercom.constructEndpoint(this.options.endpoint, appId, apiKey);
}

/**
 * Expose `defaultOptions` for the intercom library so that this is changable.
 */
Intercom.defaultOptions = defaultOptions;

/**
 * Helper function to Construct the endpoint
 *
 * @param {String} endpoint - the base intercom.io endpoint
 * @param {String} appId - your app Id
 * @param {String} apiKey - your api key
 * @returns {String} url - the constructed endpoint
 * @api public
 */
Intercom.constructEndpoint = function(endpoint, appId, apiKey) {
  var urlObj = url.parse(endpoint),
      auth = appId + ':' + apiKey;

  // Check if the endpoint already has auth built in
  if (urlObj.auth) {
    // Compare auths and warn developer if different (sanity check)
    if (urlObj.auth !== auth) {
      console.warn('Auth provided in endpoint url is different from auth calculated. Assuming endpoint has correct authentication.');
    }

    // Just return the url since it already contains auth
    return endpoint;
  }

  // Assign auth to the url
  urlObj.auth = auth;

  // Return the url
  return url.format(urlObj);
};

/**
 * Helper method to create an instance easily
 *
 * Enables use like this:
 *
 *     `var intercom = require('intercom.io').create("your_APP_ID", "your_API_key");`
 *
 *      or
 *
 *     `var intercom = require('intercom.io').create(options);`
 *
 * @param {String} appId - your app Id
 * @param {String} apiKey - your api key
 * @param {Object} options - an options object
 * @api public
 */
Intercom.create = function(appId, apiKey, options) {
  var intercom = new Intercom(appId, apiKey, options);
  return intercom;
};

/**
 * The main method that makes all the requests to intercom.
 * This method deals with the intercom api and can be used
 * to make requests to the intercom api.
 *
 * @api public
 */
Intercom.prototype.request = function(method, path, parameters, cb) {
  debug('Requesting [%s] %s with data %o', method, path, parameters)

  var url = this.endpoint + path;

  if(path === 'events'){
      //events doesn't use the v1/ naming convention
      url = url.replace('v1/', '');
  }

  var requestOptions = {
    method: method,
    url: url
  };

  if (method === 'GET') {
    requestOptions.qs = parameters;
  } else {
    // Intercom.io now requires parameters in JSON
    // requestOptions.form = parameters;
    requestOptions.body = JSON.stringify(parameters);
    requestOptions.headers = {
      'Content-Type': 'application/json'
    };
  }

  // create a promise to return
  var deferred = Q.defer();

  request(requestOptions, function(err, res, data) {
    if (err) {
      // Reject the promise
      return deferred.reject(err);
    }

    // Try to parse the data
    var parsed;
    if (data) {
      debug('Recieved response %s', data);

      try {
        parsed = JSON.parse(data);

        if (parsed && (parsed.error || parsed.errors) && !err) {
          err = new Error(data);
        }
      } catch (exception) {

      }
    }

    // Resolve the promise
    return deferred.resolve(parsed || data)
  });

  // Return the promise and promisify any callback provided
  return deferred.promise.nodeify(cb);
};

/**
 * Helper method to create dates for intercom easily
 *
 * @param {Number  or Date} date - the date. Leave empty if you want the date set to now
 * @returns {Number} epoch - time in seconds since Epoch (how intercom handles dates)
 * @api public
 */
Intercom.prototype.date = function(date) {
  if (date && _.isDate(date) && date.getTime) {
    return Math.floor(date.getTime() / 1000);
  }

  return Math.floor((new Date(date)) / 1000);
};

// ### Users
Intercom.prototype.getUsers = function(options, cb) {
  if (_.isFunction(options)) {
    cb = options;
    options = {};
  }

  return this.request('GET', 'users', options, cb);
};

Intercom.prototype.getUser = function(userObj, cb) {
  return this.request('GET', 'users', userObj, cb);
};

Intercom.prototype.createUser = function(userObj, cb) {
  return this.request('POST', 'users', userObj, cb);
};

Intercom.prototype.updateUser = function(userObj, cb) {
  return this.request('PUT', 'users', userObj, cb);
};

Intercom.prototype.deleteUser = function(userObj, cb) {
  return this.request('DELETE', 'users', userObj, cb);
};

// ### Impressions
Intercom.prototype.createImpression = function(userObj, cb) {
  return this.request('POST', 'users/impressions', userObj, cb);
};

// ### Message Threads
Intercom.prototype.getMessageThread = function(userObj, cb) {
  return this.request('GET', 'users/message_threads', userObj, cb);
};

Intercom.prototype.createMessageThread = function(userObj, cb) {
  return this.request('POST', 'users/message_threads', userObj, cb);
};

Intercom.prototype.replyMessageThread = function(userObj, cb) {
  return this.request('PUT', 'users/message_threads', userObj, cb);
};

// ### Notes
Intercom.prototype.createNote = function(userObj, cb) {
  return this.request('POST', 'users/notes', userObj, cb);
};

// ### Tags
Intercom.prototype.getTag = function(userObj, cb) {
  return this.request('GET', 'tags', userObj, cb);
};

Intercom.prototype.createTag = function(userObj, cb) {
  return this.request('POST', 'tags', userObj, cb);
};

Intercom.prototype.updateTag = function(userObj, cb) {
  return this.request('PUT', 'tags', userObj, cb);
};

// ### Segments
Intercom.prototype.getSegment = function(userObj, cb) {
    return this.request('GET', 'segments', userObj, cb);
}

// ### Events
Intercom.prototype.createEvent = function(eventObj, cb) {
  return this.request('POST', 'events', eventObj, cb);
}

/**
 * Expose `Intercom` Library.
 */
module.exports = Intercom;
