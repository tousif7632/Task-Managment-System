const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middlewares/authMiddleware');

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/logout', auth, authController.logout);

router.get('/users', auth, authController.getUsers);

module.exports = router;