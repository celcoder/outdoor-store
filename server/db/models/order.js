'use strict';
var _ = require('lodash');
var Sequelize = require('sequelize');
var Product = require('./product');

var db = require('../_db');

module.exports = db.define('order', {
	status: {
		type: Sequelize.ENUM('cart', 'ordered', 'shipped', 'delivered'),
		defaultValue: 'cart'
	},
  street_address: {
    type: Sequelize.STRING
  },
  shipping_name: {
    type: Sequelize.STRING
  },
  shipping_city: {
    type: Sequelize.STRING
  },
  shipping_state: {
    type: Sequelize.STRING
  },
  shipping_zip: {
    type: Sequelize.INTEGER
  }
},
{
	defaultScope: {
		include: [Product]
	}
}
);
