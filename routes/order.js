const {
  createOrder,
  getAll,
  getOne,
  updateOrder,
  deleteOrder,
  orderHistory,
} = require('../controller/order');

const router = require('express').Router();

router.post('/createOrder', createOrder);
router.get('/getAll', getAll);
router.get('/getOne/:id', getOne);
router.patch('/update/:id', updateOrder);
router.delete('/delete/:id', deleteOrder);
router.get('/userOrders/:userId', orderHistory);
module.exports = router;
