const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    user_name: { type: String, required: true, trim: true },
    email: { type: String, required: true },
    profileImage: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Transgender"] },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    Profile: { type: String, enum: ["private", "public"], default: "public" },
    encryptOTP: String,
    active: { type: Boolean, default: false },
    followers: [{ type: ObjectId, ref: 'User', default: 0 }],
    following: [{ type: ObjectId, ref: 'User', default: 0 }],

});

userSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(this.password, salt)
        this.password = hashPassword
        next()

    } catch (error) {

        next(error)
    }
});


module.exports = mongoose.model('User', userSchema);