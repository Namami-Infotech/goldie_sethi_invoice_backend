const express = require('express');
const router = express.Router();

const itemRoutes = require('../modules/item/item.routes');
const userRoutes = require('../modules/user/user.routes');
const settingRoutes = require('../modules/setting/setting.routes');
const invoiceRoutes = require('../modules/invoice/invoice.routes');

router.use('/items', itemRoutes);
router.use('/users', userRoutes);
router.use('/settings', settingRoutes);
router.use('/invoices', invoiceRoutes);

module.exports = router;
