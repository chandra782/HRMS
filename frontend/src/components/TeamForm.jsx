import React, { useState, useEffect } from 'react'

const TeamForm = ({ team, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name || '',
        description: team.description || ''
      })
    }
  }, [team])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      })
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Team name is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Team Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        {errors.name && <div className="error">{errors.name}</div>}
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button type="submit" className="btn btn-primary">
          {team ? 'Update' : 'Create'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default TeamForm
