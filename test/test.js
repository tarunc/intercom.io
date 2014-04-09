var assert = require('assert');

// Please change appId and apiKey
var APP_ID = '';
var API_KEY = '';

var intercom = require('../index.js').create(APP_ID, API_KEY);
// events api requires v3 endpoint
var intercom_v3 = require('../index.js').create(APP_ID, API_KEY, {endpoint: 'https://api.intercom.io/'});

describe('Intercom', function(){
  describe('#getUsers()', function(){
    it('should get all users', function(done){
      intercom.getUsers(function (err, res) {
        if (err) {
          throw err;
        }

        console.log(res);
        done();
      });
    });
  });

  describe('#createUser()', function(){
    it('should create a specific user', function(done){
      intercom.createUser({
        'email' : 'somebody@example.com',
        'name' : 'Somebody',
        'created_at' : (new Date() / 1000),

        'last_seen_ip' : '1.2.3.4',
        'last_seen_user_agent' : 'ie6'
      }, function (err, res) {
        if (err) {
          throw err;
        }

        console.log(res);
        done();
      });
    });
  });

  describe('#updateUser()', function(){
    it('should update a specific user', function(done){
      intercom.updateUser({
        'email' : 'somebody@example.com',
        'name' : 'Me!',
      }, function (err, res) {
        if (err) {
          throw err;
        }

        console.log(res);
        done();
      });
    });
  });
    
  describe('#getUser()', function(){
      it('should get a specific user', function(done){
        intercom.getUser({ email: 'somebody@example.com' }, function (err, res) {
          if (err) {
            throw err;
          }
  
          console.log(res);
          done();
        });
      });
  });
  
  describe('#createEvent()', function(){
    it('should create a user event', function(done){
      intercom_v3.createEvent({
        'event_name' : 'some event',
        'created' : (new Date() / 1000),
        'email' : 'somebody@example.com'
      }, function (err, res) {
        if (err) {
            console.error(err);
          throw err;
        }

        console.log(res);
        done();
      });
    });
  });
    
  describe('#deleteUser()', function(){
    it('should delete a specific user', function(done){
      intercom.deleteUser({
        'email' : 'somebody@example.com'
      }, function (err, res) {
        if (err) {
          throw err;
        }

        console.log(res);
        done();
      });
    });
  });
  
  
});

