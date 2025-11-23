import React, { useState } from 'react';
import './Modal.css';

const WorkoutForm = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    type: '',
    duration: '',
    intensity: 'medium',
    caloriesBurned: '',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.type || !formData.duration) {
      alert('Please fill in workout type and duration');
      return;
    }

    onSave({
      ...formData,
      duration: parseInt(formData.duration),
      caloriesBurned: parseInt(formData.caloriesBurned) || 0
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2> Add Workout</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="type">Workout Type *</label>
            <input
              type="text"
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              placeholder="e.g., Running, Cycling, Yoga"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="duration">Duration (minutes) *</label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="30"
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="caloriesBurned">Calories Burned</label>
              <input
                type="number"
                id="caloriesBurned"
                name="caloriesBurned"
                value={formData.caloriesBurned}
                onChange={handleChange}
                placeholder="200"
                min="0"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="intensity">Intensity</label>
              <select
                id="intensity"
                name="intensity"
                value={formData.intensity}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="How did the workout feel?"
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Workout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkoutForm;
