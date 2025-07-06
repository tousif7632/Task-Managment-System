const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, chatController.sendMessage);
router.get('/:userId/:otherUserId', authMiddleware, chatController.getMessages);
router.put('/:id', authMiddleware, chatController.updateMessage);
router.delete('/:id', authMiddleware, chatController.deleteMessage);
router.post('/ai', chatController.aiChat);

module.exports = router;