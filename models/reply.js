const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    userId: { type: String, required: true },
    commentId: { type: String, required: true },
    reply: { type: String, required: true },
    date: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('Reply', replySchema);