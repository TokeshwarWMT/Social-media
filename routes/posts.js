const Post = require('../models/post');
const router = require('express').Router();
const cloudinary = require('cloudinary').v2;


router.post('/create', (req, res) => {
    try {
        const file = req.files.photo;
        cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
            const data = req.body;
            const { userId, caption, likes, comments } = data;
            const postData = { ...data, post: result.url }
            const userPost = await Post.create(postData);
            return res.status(201).send(userPost)
        })
    } catch (error) {
        return res.status(500).send(error)
    }

});

router.get('/get/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const getPost = await Post.findById(id);
        return res.status(200).send(getPost);
    } catch (error) {
        return res.status(500).send(error);
    }
});

router.put('/update/:id', async (req, res) => {
    try {
        const file = req.files.photo;
        cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
            const data = req.body;
            const id = req.params.id;
            const postData = { ...data, post: result.url };
            const userPost = await Post.findByIdAndUpdate(id, { $set: postData }, { new: true });
            return res.status(201).send({ message: 'succesfully updated data', postDetails: userPost })
        })
    } catch (error) {
        return res.status(500).send(error)
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletePost = await Post.findByIdAndRemove(id);
        if (!deletePost) {
            return res.status(400).send('post is already deleted!!')
        } else {
            return res.status(200).send('successfully deleted post!!')
        }
    } catch (error) {
        return res.status(500).send(error)
    }
});

module.exports = router;