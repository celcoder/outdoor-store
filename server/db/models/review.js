'use strict';
var _ = require('lodash');
var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('review', {
	rating: Sequelize.INTEGER,
	text: Sequelize.TEXT
});