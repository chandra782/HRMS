import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import EmployeeForm from '../components/EmployeeForm'
import './Employees.css'

const Employees = () => {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const response = await api.get('/employees')
      setEmployees(response.data.employees || [])
    } catch (err) {
      setError('Failed to fetch employees')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingEmployee(null)
    setShowModal(true)
  }

  const handleEdit = (employee) => {
    setEditingEmployee(employee)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return
    }

    try {
      await api.delete(`/employees/${id}`)
      setSuccess('Employee deleted successfully')
      fetchEmployees()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete employee')
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleFormSubmit = async (formData) => {
    try {
      if (editingEmployee) {
        await api.put(`/employees/${editingEmployee.id}`, formData)
        setSuccess('Employee updated successfully')
      } else {
        await api.post('/employees', formData)
        setSuccess('Employee created successfully')
      }
      setShowModal(false)
      setEditingEmployee(null)
      fetchEmployees()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save employee')
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
        <h1>HRMS - Employees</h1>
        <div className="nav-items">
          <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
            Dashboard
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/teams')}>
            Teams
          </button>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="container">
        <div className="page-header">
          <h2>Employees</h2>
          <button className="btn btn-primary" onClick={handleCreate}>
            Add Employee
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {loading ? (
          <div className="loading">Loading employees...</div>
        ) : (
          <div className="card">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Teams</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center' }}>
                      No employees found. Create one to get started.
                    </td>
                  </tr>
                ) : (
                  employees.map((employee) => (
                    <tr key={employee.id}>
                      <td>{employee.first_name} {employee.last_name}</td>
                      <td>{employee.email}</td>
                      <td>{employee.phone || 'N/A'}</td>
                      <td>
                        {employee.teams && employee.teams.length > 0 ? (
                          employee.teams.map(team => team.name).join(', ')
                        ) : (
                          'No teams'
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleEdit(employee)}
                          style={{ marginRight: '10px' }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(employee.id)}
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
                <h2>{editingEmployee ? 'Edit Employee' : 'Add Employee'}</h2>
                <button className="close-btn" onClick={() => setShowModal(false)}>
                  ×
                </button>
              </div>
              <EmployeeForm
                employee={editingEmployee}
                onSubmit={handleFormSubmit}
                onCancel={() => setShowModal(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Employees
