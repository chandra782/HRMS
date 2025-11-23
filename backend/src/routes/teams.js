const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  createTeam,
  listTeams,
  updateTeam,
  deleteTeam,
  assignEmployeeToTeam,
  unassignEmployeeFromTeam
} = require('../controllers/teamController');

// All routes require authentication
router.use(authMiddleware);

router.post('/', createTeam);
router.get('/', listTeams);
router.put('/:id', updateTeam);
router.delete('/:id', deleteTeam);
router.post('/assign', assignEmployeeToTeam);
router.post('/unassign', unassignEmployeeFromTeam);

module.exports = router;
