const mongoose = require('mongoose');
const Category = require('../model/category');

exports.createCat = async (req, res, next) => {
  try {
    const { name, icon, color } = req.body;
    if (!name || !icon)
      return next(
        res
          .status(501)
          .json({ msg: 'please provide the name and color of the category' })
      );
    let category = new Category({
      name,
      color,
      icon,
    });
    category = await category.save();

    res.status(200).json({
      status: 'successful',
      data: category,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteCat = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndRemove(req.params.id);
    if (!category) {
      return res.status(404).json({ msg: 'category not found' });
    }
    res
      .status(200)
      .json({ status: 'successful', msg: 'category successfully deleted' });
  } catch (error) {
    return res.status(400).json({ success: false, error });
  }
};

exports.getAllCat = async (req, res, next) => {
  try {
    const category = await Category.find();
    if (!category)
      return res.status(404).json({ msg: 'there are no categories available' });
    res.status(200).json({ status: 'successful', data: category });
  } catch (error) {
    res.status(500).json({ status: 'something went wrong', error });
  }
};

exports.getCat = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(400).json({ msg: 'category not found' });
    }
    res.status(200).json({ status: 'successful', data: category });
  } catch (error) {
    res.status(500).json({ msg: 'something went wrong', error });
  }
};

exports.updateCat = async (req, res, next) => {
  const { name, icon, color } = req.body;
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name,
      icon,
      color,
    },
    { new: true }
  );
  if (!category) return res.status(404).json({ msg: 'category not found' });
  res.status(200).json({ msg: 'category updated', data: category });
};
