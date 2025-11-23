const { Team, Employee, EmployeeTeam, Log } = require('../models');

const createTeam = async (req, res) => {
  try {
    const { name, description } = req.body;
    const { orgId, userId } = req.user;

    if (!name) {
      return res.status(400).json({ error: 'Team name is required' });
    }

    const team = await Team.create({
      organisation_id: orgId,
      name,
      description
    });

    // Log action
    await Log.create({
      organisation_id: orgId,
      user_id: userId,
      action: 'team_create',
      meta: { teamId: team.id, name, description }
    });

    res.status(201).json({
      message: 'Team created successfully',
      team
    });
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const listTeams = async (req, res) => {
  try {
    const { orgId } = req.user;

    const teams = await Team.findAll({
      where: { organisation_id: orgId },
      include: [{
        model: Employee,
        as: 'employees',
        through: { attributes: ['assigned_at'] }
      }]
    });

    res.json({ teams });
  } catch (error) {
    console.error('List teams error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const { orgId, userId } = req.user;

    const team = await Team.findOne({
      where: { id, organisation_id: orgId }
    });

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    await team.update({
      name: name || team.name,
      description: description !== undefined ? description : team.description
    });

    // Log action
    await Log.create({
      organisation_id: orgId,
      user_id: userId,
      action: 'team_update',
      meta: { teamId: id, updates: { name, description } }
    });

    res.json({
      message: 'Team updated successfully',
      team
    });
  } catch (error) {
    console.error('Update team error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { orgId, userId } = req.user;

    const team = await Team.findOne({
      where: { id, organisation_id: orgId }
    });

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Delete all employee assignments first
    await EmployeeTeam.destroy({
      where: { team_id: id }
    });

    await team.destroy();

    // Log action
    await Log.create({
      organisation_id: orgId,
      user_id: userId,
      action: 'team_delete',
      meta: { teamId: id }
    });

    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    console.error('Delete team error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const assignEmployeeToTeam = async (req, res) => {
  try {
    const { teamId, employeeId } = req.body;
    const { orgId, userId } = req.user;

    if (!teamId || !employeeId) {
      return res.status(400).json({ error: 'Team ID and Employee ID are required' });
    }

    // Verify team belongs to organisation
    const team = await Team.findOne({
      where: { id: teamId, organisation_id: orgId }
    });

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Verify employee belongs to organisation
    const employee = await Employee.findOne({
      where: { id: employeeId, organisation_id: orgId }
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Check if assignment already exists
    const existingAssignment = await EmployeeTeam.findOne({
      where: { employee_id: employeeId, team_id: teamId }
    });

    if (existingAssignment) {
      return res.status(400).json({ error: 'Employee already assigned to this team' });
    }

    // Create assignment
    const assignment = await EmployeeTeam.create({
      employee_id: employeeId,
      team_id: teamId,
      assigned_at: new Date()
    });

    // Log action
    await Log.create({
      organisation_id: orgId,
      user_id: userId,
      action: 'team_assign',
      meta: { teamId, employeeId }
    });

    res.status(201).json({
      message: 'Employee assigned to team successfully',
      assignment
    });
  } catch (error) {
    console.error('Assign employee error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const unassignEmployeeFromTeam = async (req, res) => {
  try {
    const { teamId, employeeId } = req.body;
    const { orgId, userId } = req.user;

    if (!teamId || !employeeId) {
      return res.status(400).json({ error: 'Team ID and Employee ID are required' });
    }

    // Verify team belongs to organisation
    const team = await Team.findOne({
      where: { id: teamId, organisation_id: orgId }
    });

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Verify employee belongs to organisation
    const employee = await Employee.findOne({
      where: { id: employeeId, organisation_id: orgId }
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Find and delete assignment
    const assignment = await EmployeeTeam.findOne({
      where: { employee_id: employeeId, team_id: teamId }
    });

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    await assignment.destroy();

    // Log action
    await Log.create({
      organisation_id: orgId,
      user_id: userId,
      action: 'team_unassign',
      meta: { teamId, employeeId }
    });

    res.json({ message: 'Employee unassigned from team successfully' });
  } catch (error) {
    console.error('Unassign employee error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createTeam,
  listTeams,
  updateTeam,
  deleteTeam,
  assignEmployeeToTeam,
  unassignEmployeeFromTeam
};
