const express = require('express');
const router = express.Router();

const {
  getCustomerOrder,
  createCustomerOrder,
  updateCustomerOrder,
  deleteCustomerOrder,
  getAllOrders,
  getSalesStatistics,
  getCategorySalesStatistics
} = require('../controllers/customer_orders');

// Statistics routes MUST be defined before /:id
router.get('/sales-statistics', getSalesStatistics);
router.get('/category-statistics', getCategorySalesStatistics);

router.route('/')
  .get(getAllOrders)
  .post(createCustomerOrder);

router.route('/:id')
  .get(getCustomerOrder)
  .put(updateCustomerOrder)
  .delete(deleteCustomerOrder);

module.exports = router;