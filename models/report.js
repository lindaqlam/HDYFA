var mongoose = require('mongoose');

var reportSchema = mongoose.Schema(
	{
		reason: String,
		author: {
			id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User'
			},
			username: String
		},
		hot_topic: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'HotTopic'
		},
		comment: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment'
		}
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at'
		}
	}
);

module.exports = mongoose.model('Report', reportSchema);
