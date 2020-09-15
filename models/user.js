var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var UserSchema = new mongoose.Schema(
	{
		first_name: {
			type: String,
			required: true
		},
		last_name: String,
		email: {
			type: String,
			lowercase: true,
			unique: true,
			required: true,
			match: [ /\S+@\S+\.\S+/, 'is invalid' ],
			index: true
		},
		username: {
			type: String,
			lowercase: true,
			unique: true,
			required: true,
			match: [ /^[a-z0-9_-]+$/, 'is invalid' ],
			index: true
		},
		password: String,
		bio: String,
		photo: {
			type: String,
			default: 'https://www.zooniverse.org/assets/simple-avatar.png'
		},
		hot_topics: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'HotTopic'
			}
		],
		comments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Comment'
			}
		],
		hash: String,
		salt: String
	}
	// ,
	// { timestamps: true }
);

//UserSchema.plugin(uniqueValidator, { message: '{PATH} is already associated with an account.' });
UserSchema.plugin(uniqueValidator);

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
