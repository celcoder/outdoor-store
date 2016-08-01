'use strict';
var crypto = require('crypto');
var _ = require('lodash');
var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('user', {
    email: {
        type: Sequelize.STRING,
        unique: true
    },
    password: {
        type: Sequelize.STRING
    },
    first_name: {
        type: Sequelize.STRING
    },
    last_name: {
        type: Sequelize.STRING
    },
    billing_address: {
        type: Sequelize.STRING
    },
    billing_city: {
        type: Sequelize.STRING
    },
    billing_state: {
        type: Sequelize.STRING
    },
    billing_zip: {
        type: Sequelize.INTEGER
    },
    credit_card_number: {
        type: Sequelize.INTEGER
    },
    credit_card_type: {
        type: Sequelize.ENUM('visa', 'mastercard', 'discover', 'american express')
    },
    admin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    salt: {
        type: Sequelize.STRING
    },
    twitter_id: {
        type: Sequelize.STRING
    },
    facebook_id: {
        type: Sequelize.STRING
    },
    google_id: {
        type: Sequelize.STRING
    }
}, {
    instanceMethods: {
        sanitize: function () {
            return _.omit(this.toJSON(), ['password', 'salt']);
        },
        correctPassword: function (candidatePassword) {
            return this.Model.encryptPassword(candidatePassword, this.salt) === this.password;
        }
    },
    classMethods: {
        generateSalt: function () {
            return crypto.randomBytes(16).toString('base64');
        },
        encryptPassword: function (plainText, salt) {
            console.log("PROBLEM HERE:", plainText, salt);
            var hash = crypto.createHash('sha1');
            hash.update(plainText);
            hash.update(salt);
            return hash.digest('hex');
        }
    },
    hooks: {
        beforeValidate: function (user) {
            if (user.changed('password')) {
                user.salt = user.Model.generateSalt();
                user.password = user.Model.encryptPassword(user.password, user.salt);
            }
        }
    }
});
