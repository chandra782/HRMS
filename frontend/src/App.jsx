import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import RegisterOrg from './pages/RegisterOrg'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import Teams from './pages/Teams'

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterOrg />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/employees"
        element={
          <PrivateRoute>
            <Employees />
          </PrivateRoute>
        }
      />
      <Route
        path="/teams"
        element={
          <PrivateRoute>
            <Teams />
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  )
}

export default App
