/**
 * Module dependencies.
 */
var request = require('request'),
    qs = require('qs'),
    _ = require('lodash'),
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
  this.endpoint = this.options.endpoint;
}

/**
 * Expose `defaultOptions` for the intercom library so that this is changable.
 */
Intercom.defaultOptions = defaultOptions;

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
  debug('Requesting [%s] %s with data %o', method, path, parameters);

  var url = this.endpoint + path;

  var requestOptions = {
    method: method,
    url: url
  };

  if (method === 'GET') {
    requestOptions.qs = parameters;
    requestOptions.headers = {
      'Accept': 'application/json'
    };
  } else {
    // Intercom.io now requires parameters in JSON
    // requestOptions.form = parameters;
    requestOptions.body = JSON.stringify(parameters);
    requestOptions.headers = {
      'Accept': 'application/json',
      'Content-Type' : 'application/json'
    };
  }

  requestOptions.auth = {
      'username' : this.appId,
      'password' : this.apiKey
    };

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

        if (parsed && (parsed.error || parsed.errors)) {
          err = new IntercomError(data);

          // Reject the promise
          return deferred.reject(err);
        }
      } catch (exception) {
        // Reject the promise
        // return deferred.reject(exception);
      }
    }

    // Resolve the promise
    return deferred.resolve(parsed || data);
  });

  // Return the promise and promisify any callback provided
  return deferred.promise.nodeify(cb);
};

/**
 * Helper method to create dates for intercom easily
 *
 * @param {Number  or Date} date - the date (in milliseconds if Number). Leave empty if you want the date set to now
 * @returns {Number} epoch - time in seconds since Epoch (how intercom handles dates)
 * @api public
 */
Intercom.prototype.date = function(date) {
  if (date === undefined) {
    date = new Date();
  }

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

Intercom.prototype.viewUser = function(userObj, cb) {
  if (userObj && userObj.hasOwnProperty('id')) {
      return this.request('GET', 'users' + '/' + userObj.id, {}, cb);
  } else {
      return this.request('GET', 'users', userObj, cb);
  }
};

Intercom.prototype.createUser = function(userObj, cb) {
  return this.request('POST', 'users', userObj, cb);
};

Intercom.prototype.updateUser = function(userObj, cb) {
  return this.request('POST', 'users', userObj, cb);
};

Intercom.prototype.deleteUser = function(userObj, cb) {
  return this.request('DELETE', 'users', userObj, cb);
};

Intercom.prototype.bulkAddUsers = function(userObj, cb) {
  return this.request('POST', 'users/bulk', userObj, cb);
};

// ### Companies
Intercom.prototype.listCompanies = function(companyObj, cb) {
  return this.request('GET', 'companies', companyObj, cb);
};

Intercom.prototype.viewCompany = function(companyObj, cb) {
  if (companyObj && companyObj.hasOwnProperty('id')) {
      return this.request('GET', 'companies/' + companyObj.id, {}, cb);
  } else {
      return this.request('GET', 'companies', companyObj, cb);
  }
};

Intercom.prototype.createCompany = function(companyObj, cb) {
  return this.request('POST', 'companies', companyObj, cb);
};

Intercom.prototype.updateCompany = function(companyObj, cb) {
  return this.request('POST', 'companies', companyObj, cb);
};

/*
// Functionality doesn't currently exist
Intercom.prototype.deleteCompany = function(companyObj, cb) {
  // return this.request('DELETE', 'companies', companyObj, cb);
};
*/

Intercom.prototype.listCompanyUsers = function(companyObj, cb) {
  if (companyObj && companyObj.hasOwnProperty('id')) {
      return this.request('GET', 'companies/' + companyObj.id + '/users', {}, cb);
  } else {
      return this.request('GET', 'companies', companyObj, cb);
  }
};

// ### Admins
Intercom.prototype.listAdmins = function(adminObj, cb) {
  return this.request('GET', 'admins', adminObj, cb);
};

// ### Notes
Intercom.prototype.createNote = function(noteObj, cb) {
  return this.request('POST', 'notes', noteObj, cb);
};

Intercom.prototype.listNotes = function(noteObj, cb) {
  return this.request('GET', 'notes', noteObj, cb);
};

Intercom.prototype.viewNote = function(noteObj, cb) {
  if (noteObj && noteObj.hasOwnProperty('id')) {
    return this.request('GET', 'notes/' + noteObj.id, {}, cb);
  } else {
    return this.request('GET', 'notes', noteObj, cb);
  }
};

// ### Tags
Intercom.prototype.getTag = function(tagObj, cb) {
  return this.request('GET', 'tags', tagObj, cb);
};

Intercom.prototype.createTag = function(tagObj, cb) {
  return this.request('POST', 'tags', tagObj, cb);
};

Intercom.prototype.updateTag = function(tagObj, cb) {
  // Note: tagObj should be empty
  return this.request('PUT', 'tags', tagObj, cb);
};

// ### Segments
Intercom.prototype.listSegments = function(segmentObj, cb) {
  return this.request('GET', 'segments', segmentObj, cb);
};

Intercom.prototype.viewSegment = function(segmentObj, cb) {
  if (segmentObj && segmentObj.hasOwnProperty('id')) {
    return this.request('GET', 'segments/' + segmentObj.id || segmentObj.segment_id, {}, cb);
  } else {
    return this.request('GET', 'segments', segmentObj, cb);
  }
};

// ### Events
Intercom.prototype.createEvent = function(eventObj, cb) {
  return this.request('POST', 'events', eventObj, cb);
};

// ### Counts
Intercom.prototype.getCounts = function(countObj, cb) {
  return this.request('GET', 'counts', countObj, cb);
};

// ### Conversations
Intercom.prototype.createUserMessage = function(messageObj, cb) {
  // (NOTE: the Conversations API is only available to Apps on the Starter and Premium plans)
  return this.request('POST', 'messages', messageObj, cb);
};


/**
 * Expose `Intercom` Library.
 */
module.exports = Intercom;
