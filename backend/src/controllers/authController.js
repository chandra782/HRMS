const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Organisation, User, Log } = require('../models');

const registerOrganisation = async (req, res) => {
  try {
    const { orgName, adminName, email, password } = req.body;

    if (!orgName || !adminName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if organisation already exists
    const existingOrg = await Organisation.findOne({ where: { name: orgName } });
    if (existingOrg) {
      return res.status(400).json({ error: 'Organisation name already taken' });
    }

    // Check if user email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create organisation
    const organisation = await Organisation.create({ name: orgName });

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Create admin user
    const user = await User.create({
      organisation_id: organisation.id,
      email,
      password_hash,
      name: adminName
    });

    // Log registration
    await Log.create({
      organisation_id: organisation.id,
      user_id: user.id,
      action: 'register',
      meta: { orgName, adminName, email }
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, orgId: organisation.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Organisation registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        organisation_id: organisation.id
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Log login
    await Log.create({
      organisation_id: user.organisation_id,
      user_id: user.id,
      action: 'login',
      meta: { email }
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, orgId: user.organisation_id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        organisation_id: user.organisation_id
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  registerOrganisation,
  login
};
