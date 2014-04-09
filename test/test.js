var assert = require('assert');

// Please change appId and apiKey
var intercom = require('../index.js').create('app_id', 'api_key');

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
        'pre_launch' : true,
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

