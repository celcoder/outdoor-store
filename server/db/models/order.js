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
  first_name: {
    type: Sequelize.STRING
  },
  last_name: {
    type: Sequelize.STRING
  },
  city: {
    type: Sequelize.STRING
  },
  state: {
    type: Sequelize.STRING
  },
  zip: {
    type: Sequelize.INTEGER
  }
},
{
	defaultScope: {
		include: [Product]
	}
}
);
