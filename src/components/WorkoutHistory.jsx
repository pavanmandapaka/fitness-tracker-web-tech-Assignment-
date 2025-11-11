import React from 'react';
import './History.css';
import { format } from 'date-fns';
import { IoFlameSharp, IoTime, IoCalendar, IoClose } from 'react-icons/io5';

const WorkoutHistory = ({ workouts, onDelete }) => {
  if (workouts.length === 0) {
    return (
      <div className="empty-state">
        <p>No workouts logged yet.</p>
      </div>
    );
  }

  const getIntensityColor = (intensity) => {
    switch(intensity) {
      case 'high': return '#ff3b30';
      case 'medium': return '#ff9500';
      case 'low': return '#34c759';
      default: return '#8e8e93';
    }
  };

  return (
    <div className="history-list">
      {workouts.map(workout => (
        <div key={workout.id} className="history-item">
          <div className="history-item-header">
            <div className="history-item-title">
              <span className="workout-type">{workout.type}</span>
              <span 
                className="intensity-badge"
                style={{ background: getIntensityColor(workout.intensity) }}
              >
                {workout.intensity}
              </span>
            </div>
            <button 
              className="delete-btn-small"
              onClick={() => onDelete(workout.id)}
              title="Delete workout"
            >
              <IoClose />
            </button>
          </div>

          <div className="history-item-details">
            <div className="detail-item">
              <span className="detail-icon"><IoTime /></span>
              <span>{workout.duration} min</span>
            </div>
            {workout.caloriesBurned > 0 && (
              <div className="detail-item">
                <span className="detail-icon"><IoFlameSharp /></span>
                <span>{workout.caloriesBurned} kcal</span>
              </div>
            )}
            <div className="detail-item">
              <span className="detail-icon"><IoCalendar /></span>
              <span>{format(new Date(workout.date), 'MMM dd, yyyy')}</span>
            </div>
          </div>

          {workout.notes && (
            <div className="history-item-notes">
              <p>{workout.notes}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default WorkoutHistory;
