const express = require('express');
const Category = require('../model/category');
const Order = require('../model/order');
const OrderItem = require('../model/orderItem');

exports.createOrder = async (req, res, next) => {
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });

      newOrderItem = await newOrderItem.save();

      return newOrderItem._id;
    })
  );
  const orderItemsIdsCleared = await orderItemsIds;

  const totalPrices = await Promise.all(
    orderItemsIdsCleared.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate(
        'product',
        'price'
      );
      const totalPrice = orderItem.product.price * orderItem.quantity;

      return totalPrice;
    })
  );

  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

  let order = new Order({
    orderItems: orderItemsIdsCleared,
    shippingAddress: req.body.shippingAddress,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: totalPrice,
    user: req.body.user,
  });
  order = await order.save();
  if (!order) return res.status(500).json({ status: 'failure' });

  return res.status(200).json({ data: order });
};

exports.getAll = async (req, res, next) => {
  const orderList = await Order.find()
    .populate('user', 'name')
    .sort({ dateOrdered: -1 }); // do ({'dateOrdered': -1}) if the one in the code doesn't work//we are populating, but we just want the name of the user and sorting by date of order and also from the newest to oldest. thats what the -1 is for

  if (!orderList) return res.status(500).json({ success: false });

  return res.status(200).json({ status: 'success', orderList });
};

exports.getOne = async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name')
    .populate({
      path: 'orderItems',
      populate: { path: 'product', populate: 'category' },
    });
  if (!order) return res.status(500).json({ success: false });

  res.status(200).json({ order });
};

exports.updateOrder = async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true }
  );
  if (!order)
    return res.status(400).json({ msg: 'update could not be updated' });
};

exports.deleteOrder = async (req, res, next) => {
  const order = await Order.findByIdAndRemove(req.params.id);
  if (order) {
    await order.orderItem.map(async (orderItem) => {
      await OrderItem.findByIdAndRemove(orderItem);
    });
    return res.status(200).json({ status: 'success', msg: 'order deleted' });
  }

  return res.status(404).json({ msg: 'order not found' });
};

exports.totalSales = async (req, res, next) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalsales: { $sum: '$totalPrice' } } },
  ]);
  if (!totalSales)
    return res.status(400).json({ msg: 'sales could not be generated' });

  return res.status(200).json(totalSales.pop().totalsales);
};

exports.getOrderCount = async (req, res, next) => {
  const orderCount = await Order.countDocuments((count) => count);
  if (!orderCount)
    return res.status(500).json({ msg: 'there are no messages' });

  return res.status(200).json(orderCount);
};

exports.orderHistory = async (req, res, next) => {
  const userOrderList = await Order.find({ user: req.params.userId })
    .populate({
      path: 'orderItems',
      populate: { path: 'product', populate: 'category' },
    })
    .sort({ dateordered: -1 });
  if (!userOrderList) return res.status(500).json({ msg: 'no user list' });

  return res.status(200).json(userOrderList);
};
