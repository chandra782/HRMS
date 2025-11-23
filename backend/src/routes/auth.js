const express = require('express');
const router = express.Router();
const { registerOrganisation, login } = require('../controllers/authController');

router.post('/register', registerOrganisation);
router.post('/login', login);

module.exports = router;
