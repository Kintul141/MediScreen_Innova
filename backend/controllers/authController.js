const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, licenseId, doctorType } = req.body;

    // Validate input
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate role
    if (!['patient', 'doctor'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Validate doctor-specific fields
    if (role === 'doctor' && (!licenseId || !doctorType)) {
      return res.status(400).json({ message: 'License ID and Doctor Type are required for doctors' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create new user
    const userData = { name, email, password, role };
    if (role === 'doctor') {
      userData.licenseId = licenseId;
      userData.doctorType = doctorType;
    }
    
    const user = new User(userData);
    await user.save();

    // Generate JWT
    const tokenData = { 
      id: user._id, 
      email: user.email, 
      role: user.role, 
      name: user.name 
    };
    if (role === 'doctor') {
      tokenData.doctorType = user.doctorType;
      tokenData.licenseId = user.licenseId;
    }

    const token = jwt.sign(
      tokenData,
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '7d' }
    );

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    if (role === 'doctor') {
      userResponse.licenseId = user.licenseId;
      userResponse.doctorType = user.doctorType;
    }

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: userResponse,
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name, doctorType: user.doctorType, licenseId: user.licenseId },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '7d' }
    );

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    if (user.role === 'doctor') {
      userResponse.licenseId = user.licenseId;
      userResponse.doctorType = user.doctorType;
    }

    res.json({
      message: 'Login successful',
      token,
      user: userResponse,
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};
