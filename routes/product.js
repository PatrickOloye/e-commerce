const {
  createPro,
  getAllPro,
  getPro,
  updatePro,
  deletePro,
  getProCount,
  getFeatured,
} = require('../controller/product');

const router = require('express').Router();

router.post('/create', createPro);
router.get('/getAll', getAllPro);
router.get('/getPro/:id', getPro);
router.patch('/updatePro/:id', updatePro);
router.delete('/deletePro/:id', deletePro);
router.get('/getCount', getProCount);
router.get('/getFeatured/:count', getFeatured);

module.exports = router;
