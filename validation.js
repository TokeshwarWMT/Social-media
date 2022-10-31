const Joi = require('joi');

const usignup = data => {
    const userSchema = Joi.object({
        name: Joi.string().min(3).max(60).required(),
        user_name: Joi.string().required(),
        email: Joi.string().required().email().trim().lowercase(),
        profileImage: Joi.object().required(),
        gender: Joi.string().valid('Male', 'Female', 'Transgender'),
        phone: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
        password: Joi.string().min(6).required(),
        confirm_password: Joi.ref('password')
    });
    return userSchema.validate(data);
};

const upost = data => {
    const postSchema = Joi.object({
        post: Joi.object().required(),
        userId: Joi.string().hex().length(24).required(),
        caption: Joi.string().required(),
    });
    return postSchema.validate(data);
};

const ucomment = data => {
    const commentSchema = Joi.object({
        postId: Joi.string().hex().length(24).required(),
        commenterId: Joi.string().hex().length(24).required(),
        comment: Joi.string().required()
    });
    return commentSchema.validate(data);
};

const ulike = data => {
    const likeSchema = Joi.object({
        postId: Joi.string().hex().length(24).required(),
        likerId: Joi.string().hex().length(24).required()
    });
    return likeSchema.validate(data);
};

const ureply = data => {
    const replySchema = Joi.object({
        userId: Joi.string().hex().length(24).required(),
        commentId: Joi.string().hex().length(24).required(),
        reply: Joi.string().required()
    });
    return replySchema.validate(data);
};

module.exports = { usignup, upost, ucomment, ulike, ureply };