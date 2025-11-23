import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import TeamForm from '../components/TeamForm'
import './Employees.css'

const Teams = () => {
  const [teams, setTeams] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [editingTeam, setEditingTeam] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchTeams()
    fetchEmployees()
  }, [])

  const fetchTeams = async () => {
    try {
      setLoading(true)
      const response = await api.get('/teams')
      setTeams(response.data.teams || [])
    } catch (err) {
      setError('Failed to fetch teams')
    } finally {
      setLoading(false)
    }
  }

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employees')
      setEmployees(response.data.employees || [])
    } catch (err) {
      console.error('Failed to fetch employees:', err)
    }
  }

  const handleCreate = () => {
    setEditingTeam(null)
    setShowModal(true)
  }

  const handleEdit = (team) => {
    setEditingTeam(team)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team?')) {
      return
    }

    try {
      await api.delete(`/teams/${id}`)
      setSuccess('Team deleted successfully')
      fetchTeams()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete team')
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleAssign = (team) => {
    setSelectedTeam(team)
    setShowAssignModal(true)
  }

  const handleFormSubmit = async (formData) => {
    try {
      if (editingTeam) {
        await api.put(`/teams/${editingTeam.id}`, formData)
        setSuccess('Team updated successfully')
      } else {
        await api.post('/teams', formData)
        setSuccess('Team created successfully')
      }
      setShowModal(false)
      setEditingTeam(null)
      fetchTeams()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save team')
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleAssignmentSubmit = async (selectedEmployeeIds) => {
    if (!selectedTeam) return

    try {
      // Get current assignments
      const currentTeam = teams.find(t => t.id === selectedTeam.id)
      const currentEmployeeIds = (currentTeam?.employees || []).map(e => e.id)

      // Find employees to add and remove
      const toAdd = selectedEmployeeIds.filter(id => !currentEmployeeIds.includes(id))
      const toRemove = currentEmployeeIds.filter(id => !selectedEmployeeIds.includes(id))

      // Perform assignments
      for (const employeeId of toAdd) {
        await api.post('/teams/assign', {
          teamId: selectedTeam.id,
          employeeId
        })
      }

      // Perform unassignments
      for (const employeeId of toRemove) {
        await api.post('/teams/unassign', {
          teamId: selectedTeam.id,
          employeeId
        })
      }

      setSuccess('Team assignments updated successfully')
      setShowAssignModal(false)
      setSelectedTeam(null)
      fetchTeams()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update assignments')
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="employees-container">
      <nav className="navbar">
        <h1>HRMS - Teams</h1>
        <div className="nav-items">
          <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
            Dashboard
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/employees')}>
            Employees
          </button>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="container">
        <div className="page-header">
          <h2>Teams</h2>
          <button className="btn btn-primary" onClick={handleCreate}>
            Create Team
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {loading ? (
          <div className="loading">Loading teams...</div>
        ) : (
          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Members</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teams.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center' }}>
                      No teams found. Create one to get started.
                    </td>
                  </tr>
                ) : (
                  teams.map((team) => (
                    <tr key={team.id}>
                      <td>{team.name}</td>
                      <td>{team.description || 'N/A'}</td>
                      <td>
                        {team.employees && team.employees.length > 0 ? (
                          `${team.employees.length} member(s): ${team.employees.map(e => `${e.first_name} ${e.last_name}`).join(', ')}`
                        ) : (
                          'No members'
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-success"
                          onClick={() => handleAssign(team)}
                          style={{ marginRight: '10px' }}
                        >
                          Assign
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleEdit(team)}
                          style={{ marginRight: '10px' }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(team.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <h2>{editingTeam ? 'Edit Team' : 'Create Team'}</h2>
                <button className="close-btn" onClick={() => setShowModal(false)}>
                  ×
                </button>
              </div>
              <TeamForm
                team={editingTeam}
                onSubmit={handleFormSubmit}
                onCancel={() => setShowModal(false)}
              />
            </div>
          </div>
        )}

        {showAssignModal && selectedTeam && (
          <div className="modal">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Assign Employees to {selectedTeam.name}</h2>
                <button className="close-btn" onClick={() => setShowAssignModal(false)}>
                  ×
                </button>
              </div>
              <TeamAssignmentForm
                team={selectedTeam}
                employees={employees}
                onSubmit={handleAssignmentSubmit}
                onCancel={() => setShowAssignModal(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const TeamAssignmentForm = ({ team, employees, onSubmit, onCancel }) => {
  const [selectedIds, setSelectedIds] = useState(
    (team.employees || []).map(e => e.id)
  )

  const handleToggle = (employeeId) => {
    setSelectedIds(prev =>
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(selectedIds)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Select Employees:</label>
        <div className="checkbox-group">
          {employees.length === 0 ? (
            <p>No employees available. Create employees first.</p>
          ) : (
            employees.map((employee) => (
              <div key={employee.id} className="checkbox-item">
                <input
                  type="checkbox"
                  id={`emp-${employee.id}`}
                  checked={selectedIds.includes(employee.id)}
                  onChange={() => handleToggle(employee.id)}
                />
                <label htmlFor={`emp-${employee.id}`}>
                  {employee.first_name} {employee.last_name} ({employee.email})
                </label>
              </div>
            ))
          )}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button type="submit" className="btn btn-primary">
          Save Assignments
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default Teams
