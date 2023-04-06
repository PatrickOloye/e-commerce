const mongoose = require('mongoose');
const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res, next) => {
  try {
    const { email, userName, name, password } = req.body;
    if (!name || !email || !userName || !password)
      return res.status(500).json({ msg: 'please input all required fields' });

    const emailExists = await User.findOne({ email: req.body.email });
    const userNameExists = await User.findOne({ userName: req.body.userName });

    if (emailExists)
      return res.status(404).json({ msg: 'email already exists' });
    if (userNameExists)
      return res.status(404).json({ msg: 'userName already exists' });
    const newUser = new User({
      name: req.body.name,
      userName: req.body.userName,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 12),
      phone: req.body.phone,
    });

    await newUser.save();
    // console.log(newUser);
    res.status(200).json({ status: 'success', data: newUser });
  } catch (error) {
    console.log(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    if (!users)
      return res
        .status(500)
        .json({ msg: 'there are no users in the database' });

    res.status(200).json({ status: 'successful', Data: users });
  } catch (error) {
    console.log(error);
  }
};

exports.getUser = async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ msg: 'user not found' });

  res.status(200).json({ status: 'success', data: user });
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const secret = process.env.JWT_SECRET;
    if (!user) return res.status(404).json({ msg: 'user not found' });
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      const token = jwt.sign(
        { userId: user.id, isAdmin: user.isAdmin },
        secret,
        { expiresIn: '1m ' }
      );
      return res.status(200).json({ user: user.email, token });
    } else {
      res.status(400).json({ msg: 'password is incorrect' });
    }
  } catch (error) {
    console.log('error');
  }
};

exports.userCount = async (req, res, next) => {
  const userCount = await User.countDocuments((count) => count);

  if (!userCount) {
    res.status(500).json({ success: false });
  }

  res.status(200).json({ userCount });
};

exports.deleteUser = async (req, res, next) => {
  try {
    //to check if the object id is valid
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ msg: 'invalid object is' });
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res.status(404).json({ status: false, msg: 'product not found' });

    return res.status(200).json({ status: 'success', msg: 'product deleted' });
  } catch (error) {
    return res.status(500).json({ status: 'failed', error });
  }
};
