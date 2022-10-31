const Like = require('../models/like');
const Post = require('../models/post');
const router = require('express').Router();

router.post('/likeDislike', async (req, res) => {
    try {
        const data = req.body;
        const postId = req.body.postId;
        const likerId = req.body.id;
        data.postId = postId;
        const like = await Like.create(data);
        var postDetails = await Post.findById(postId);
        if (postDetails.likes.includes(req.body.id)) {
            await Post.findByIdAndUpdate(postId, { likes: postDetails.likes-1 })
            return res.status(404).send('you disliked this post!!')
        } else {
            await Post.findByIdAndUpdate(postId, { likes: postDetails.likes+1 })
            return res.status(201).send('you liked this post!!')
        }

    } catch (error) {
        // return res.status(500).send(error)
        console.log(error)
    }
});

// router.get('/get', async (req, res) => {
//     try {
//         const likes = await Like.find().select('_id likes');
//         return res.status(200).send(likes)
//     } catch (error) {
//         console.log(error)
//     }
// });

// router.post('/dislike', async (req, res) => {
//     try {
//         const data = req.body;
//         const postId = req.body.postId;
//         const likerId = req.body.id;
//         data.postId = postId;
//         const like = await Like.create(data);
//         var postDetails = await Post.findById(postId);
//         await Post.findByIdAndUpdate(postId, { likes: postDetails.likes - 1 })
//         return res.status(201).send(like)
//     } catch (error) {
//         return res.status(500).send(error)
//     }
// });

module.exports = router;