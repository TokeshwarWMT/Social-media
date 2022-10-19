const Post = require('../models/post');
const Comment = require('../models/comment');
const router = require('express').Router();

router.post('/create/:id', async (req, res) => {
    try {
        const data = req.body;
        const id = req.params.id;
        data.id = id;
        const comment = await Comment.create(data);
        await Post.findByIdAndUpdate(id, { $inc: { comments: 1 } });
        return res.status(201).send(comment)
    } catch (error) {
        return res.status(500).send(error)
    }
});

router.get('/get/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const comment = await Comment.findById(id);
        return res.status(200).send(comment);
    } catch (error) {
        return res.status(500).send(error)
    }
});

router.put('/update/:id', async (req, res) => {
    try {
        const data = req.body;
        const id = req.params.id;
        const comment = await Comment.findByIdAndUpdate(id, { $set: data }, { new: true });
        return res.status(201).send({ message: 'successfully updated comment!!', data: comment });
    } catch (error) {
        return res.status(500).send(error)
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const comment = await Comment.findByIdAndRemove(id);
        if (!comment) {
            return res.status(400).send('comment is already deleted!!')
        } else {
            return res.status(200).send('successfully deleted comment!!')
        }
    } catch (error) {
        return res.status(500).send(error)
    }
});

module.exports = router;
