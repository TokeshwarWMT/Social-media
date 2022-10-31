const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const commentSchema = new mongoose.Schema({
    postId: { type: ObjectId, ref: 'Post' },
    commenterId: { type: ObjectId, ref: 'User' },
    comment: { type: String, required: true },
    commentDate: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('Comment', commentSchema);