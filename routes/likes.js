const Like = require('../models/like');
const Post = require('../models/post');
const router = require('express').Router();

router.post('/likeDislike', async (req, res) => {
    try {
        const data = req.body;
        const postId = req.body.postId;
        const likerId = req.body.likerId;
        data.postId = postId;
        var postDetails = await Post.findById(postId);
        if (await Like.findOne({ likerId })) {
            const like = await Like.deleteOne({ likerId });
            console.log(await Like.findOne({ likerId }));
            await Post.findByIdAndUpdate(postId, { likes: postDetails.likes - 1 })
            return res.status(201).send('you disliked this post!!')
        } else {
            const like = await Like.create(data);
            await Post.findByIdAndUpdate(postId, { likes: postDetails.likes + 1 })
            return res.status(201).send('you liked this post!!')
        }

    } catch (error) {
        return res.status(500).send(error)
    }
});

module.exports = router;