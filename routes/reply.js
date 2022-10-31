const Reply = require('../models/reply');
const router = require('express').Router();
const { ureply } = require('../validation');

router.post('/create', async (req, res) => {
    try {
        const { error } = ureply(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const data = req.body;
        const userId = req.body.userId;
        const commentId = req.body.commentId;
        const reply = await Reply.create(data);
        return res.status(201).send(reply)
    } catch (error) {
        return res.status(500).send(error);
    }
});

router.put('/update', async (req, res) => {
    try {
        const replyId = req.body.replyId;
        const data = req.body;
        const userId = req.body.userId
        const reply = await Reply.findByIdAndUpdate(replyId, { $set: data }, { new: true });
        return res.status(201).send(reply)
    } catch (error) {
        return res.status(500).send(error)
    }
});

router.delete('/delete', async (req, res) => {
    try {
        const replyId = req.body.replyId;
        const userId = req.body.userId;
        const reply = await Reply.findByIdAndRemove(replyId);
        if (!reply) {
            return res.status(400).send('reply is already deleted!!')
        } else {
            return res.status(200).send('reply is deleted!!')
        }
    } catch (error) {
        return res.status(500).send(error)
    }
});

module.exports = router;