
# intercom.io

An API client in Node.JS for talking to intercom.io. This package implements the complete API for talking with the intercom.io API -- users, messages, impressions, tags, notes.

There complete docs can be found here - http://docs.intercom.io/api

## Installation

To install the latest stable release with the command-line tool:
```sh
npm install --save intercom.io
```

## Usage

See [docs](http://tarunc.github.io/intercom.io/) for complete API documentation and the [intercom API documentation](http://docs.intercom.io/api).

```javascript
var Intercom = require('intercom.io');

var options = {
  apiKey: "your_API_key",
  appId: "your_APP_ID"
};

var intercom = new Intercom(options);
// Can also be written as:
// var intercom = new Intercom("your_APP_ID", "your_API_key");

// Note: you can also require and create an instance in the same step if you would like.
// Example:
// var intercom = require('intercom.io').create("your_APP_ID", "your_API_key");
// or
// var intercom = require('intercom.io').create(options);

// To create a user
// Every method supports promises or callbacks.
intercom.createUser({
  "email" : "ben@intercom.io",
  "user_id" : "7902",
  "name" : "Ben McRedmond",
  "created_at" : 1257553080,
  "custom_data" : {"plan" : "pro"},
  "last_seen_ip" : "1.2.3.4",
  "last_seen_user_agent" : "ie6",
  "companies" : [
    {
      "id" : 6,
      "name" : "Intercom",
      "created_at" : 103201,
      "plan" : "Messaging",
      "monthly_spend" : 50
    }
  ],
  "last_request_at" : 1300000000
}, function(err, res) {
  // err is an error object if there was an error
  // res is **JSON** response
  // In this case:
  // {
  //   "intercom_id": "52322b3b5d2dd84f23000169",
  //   "email": "ben@intercom.io",
  //   "user_id": "7902",
  //   "name": "Ben McRedmond",
  //   "created_at": 1257553080,
  //   "last_impression_at": 1300000000,
  //   "custom_data": {
  //     "plan": "pro"
  //   },
  // ...
  // ...
  // ...
  //   "session_count": 0,
  //   "last_seen_ip": "1.2.3.4",
  //   "last_seen_user_agent": "ie6",
  //   "unsubscribed_from_emails": false
  // }
});

// To get a user
// (using a promise)
intercom.getUser({ "email": "ben@intercom.io" }).then(function(res) {
  // res is **JSON** response
  // In this case:
  // {
  //   "intercom_id": "52322b396823b17b1100016a",
  //   "email": "ben@intercom.io",
  //   "user_id": "7902",
  //   "name": "Ben McRedmond",
  //   "created_at": 1257553080,
  //   "last_impression_at": 1300000000,
  //   "custom_data": {
  //     "plan": "pro"
  //   },
  // ...
  // ...
  // ...
  //   "session_count": 0,
  //   "last_seen_ip": "1.2.3.4",
  //   "last_seen_user_agent": "ie6",
  //   "unsubscribed_from_emails": false
  // }
}, function(err) {
  // err is an error object if there was an error
});

// To get multiple users
intercom.getUsers({
  page: 1,
  per_page: 500,
  tag_id: 7002,
  tag_name: "me"
}, function (err, res) {
  // err is an error object
  // res is the **JSON** response
  // {
  //   "users": [
  //     {
  //       "intercom_id": "52322b366823b173eb000170",
  //       "email": "first.user@example.com",
  //       "user_id": "123",
  //       "name": "First User",
  //       "created_at": 1270000000,
  //       "last_impression_at": 1300000000,
  //       "custom_data": {
  //         "app_name": "Genesis",
  // ...
  // ...
  // ...
  //       "last_seen_user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.56 Safari/535.11",
  //       "unsubscribed_from_emails": false
  //     }
  //   ],
  //   "total_count": 3,
  //   "page": 1,
  //   "next_page": null,
  //   "previous_page": null,
  //   "total_pages": 1
  // }
});
```

List of supported methods:
```javascript
* intercom.getUsers
* intercom.getUser
* intercom.viewUser
* intercom.createUser
* intercom.updateUser
* intercom.deleteUser
* intercom.bulkAddUsers
* intercom.listCompanies
* intercom.createCompany
* intercom.updateCompany
* intercom.viewCompany
* intercom.listCompanyUsers
* intercom.listAdmins
* intercom.createNote
* intercom.listNotes
* intercom.viewNote
* intercom.getTag
* intercom.createTag
* intercom.updateTag
* intercom.listSegments
* intercom.viewSegment
* intercom.createEvent
* intercom.getCounts
* intercom.createUserMessage
```

See [docs](http://tarunc.github.io/intercom.io/) for complete API documentation and the [intercom API documentation](http://docs.intercom.io/api). See tests for more examples.

__Note__: Every method returns a promise but accepts callbacks too.

## License

(The MIT License)

Copyright (c) 2014 Mike McDonald &lt;mcdonald@firebase.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
