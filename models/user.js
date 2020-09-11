var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var UserSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			lowercase: true,
			unique: true,
			required: [ true ],
			match: [ /\S+@\S+\.\S+/, 'is invalid' ],
			index: true
		},
		username: {
			type: String,
			lowercase: true,
			unique: true,
			required: [ true, "can't be blank" ],
			match: [ /^[a-zA-Z0-9]+$/, 'is invalid' ],
			index: true
		},
		// bio: String,
		password: String,
		hash: String,
		salt: String
	},
	{ timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: 'is already taken.' });

/*	
	username is invalid (front end error)
	email already in use:
	username already in use:
	no username given:
	no email given:


*/

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
