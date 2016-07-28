'use strict';
var _ = require('lodash');
var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('productOrder', {
	quantity: {
		type: Sequelize.INTEGER,
		defaultValue: 1
	}
});