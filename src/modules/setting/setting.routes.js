const express = require('express');
const router = express.Router();
const settingController = require('./setting.controller');

router.get('/', settingController.get);
router.put('/', settingController.update);

module.exports = router;
