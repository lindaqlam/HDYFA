var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var UserSchema = new mongoose.Schema(
	{
		first_name: {
			type: String,
			required: [ true ]
		},
		last_name: String,
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
			match: [ /^[a-z0-9_-]+$/, 'is invalid' ],
			index: true
		},
		password: String,
		bio: String,
		hash: String,
		salt: String
	},
	{ timestamps: true }
);

UserSchema.plugin(uniqueValidator, { message: 'is already taken.' });

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
