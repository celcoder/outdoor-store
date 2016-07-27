var sinon = require('sinon');
var expect = require('chai').expect;

var Sequelize = require('sequelize');

var db = require('../../../server/db');
var supertest = require('supertest');

describe('Product Routes', function () {

    var app, Product, agent;

    beforeEach('Sync DB', function () {
        return db.sync({ force: true });
    });

    beforeEach('Create app', function () {
        app = require('../../../server/app')(db);
        Product = db.model('product');
        agent = supertest.agent(app);
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
  	
    	
    	it('gets a product by ID', function(done){
    		agent.get('/api/products/2')
    		.expect('Content-Type', /json/)
    		.expect(200)
    		.end(function(err, response){
    			if (err) return done(err);
    		 	expect(response.body).to.be.an.instanceOf(Object);
    		 	expect(response.body.name).to.equal("second");
    		 	done();
    		})
    	})

});