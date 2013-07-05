/**
 * Module dependencies.
 */
var request = require('request'),
    qs = require('qs'),
    _ = require('lodash/dist/lodash.underscore'),
    debug = require('debug')('intercom.io'),
    IntercomError = require('./IntercomError'),
    url = require('url');

// Define some sane default options
// Right now we only have one endpoint for intercom data
var defaultOptions = {
  endpoint: 'https://api.intercom.io/v1/'
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
};

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
      console.warn('Auth provided in endpoint url is different from auth calculated. Assuming endpoint has correct authentication.')
    }

    return endpoint;
  }

  urlObj.auth = auth;

  // Return the url
  return url.format(urlObj);
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
  var requestOptions = {
    method: method,
    url: url
  };

  if (method === 'GET' || method === 'DELETE') {
    requestOptions.qs = parameters;
  } else {
    // requestOptions.form = parameters;
    requestOptions.body = qs.stringify(parameters);
  }

  return request(requestOptions, function(err, res, data) {
    var parsed;

    if (!err && data) {
      debug('Recieved response %s', data);

      try {
        parsed = JSON.parse(data);

        if (parsed && parsed.error && !err) {
          err = new Error(data);
        }
      } catch (exception) {

      }
    }

    return cb && cb(err, parsed || data);
  });
};

Intercom.prototype.getUsers = function(page, perPage, cb) {
  if ('function' === typeof page) {
    cb = page;
    page = 1;
    perPage = 500;
  } else if ('function' === typeof perPage) {
    cb = perPage;
    perPage = 500;
  }

  if (perPage && perPage > 500) {
    throw new IntercomError('Maximum Per Page is 500! You passed in : ' + perPage);
  }

  this.request('GET', 'users', {
    page: page,
    per_page: perPage
  }, cb);
};

Intercom.prototype.getUser = function(userObj, cb) {
  this.request('GET', 'users', userObj, cb);
};

Intercom.prototype.createUser = function(userObj, cb) {
  this.request('POST', 'users', userObj, cb);
};

Intercom.prototype.date = function(date) {
  if (date && _.isDate(date) && date.getTime) {
    return Math.floor(date.getTime() / 1000);
  }

  return Math.floor((new Date()) / 1000);
};

Intercom.prototype.updateUser = function(userObj, cb) {
  this.request('PUT', 'users', userObj, cb);
};

Intercom.prototype.deleteUser = function(userObj, cb) {
  this.request('DELETE', 'users', userObj, cb);
};

Intercom.prototype.createImpression = function(userObj, cb) {
  this.request('POST', 'users/impressions', userObj, cb);
};

Intercom.prototype.getMessageThread = function(userObj, cb) {
  this.request('GET', 'users/message_threads', userObj, cb);
};

Intercom.prototype.createMessageThread = function(userObj, cb) {
  this.request('POST', 'users/message_threads', userObj, cb);
};

Intercom.prototype.replyMessageThread = function(userObj, cb) {
  this.request('PUT', 'users/message_threads', userObj, cb);
};

/**
 * Expose `Intercom` Library.
 */
module.exports = Intercom;
