const Message = require('../models/Message');
const { OpenAI } = require('openai');

exports.sendMessage = async (req, res) => {
  try {
    const { sender, receiver, content } = req.body;
    if (!sender || !receiver) {
      return res.status(400).json({ error: 'Sender and receiver are required' });
    }
    const message = new Message({
      sender,
      receiver,
      content
    });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { userId, otherUserId } = req.params;
    
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update message
exports.updateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    // Only update content, don't overwrite sender/receiver
    const message = await Message.findById(id);
    if (!message) return res.status(404).json({ error: 'Message not found' });
    message.content = content;
    await message.save();
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete message
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findByIdAndDelete(id);
    if (!message) return res.status(404).json({ error: 'Message not found' });
    res.json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.aiChat = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: 'https://api.aimlapi.com/v1',
    });
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 256,
      temperature: 0.7,
    });
    const aiMessage = completion.choices[0].message.content;
    res.json({ reply: aiMessage });
  } catch (err) {
    console.error('AI Chat error:', err.message);
    res.status(500).json({ error: 'AI service error' });
  }
};