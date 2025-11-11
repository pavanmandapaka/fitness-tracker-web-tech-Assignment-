import React from 'react';
import './History.css';
import { format } from 'date-fns';
import { IoRestaurant, IoFastFood, IoBeer, IoNutrition, IoClose, IoFlameSharp } from 'react-icons/io5';

const MealHistory = ({ meals, onDelete }) => {
  if (meals.length === 0) {
    return (
      <div className="empty-state">
        <p>No meals logged yet.</p>
      </div>
    );
  }

  const getMealIcon = (mealType) => {
    switch(mealType) {
      case 'breakfast': return <IoRestaurant />;
      case 'lunch': return <IoFastFood />;
      case 'dinner': return <IoNutrition />;
      case 'snack': return <IoBeer />;
      default: return <IoRestaurant />;
    }
  };

    const getMealColor = (mealType) => {
    switch(mealType.toLowerCase()) {
      case 'breakfast': return '#ff9500';
      case 'lunch': return '#0071e3';
      case 'dinner': return '#af52de';
      case 'snack': return '#34c759';
      default: return '#8e8e93';
    }
  };

  return (
    <div className="history-list">
      {meals.map(meal => (
        <div key={meal.id} className="history-item">
          <div className="history-item-header">
            <div className="history-item-title">
              <span className="meal-icon">{getMealIcon(meal.mealType)}</span>
              <div>
                <span className="meal-name">{meal.name}</span>
                <span 
                  className="meal-type-badge"
                  style={{ background: getMealColor(meal.mealType) }}
                >
                  {meal.mealType}
                </span>
              </div>
            </div>
            <button 
              className="delete-btn-small"
              onClick={() => onDelete(meal.id)}
              title="Delete meal"
            >
              <IoClose />
            </button>
          </div>

          <div className="history-item-details">
            <div className="detail-item">
              <span className="detail-icon"><IoFlameSharp /></span>
              <span>{meal.calories} kcal</span>
            </div>
            {meal.protein > 0 && (
              <div className="detail-item">
                <span className="detail-icon"><IoNutrition /></span>
                <span>{meal.protein}g protein</span>
              </div>
            )}
            {meal.carbs > 0 && (
              <div className="detail-item">
                <span className="detail-icon">🌾</span>
                <span>{meal.carbs}g carbs</span>
              </div>
            )}
            {meal.fats > 0 && (
              <div className="detail-item">
                <span className="detail-icon">🥑</span>
                <span>{meal.fats}g fats</span>
              </div>
            )}
          </div>

          <div className="meal-date">
            📅 {format(new Date(meal.date), 'MMM dd, yyyy')}
          </div>

          {meal.notes && (
            <div className="history-item-notes">
              <p>{meal.notes}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MealHistory;
