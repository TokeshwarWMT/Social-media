const Like = require('../models/like');
const Post = require('../models/post');
const { ulike } = require('../validation');
const router = require('express').Router();

router.post('/likeDislike', async (req, res) => {
    try {
        const { error } = ulike(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const data = req.body;
        const postId = req.body.postId;
        const likerId = req.body.likerId;
        data.postId = postId;
        var postDetails = await Post.findById(postId);
        if (await Like.findOne({ likerId })) {
            const like = await Like.deleteOne({ likerId });
            await Post.findByIdAndUpdate(postId, { likes: postDetails.likes - 1 })
            return res.status(201).send('Unliked!👎')
        } else {
            const like = await Like.create(data);
            await Post.findByIdAndUpdate(postId, { likes: postDetails.likes + 1 })
            return res.status(201).send('Liked!👍')
        }
    } catch (error) {
        return res.status(500).send(error)
    }
});

router.get('/getAllLikes/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const likes = await Like.find({ postId });
        if (!likes) {
            return res.status(404).send('no likes!!')
        } else {
            return res.status(200).send(likes)
        }
    } catch (error) {
        return res.status(500).send(error)
    }
});

module.exports = router;