

// Please change appId and apiKey
var APP_ID = 'zx4dswm8';
var API_KEY = '98eb4a05602ad0840ddeb6bb603d889ef7b083ab';

var intercom = require('../index.js').create(APP_ID, API_KEY);

// Chai Setup
// -------------------------
global.chai   = require('chai')
global.expect = chai.expect
global.assert = chai.assert

var chaiSubset = require('chai-subset');
chai.use(chaiSubset);

// Chai Promise Setup
var chaiAsPromised = require("chai-as-promised");
    chai.use(chaiAsPromised);

// Sinon Setup
global.sinon = require("sinon");
var sinonChai = require("sinon-chai");


global.should = chai.should();
chai.use(sinonChai);

// Replay (Like Ruby's VCR)
global.Replay  = require('replay');
Replay.fixtures = __dirname + '/fixtures/replay';

// Set to 'record' to record new callouts
Replay.mode = 'replay';



describe('Contacts', function(){
  var my_contact;
  var contact = {
    name: 'Ray Velcoro',
    email: 'ray@hbo.com'
  };

  before(function(done) {
    intercom.updateContact(contact).then(function(obj) {
      my_contact = obj;
      done();
    })
  })

  describe('#createContact()', function() {

    it('should create and return a contact', function(){
      return intercom.createContact(contact).should.be.fulfilled
      .then(function(obj){
        expect(obj).to.containSubset(contact);
      });
    });

  });

  describe('#updateContact()', function() {

    it('should create and return a contact', function(){
      return intercom.updateContact(contact).should.be.fulfilled
      .then(function(obj){
        expect(obj).to.containSubset(contact);
      });
    });

  });

  describe('#getContact()', function() {

    it('should return our contact', function(){
      expect(my_contact).to.containSubset(contact);
    });

  });


  describe('#deleteContact()', function() {

    it('should return our contact', function(){
      return intercom.deleteContact(my_contact).should.be.fulfilled
      .then(function(obj){
        expect(obj).to.containSubset(my_contact);
      });
    });

  });

  describe('#convertContact()', function() {

    var contact = {
      name: 'Frank Semyon',
      email: 'frank@hbo.com'
    };

    it('should convert the contact', function(){

      return intercom.createContact(contact).should.be.fulfilled.then(function(contact){
        return intercom.convertContact({
          contact: { user_id: contact.user_id },
          user: { email: contact.email }
        }).should.be.fulfilled

      }).catch(function(e) { console.log(e)})

      .then(function(user){
        user.type.should.equal('user');

        // Successfully converted a user
        // Clean it up
        return intercom.deleteUser(user).should.be.fulfilled;
      });

    });

  });


});