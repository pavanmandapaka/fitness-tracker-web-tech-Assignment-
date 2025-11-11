import React, { useState } from 'react';
import './Modal.css';

const GoalForm = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'weight',
    target: '',
    current: '',
    unit: 'kg',
    deadline: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTypeChange = (e) => {
    const type = e.target.value;
    let unit = '';
    
    switch(type) {
      case 'weight':
        unit = 'kg';
        break;
      case 'workouts':
        unit = 'sessions';
        break;
      case 'calories':
        unit = 'kcal';
        break;
      case 'distance':
        unit = 'km';
        break;
      default:
        unit = '';
    }

    setFormData(prev => ({
      ...prev,
      type,
      unit
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.target) {
      alert('Please fill in goal title and target');
      return;
    }

    onSave({
      ...formData,
      target: parseFloat(formData.target),
      current: parseFloat(formData.current) || 0
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🎯 Set Goal</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="title">Goal Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Lose 5kg"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type">Goal Type</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleTypeChange}
              >
                <option value="weight">Weight</option>
                <option value="workouts">Workouts</option>
                <option value="calories">Calories</option>
                <option value="distance">Distance</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="unit">Unit</label>
              <input
                type="text"
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                placeholder="kg, km, etc."
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="current">Current Value</label>
              <input
                type="number"
                id="current"
                name="current"
                value={formData.current}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="0.1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="target">Target Value *</label>
              <input
                type="number"
                id="target"
                name="target"
                value={formData.target}
                onChange={handleChange}
                placeholder="100"
                min="0"
                step="0.1"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="deadline">Deadline</label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your goal..."
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Set Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalForm;
