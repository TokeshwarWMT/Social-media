const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const postSchema = new mongoose.Schema({
    post: {
        image: [String],
        video: [String]
    },
    userId: {
        type: ObjectId,
        ref: 'User'
    },
    caption: { types: String, reqiured: true },
    likes: { type: Number, required: true },
    comment: { type: String, reqiured: true }
});

module.exports = mongoose.model('Post', postSchema);