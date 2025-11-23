const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  createEmployee,
  listEmployees,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController');

// All routes require authentication
router.use(authMiddleware);

router.post('/', createEmployee);
router.get('/', listEmployees);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

module.exports = router;
