const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const likeSchema = new mongoose.Schema({
    postId: { type: ObjectId, ref: 'Post' },
    likerId: { type: ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Like', likeSchema);