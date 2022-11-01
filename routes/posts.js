const Post = require('../models/post');
const router = require('express').Router();
const cloudinary = require('cloudinary').v2;
const { upost } = require('../validation');
const User = require('../models/user');

router.post('/create', (req, res) => {
    try {
        const { error } = upost({ ...req.body, post: req.files ? req.files.post : '' });
        if (error) return res.status(400).send(error.details[0].message);

        const file = req.files.post;
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
        const getPost = await Post.findOne({ id, Profile: 'public' });
        return res.status(200).send(getPost);
    } catch (error) {
        return res.status(500).send(error);
    }
});

router.put('/update/:id', async (req, res) => {
    try {
        const file = req.files.post;
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

// get post by blocked user
router.get('/getByBlockedUser/:id', async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const blockeduser = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (currentUser.blockedUser.includes(blockeduser.id)) {
                return res.status(401).send('you have been blocked by user!!')
            } else {
                return res.status(200).send(currentUser);
            }
        } catch (error) {
            return res.status(500).send(error)
        }
    }
}
);

// pagination in get all posts
router.get('/getAllPost', async (req, res) => {
    try {
        let { page, limit } = req.query;
        if (!page) page = 1;
        if (!limit) limit = 10;
        const skip = (page - 1) * 10;
        const posts = await Post.find().skip(skip).limit(limit);
        return res.send({ page: page, limit: limit, posts: posts })
    } catch (error) {
        return res.status(500).send(error)
    }
});

module.exports = router;