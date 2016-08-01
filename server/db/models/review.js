'use strict';
var Sequelize = require('sequelize');
var Product = require('./product');
var User = require('./user');
var db = require('../_db');

module.exports = db.define('review', {
	rating: {
		type: Sequelize.INTEGER,
		validate: {
			min: 1,
			max: 5
		}
	},
	text: Sequelize.TEXT
},
{
	defaultScope: {
		include: [Product, User]
	}
}
);