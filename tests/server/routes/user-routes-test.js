// Instantiate all models
var expect = require('chai').expect;

var Sequelize = require('sequelize');

var db = require('../../../server/db');

var supertest = require('supertest');

describe('Users Route', function () {

    var app, User;

    beforeEach('Sync DB', function () {
        return db.sync({ force: true });
    });

    beforeEach('Create app', function () {
        app = require('../../../server/app')(db);
        User = db.model('user');

    });

    describe('Get all users', function() {
    	var loggedInAgent;

    	var userInfo = [{
			email: 'joe@gmail.com',
			password: 'shoopdawoop'
		},
		{
			email: 'zeke@zeke.com',
			password: 'shoopdawoop'
		},
		{
			email: 'nasser@gmail.com',
			password: 'shoopdawoop'
		}];

		beforeEach('Create a user + a loggedInAgent', function (done) {
			return User.bulkCreate(userInfo).then(function (user) {
                done();
            }).catch(done);
		});

		beforeEach('Create loggedIn user that will make a get request', function (done) {
			loggedInAgent = supertest.agent(app);
			loggedInAgent.post('/login').send(userInfo[0]).end(done);
		});

		it('should get with 200 response and with an array as the body of length 3', function (done) {
			loggedInAgent.get('/api/user/').expect(200).end(function (err, response) {
				if (err) return done(err);
				expect(response.body).to.be.an('array');
				expect(response.body.length).to.be.equal(3);
				done();
			});
		});

		it('should contain user Nasser', function (done) {
			loggedInAgent.get('/api/user/').expect(200).end(function (err, response) {
				if (err) return done(err);
				expect(response.body[2]).to.contain({email: 'nasser@gmail.com', password: 'shoopdawoop'});
				done();
			});
		});

		it('can fetch a user by ID', function (done) {
			loggedInAgent.get('/api/user/2').expect(200).end(function (err, response) {
				if (err) return done(err);
				expect(response.body).to.contain({email: 'zeke@zeke.com', password: 'shoopdawoop'});
				done();
			});
		});

//RIGHT NOW WE HAVE IT RETURNING PASSWORDS?!?!?!?!?!!?!?!?!?!

		it('can update a user by ID', function (done) {
			loggedInAgent.put('/api/user/2').send({email: "reedhahayourehacked@zeke.com"}).expect(201).end(function (err, response) {
				if (err) return done(err);
				console.log("THIS IS THE RESPONSE:", response.body[1][0]);
				expect(response.body[1][0]).to.contain({email: 'reedhahayourehacked@zeke.com', password: 'shoopdawoop'});
				loggedInAgent.get('/api/user/').expect(200).end(function (err, response) {
					if (err) return done(err);
					expect(response.body).to.be.an('array');
					expect(response.body.length).to.be.equal(3);
					expect(response.body[2]).to.contain({email: 'reedhahayourehacked@zeke.com', password: 'shoopdawoop'});
					done();
				});
			});
		});

    });


});


