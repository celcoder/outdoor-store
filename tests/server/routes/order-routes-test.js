var sinon = require('sinon');
var expect = require('chai').expect;

var Sequelize = require('sequelize');

var db = require('../../../server/db');
var supertest = require('supertest');

describe('Order Routes', function () {

    var app, Product, Order, User, loggedInUserA, loggedInAdminB;

    beforeEach('Sync DB', function () {
        return db.sync({ force: true });
    });

    beforeEach('Create app', function () {
        app = require('../../../server/app')(db);
        Order = db.model('order');
        Product = db.model('product');
        User = db.model('user');
    });

    beforeEach('Add Products to DB', function(done){
    	var products = [
        	{
		      name: "first",
		      status: "available",
		      photoUrl: "https://first.com",
		      price: 99.99,
		      description: "first"
 			},
 			{
		      name: "second",
		      status: "available",
		      photoUrl: "https://second.com",
		      price: 99.99,
		      description: "second"
 			},
 			{
		      name: "third",
		      status: "available",
		      photoUrl: "https://third.com",
		      price: 99.99,
		      description: "third"
 			}
        ]
        return Product.bulkCreate(products)
        .then(function(products){
        	done();
        }).catch(done);
    })


	// describe('Authenticated request', function () {

	// 	var loggedInAgent;

	// 	var userInfo = {
	// 		email: 'joe@gmail.com',
	// 		password: 'shoopdawoop'
	// 	};

	// 	beforeEach('Create a user', function (done) {
	// 		return User.create(userInfo).then(function (user) {
 //                done();
 //            }).catch(done);
	// 	});

	// 	beforeEach('Create loggedIn user agent and authenticate', function (done) {
	// 		loggedInAgent = supertest.agent(app);
	// 		loggedInAgent.post('/login').send(userInfo).end(done);
	// 	});

	// 	it('should get with 200 response and with an array as the body', function (done) {
	// 		loggedInAgent.get('/api/orders').expect(200).end(function (err, response) {
	// 			if (err) return done(err);
	// 			expect(response.body).to.be.an('array');
	// 			done();
	// 		});
	// 	});

	// });

	describe('Non-admin authenticated req', function(){

		var userInfoA = {email:'a@gmail.com', password:'aaa', admin: false}

		beforeEach('Create a user', function (done) {
			return User.create(userInfoA).then(function (user) {
                done();
            }).catch(done);
		});

		beforeEach('Create loggedIn user agent and authenticate', function (done) {
				loggedInUserA = supertest.agent(app);
				loggedInUserA.post('/login').send(userInfoA).end(done);
			});

		it('does not get orders for a non-admin', function(done){
			loggedInUserA.get('/api/orders')
	    		.expect(401)
				.end(done);
	    	})
	})

	// describe('Admin authenticated req', function(){

	// 	beforeEach('Create loggedIn user agent and authenticate', function (done) {
	// 			loggedInAdminB = supertest.agent(app);
	// 			loggedInAdminB.post('/login').send(userInfoB).end(done);
	// 		});

	// 	it('Get orders for an admin', function(done){
	// 		loggedInAdminB.get('/api/orders').expect(200).end(function (err, response) {
	// 			if (err) return done(err);
	// 			expect(response.body).to.be.an('array');
	// 			done();
	// 		});
	// 	});
	// });


})