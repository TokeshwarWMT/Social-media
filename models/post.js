const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const postSchema = new mongoose.Schema({
    post: {type: String, required: true},
    userId: { type: ObjectId, ref: 'User' },
    caption: { type: String, required: true },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 }
});

module.exports = mongoose.model('Post', postSchema);