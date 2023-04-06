const Product = require('../model/product');
const Category = require('../model/category');
const mongoose = require('mongoose');

exports.createPro = async (req, res, next) => {
  try {
    const {
      name,
      description,
      richDescription,
      image,
      brand,
      price,
      category,
      countInStore,
      rating,
      numReviews,
      isFeatured,
    } = req.body;

    let newProduct = new Product({
      name,
      description,
      richDescription,
      image,
      brand,
      price,
      category,
      countInStore,
      rating,
      numReviews,
      isFeatured,
    });
    const prodCategory = await Category.findById(req.body.category);
    if (!prodCategory) return res.status(400).json({ msg: 'Invalid Category' });
    if (!name || !description || !countInStore) {
      res
        .status(404)
        .json({ status: 'failed', msg: 'please input the required fields' });
    }
    newProduct = await newProduct.save();
    if (!newProduct)
      return res.status(500).json({ msg: 'product cannot be created' });
    return res.status(200).json({ status: 'success', data: newProduct });
  } catch (error) {
    console.log(error);
  }
};

//getting products according to categories
exports.getAllPro = async (req, res, next) => {
  try {
    let filter = {};
    if (req.query.categories) {
      filter = { category: req.query.categories.split(',') };
    }
    const product = await Product.find(filter).populate('category');
    //select gives specific data (the - is to remove the id)
    if (!product)
      return res
        .status(404)
        .json({ status: 'failed', msg: 'no products found' });

    return res.status(200).json({ status: 'success', data: product });
  } catch (error) {
    console.log(error);
  }
};

exports.getPro = async (req, res, next) => {
  try {
    //to check if the object id is valid
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ msg: 'invalid object is' });
    }

    const product = await Product.findById(req.params.id).populate('category');
    //populate means any model or id or field attached to a particular id would be displayed
    if (!product)
      return res.status(400).json({ msg: 'product does not exist' });

    return res.status(200).json({ status: 'successful', data: product });
  } catch (error) {
    return res.status(500).json({ status: 'failure', error });
  }
};

exports.updatePro = async (req, res, next) => {
  try {
    //to check if the object id is valid
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ msg: 'invalid object is' });
    const {
      name,
      description,
      richDescription,
      image,
      brand,
      price,
      category,
      countInStore,
      rating,
      numReviews,
      isFeatured,
    } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        richDescription,
        image,
        brand,
        price,
        category,
        countInStore,
        rating,
        numReviews,
        isFeatured,
      },
      { new: true }
    );
    const prodCategory = await Category.findById(req.body.category);
    if (!prodCategory) return res.status(400).json({ msg: 'Invalid Category' });
    if (!product)
      return res
        .status(500)
        .json({ status: 'failure', msg: 'product cannot be updated' });

    return res.status(200).json({ status: 'successful', data: product });
  } catch (error) {
    return res.status(500).json({ status: 'failure', error });
  }
};

exports.deletePro = async (req, res, next) => {
  try {
    //to check if the object id is valid
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).json({ msg: 'invalid object is' });
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res.status(404).json({ status: false, msg: 'product not found' });

    return res.status(200).json({ status: 'success', msg: 'product deleted' });
  } catch (error) {
    return res.status(500).json({ status: 'failed', error });
  }
};

exports.getProCount = async (req, res, next) => {
  try {
    const productCount = await Product.countDocuments();
    if (!productCount)
      return res
        .status(400)
        .json({ status: 'failed', msg: 'no products found' });

    res.status(200).json({ status: 'successful', data: productCount });
  } catch (error) {
    console.log(error);
  }
};

exports.getFeatured = async (req, res, next) => {
  const count = req.params.count ? req.params.count : 0; //we are getting the counts of the featured products
  const featuredProduct = await Product.find({ isFeatured: true }).limit(
    +count
  ); // we are filtering for products that have isFeatured to be true
  if (!featuredProduct)
    return res.status(500).json({ status: 'failed', msg: 'request failed' });

  res.status(200).json({ data: featuredProduct });
};
