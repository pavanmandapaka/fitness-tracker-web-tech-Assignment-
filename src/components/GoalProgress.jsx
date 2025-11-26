import React, { useState } from 'react';
import './GoalProgress.css';
import { IoClose } from 'react-icons/io5';

const GoalProgress = ({ goals, onUpdateProgress, onDeleteGoal }) => {
  const [editingGoal, setEditingGoal] = useState(null);
  const [progressValue, setProgressValue] = useState('');

  const handleUpdateProgress = (goalId) => {
    if (progressValue !== '') {
      onUpdateProgress(goalId, parseFloat(progressValue));
      setEditingGoal(null);
      setProgressValue('');
    }
  };

  const calculateProgress = (goal) => {
    if (goal.type === 'weight') {
      const totalChange = goal.current - goal.target;
      const currentChange = goal.current - (goal.progress || goal.current);
      return Math.min(100, Math.max(0, (currentChange / totalChange) * 100));
    } else {
      return Math.min(100, (goal.progress / goal.target) * 100);
    }
  };

  if (goals.length === 0) {
    return (
      <div className="empty-state">
        <p>No goals set yet. Create your first goal to start tracking!</p>
      </div>
    );
  }

  return (
    <div className="goals-grid">
      {goals.map(goal => {
        const progress = calculateProgress(goal);
        const isEditing = editingGoal === goal.id;

        return (
          <div key={goal.id} className="goal-card">
            <div className="goal-header">
              <h3 className="goal-title">{goal.title}</h3>
              <button 
                className="delete-icon-btn"
                onClick={() => onDeleteGoal(goal.id)}
                title="Delete goal"
              >
                <IoClose />
              </button>
            </div>
            
            {goal.description && (
              <p className="goal-description">{goal.description}</p>
            )}

            <div className="goal-stats">
              <div className="stat-item">
                <span className="stat-label">Progress:</span>
                <span className="stat-value">{goal.progress || 0} / {goal.target} {goal.unit}</span>
              </div>
              {goal.deadline && (
                <div className="stat-item">
                  <span className="stat-label">Deadline:</span>
                  <span className="stat-value">
                    {new Date(goal.deadline).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            <div className="progress-ring-container">
              <svg className="progress-ring" viewBox="0 0 120 120">
                <circle
                  className="progress-ring-bg"
                  cx="60"
                  cy="60"
                  r="50"
                />
                <circle
                  className="progress-ring-fill"
                  cx="60"
                  cy="60"
                  r="50"
                  strokeDasharray={`${(progress * 314) / 100} 314`}
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div className="progress-text">
                <span className="progress-percentage">{Math.round(progress)}%</span>
              </div>
            </div>

            <div className="goal-actions">
              {isEditing ? (
                <div className="update-progress-form">
                  <input
                    type="number"
                    value={progressValue}
                    onChange={(e) => setProgressValue(e.target.value)}
                    onWheel={(e) => e.target.blur()}
                    placeholder="New progress"
                    className="progress-input"
                    step="0.1"
                  />
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => handleUpdateProgress(goal.id)}
                  >
                    Update
                  </button>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setEditingGoal(null);
                      setProgressValue('');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    setEditingGoal(goal.id);
                    setProgressValue(goal.progress || 0);
                  }}
                >
                  Update Progress
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GoalProgress;
