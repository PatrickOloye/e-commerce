const express = require('express');
const router = express.Router();
const {
  createCat,
  deleteCat,
  getAllCat,
  getCat,
  updateCat,
} = require('../controller/category');

router.post('/create', createCat);
router.delete('/delete/:id', deleteCat);
router.get('/getAll', getAllCat);
router.get('/get/:id', getCat);
router.patch('/update/:id', updateCat);

module.exports = router;
