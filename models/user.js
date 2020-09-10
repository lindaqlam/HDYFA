var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto'); // To generate and validate hashes for pw
var jwt = require('jsonwebtoken');
var secret = require('../config').secret;

var UserSchema = new mongoose.Schema({
	username: String, //username: {type: String, lowercase: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true},
	password: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
