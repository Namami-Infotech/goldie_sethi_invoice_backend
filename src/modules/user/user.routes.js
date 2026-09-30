const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const authController = require('../auth/auth.controller');

router.post('/login', authController.login);
router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.post('/', userController.create);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);

module.exports = router;
