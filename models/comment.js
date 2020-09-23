var mongoose = require('mongoose');

var commentSchema = mongoose.Schema(
	{
		text: String,
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
		edited: {
			type: Boolean,
			default: false
		}
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at'
		}
	}
);

module.exports = mongoose.model('Comment', commentSchema);
