import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import './Dashboard.css'

const Dashboard = () => {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({
    employees: 0,
    teams: 0
  })
  const navigate = useNavigate()

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      setUser(JSON.parse(userStr))
    }

    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [employeesRes, teamsRes] = await Promise.all([
        api.get('/employees'),
        api.get('/teams')
      ])
      setStats({
        employees: employeesRes.data.employees?.length || 0,
        teams: teamsRes.data.teams?.length || 0
      })
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <h1>HRMS Dashboard</h1>
        <div className="nav-items">
          {user && <span className="user-info">Welcome, {user.name}</span>}
          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="container">
        <div className="dashboard-header">
          <h2>Overview</h2>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Employees</h3>
            <p className="stat-number">{stats.employees}</p>
            <button className="btn btn-primary" onClick={() => navigate('/employees')}>
              Manage Employees
            </button>
          </div>

          <div className="stat-card">
            <h3>Total Teams</h3>
            <p className="stat-number">{stats.teams}</p>
            <button className="btn btn-primary" onClick={() => navigate('/teams')}>
              Manage Teams
            </button>
          </div>
        </div>

        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button className="btn btn-success" onClick={() => navigate('/employees')}>
              Add Employee
            </button>
            <button className="btn btn-success" onClick={() => navigate('/teams')}>
              Create Team
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
