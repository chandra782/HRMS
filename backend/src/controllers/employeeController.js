const { Employee, Team, EmployeeTeam, Log } = require('../models');

const createEmployee = async (req, res) => {
  try {
    const { first_name, last_name, email, phone } = req.body;
    const { orgId, userId } = req.user;

    if (!first_name || !last_name || !email) {
      return res.status(400).json({ error: 'First name, last name, and email are required' });
    }

    const employee = await Employee.create({
      organisation_id: orgId,
      first_name,
      last_name,
      email,
      phone
    });

    // Log action
    await Log.create({
      organisation_id: orgId,
      user_id: userId,
      action: 'employee_create',
      meta: { employeeId: employee.id, first_name, last_name, email }
    });

    res.status(201).json({
      message: 'Employee created successfully',
      employee
    });
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const listEmployees = async (req, res) => {
  try {
    const { orgId } = req.user;

    const employees = await Employee.findAll({
      where: { organisation_id: orgId },
      include: [{
        model: Team,
        as: 'teams',
        through: { attributes: ['assigned_at'] }
      }]
    });

    res.json({ employees });
  } catch (error) {
    console.error('List employees error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, phone } = req.body;
    const { orgId, userId } = req.user;

    const employee = await Employee.findOne({
      where: { id, organisation_id: orgId }
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    await employee.update({
      first_name: first_name || employee.first_name,
      last_name: last_name || employee.last_name,
      email: email || employee.email,
      phone: phone !== undefined ? phone : employee.phone
    });

    // Log action
    await Log.create({
      organisation_id: orgId,
      user_id: userId,
      action: 'employee_update',
      meta: { employeeId: id, updates: { first_name, last_name, email, phone } }
    });

    res.json({
      message: 'Employee updated successfully',
      employee
    });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { orgId, userId } = req.user;

    const employee = await Employee.findOne({
      where: { id, organisation_id: orgId }
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Delete all team assignments first
    await EmployeeTeam.destroy({
      where: { employee_id: id }
    });

    await employee.destroy();

    // Log action
    await Log.create({
      organisation_id: orgId,
      user_id: userId,
      action: 'employee_delete',
      meta: { employeeId: id }
    });

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createEmployee,
  listEmployees,
  updateEmployee,
  deleteEmployee
};
