const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
    default: 'black',
  },
  icon: {
    type: String,
  },
});
const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
