const Post = require('../models/post');
const Comment = require('../models/comment');
const router = require('express').Router();
const { ucomment } = require('../validation');

router.post('/create', async (req, res) => {
    try {
        const { error } = ucomment(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const data = req.body;
        const postId = req.body.postId;
        const commenterId = req.body.commentId;
        data.postId = postId;
        const comment = await Comment.create(data);
        await Post.findByIdAndUpdate(postId, { $inc: { comments: 1 } });
        return res.status(201).send(comment)
    } catch (error) {
        return res.status(500).send(error);
    }
});

router.get('/get/:commentId', async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const comment = await Comment.findById(commentId);
        return res.status(200).send(comment);
    } catch (error) {
        return res.status(500).send(error)
    }
});

router.get('/getAllComments', async (req, res) => {
    try {
        const comment = await Comment.find().select('_id comment');
        return res.status(200).send(comment);
    } catch (error) {
        return res.status(500).send(error);
    }
});

router.put('/update/:commentId', async (req, res) => {
    try {
        const data = req.body;
        const commentId = req.params.commentId;
        const comment = await Comment.findByIdAndUpdate(commentId, { ...data }, { new: true });
        console.log(data)
        return res.status(201).send({ message: 'successfully updated comment!!', data: comment });
    } catch (error) {
        return res.status(500).send(error);
    }
});

router.delete('/delete/:commentId/:postId', async (req, res) => {
    try {
        const { commentId } = req.params;
        const { postId } = req.params;
        const comment = await Comment.findByIdAndRemove(commentId);
        await Post.findByIdAndUpdate(postId, { $inc: { comments: -1 } });
        if (!comment) {
            return res.status(400).send('comment is already deleted!!')
        } else {
            return res.status(200).send('successfully deleted comment!!')
        }
    } catch (error) {
        return res.status(500).send(error);
    }
});

module.exports = router;
