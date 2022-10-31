const User = require('../models/user');
const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userAuth = require('../middleware/auth');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dbv10f3bf',
  api_key: '474116116625175',
  api_secret: 'UU-WYsG12QFKvYzA7gVo_u6ZjbI',
  secure: true
});

// router.post('/signup', async (req, res) => {
//   try {
//     const data = req.body;
//     const { name, user_name, email, profileImage, gender, phone, password, confirm_password } = data;
//     if (!name || !user_name || !email || !profileImage || !gender || !phone || !password || !confirm_password) {
//       return res.status(400).send('Please input all fiels!!')
//     };
//     if (password !== confirm_password) {
//       return res.status(400).send('password and confirm password does not match!!')
//     };

//     function generateOTP(max) {
//       return Math.floor(Math.random() * max)
//     };

//     const salt = await bcrypt.genSalt(10);
//     var otp = generateOTP(999999);
//     console.log(otp)
//     const encryptOTP = await bcrypt.hash(otp.toString(), salt);
//     console.log(generateOTP)

//     const user = await User.create({ ...data, encryptOTP });
//     return res.status(200).send(user)
//   } catch (error) {
//     console.log(error.message)
//   }
// });

router.get('/verifyOTP', async (req, res) => {
  try {
    const email = req.body.email;
    const encrypt = req.body.encryptOTP;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).send('email does not exist!!')
    }
    console.log(email);
    const matchOTP = await bcrypt.compare(encrypt, user.encryptOTP)
    console.log(matchOTP)
    if (!matchOTP) {
      return res.status(400).send('incorrect otp!!')
    } else {
      const active = await User.findOneAndUpdate({ email: email }, { $set: { active: true } });
      return res.status(200).send('correct otp!!')
    }

  } catch (error) {
    return res.status(500).send(error)
  }
});

router.post('/login', async (req, res) => {
  let email = req.body.email;
  let pass = req.body.password;

  try {
    var user = await User.findOne({ email: email })
    if (!user) {
      return res.status(404).send({ message: 'incorrect email!!' })
    };

    const password = user.password;
    let passMatch = await bcrypt.compare(pass, password)
    if (!passMatch) {
      return res.status(400).send('incorrect password!!')
    };

    if (user.active == true) {
      const token = jwt.sign({
        id: user._id
      }, 'webmob')
      res.status(201).send({ token: token })
    } else {
      return res.status(400).send('user inactive')
    }
  } catch (e) {
    return res.status(500).send(e.message)
  }
});

router.get('/get/:id', userAuth, async (req, res) => {
  try {
    let id = req.params.id;
    const user = await User.findById(id);
    return res.status(200).send({ user, followersCount: user.followers.length, followingCount: user.following.length })
  } catch (error) {
    return res.status(500).send(error)
  }
});

router.put('/update/:id', userAuth, async (req, res) => {
  try {
    let id = req.params.id;
    let data = req.body;
    let { name, user_name, email, profileImage, gender, phone, password, confirm_password } = data;
    if (password !== confirm_password) {
      return res.status(400).send('password and confirm password does not match!!')
    }
    const salt = await bcrypt.genSalt(10);
    const encryptPass = await bcrypt.hash(password, salt);
    console.log(encryptPass)

    const user = await User.findByIdAndUpdate(id, { name, user_name, email, profileImage, gender, phone, password: encryptPass }, { new: true });
    return res.status(201).send({ message: 'successfully updated data', data: user })
  } catch (error) {
    return res.status(500).send(error)
  }
});

router.delete('/delete/:id', userAuth, async (req, res) => {
  try {
    let id = req.params.id;
    const user = await User.findByIdAndRemove(id);
    if (!user) {
      return res.status(400).send('user already deleted!!')
    } else {
      return res.status(200).send('successfully deleted data!!')
    }
  } catch (error) {
    return res.status(500).send(error)
  }
});

router.post('/signup', (req, res) => {
  const file = req.files.photo;
  cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {

    const data = req.body;
    const { name, user_name, email, gender, phone, password, confirm_password } = data;
    if (!name || !user_name || !email || !gender || !phone || !password || !confirm_password) {
      return res.status(400).send('Please input all fiels!!')
    };
    if (password !== confirm_password) {
      return res.status(400).send('password and confirm password does not match!!')
    };

    function generateOTP(max) {
      return Math.floor(Math.random() * max)
    };

    const salt = await bcrypt.genSalt(10);
    var otp = generateOTP(999999);
    console.log(otp)
    const encryptOTP = await bcrypt.hash(otp.toString(), salt);
    console.log(generateOTP)

    const user = await User.create({ ...data, encryptOTP, profileImage: result.url });
    return res.status(200).send(user)

  })

});

router.put('/follow/:id', async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } })
        await currentUser.updateOne({ $push: { following: req.params.id } })
        return res.status(200).send('user has been followed!!')
      } else {
        return res.status(403).send('you already follow this user!!')
      }
    } catch (error) {
      return res.status(500).send(error)
    }

  } else {
    res.status(403).send('you can not follow yourself!!')
  }
});

router.put('/unfollow/:id', async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } })
        await currentUser.updateOne({ $pull: { following: req.params.id } })
        return res.status(200).send('user has been unfollowed!!')
      } else {
        return res.status(403).send('you dont follow this user!!')
      }
    } catch (error) {
      return res.status(500).send(error)
    }

  } else {
    res.status(403).send('you can not unfollow yourself!!')
  }
});

module.exports = router;


