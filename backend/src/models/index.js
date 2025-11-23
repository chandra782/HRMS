const Organisation = require('./organisation');
const User = require('./user');
const Employee = require('./employee');
const Team = require('./team');
const EmployeeTeam = require('./employeeTeam');
const Log = require('./log');

// Organisation associations
Organisation.hasMany(User, { foreignKey: 'organisation_id', as: 'users' });
Organisation.hasMany(Employee, { foreignKey: 'organisation_id', as: 'employees' });
Organisation.hasMany(Team, { foreignKey: 'organisation_id', as: 'teams' });
Organisation.hasMany(Log, { foreignKey: 'organisation_id', as: 'logs' });

// User associations
User.belongsTo(Organisation, { foreignKey: 'organisation_id', as: 'organisation' });
User.hasMany(Log, { foreignKey: 'user_id', as: 'logs' });

// Employee associations
Employee.belongsTo(Organisation, { foreignKey: 'organisation_id', as: 'organisation' });
Employee.belongsToMany(Team, {
  through: EmployeeTeam,
  foreignKey: 'employee_id',
  otherKey: 'team_id',
  as: 'teams'
});

// Team associations
Team.belongsTo(Organisation, { foreignKey: 'organisation_id', as: 'organisation' });
Team.belongsToMany(Employee, {
  through: EmployeeTeam,
  foreignKey: 'team_id',
  otherKey: 'employee_id',
  as: 'employees'
});

// EmployeeTeam associations
EmployeeTeam.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });
EmployeeTeam.belongsTo(Team, { foreignKey: 'team_id', as: 'team' });

// Log associations
Log.belongsTo(Organisation, { foreignKey: 'organisation_id', as: 'organisation' });
Log.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = {
  Organisation,
  User,
  Employee,
  Team,
  EmployeeTeam,
  Log
};
