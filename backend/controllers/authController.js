const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendEmail } = require('../utils/mailer');

//Register Controller
exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user (role included from request or defaults to 'user')
    user = new User({ username, email, password, role }); 
    await user.save();

    // Generate token
    const token = user.generateAuthToken();

    // Send welcome email
    await sendEmail(
      email,
      'Welcome to Trello Lite',
      `Hi ${username}, welcome to our platform!`
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

//  Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = user.generateAuthToken();

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

//  Logout Controller
exports.logout = async (req, res) => {
  try {
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

//Get Users Controller
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }).select('username email role');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};
