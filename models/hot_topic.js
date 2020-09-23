var mongoose = require('mongoose');

var hotTopicSchema = new mongoose.Schema(
	{
		title: String,
		image: String,
		description: String,
		author: {
			id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User'
			},
			username: String
		},
		comments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Comment'
			}
		]
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at'
		}
	}
);

module.exports = mongoose.model('HotTopic', hotTopicSchema);
