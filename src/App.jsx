import React, { useState } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import WorkoutForm from './components/WorkoutForm';
import MealForm from './components/MealForm';
import GoalForm from './components/GoalForm';
import { useFitnessData } from './hooks/useFitnessData';

function App() {
  const [activeModal, setActiveModal] = useState(null);
  const fitnessData = useFitnessData();

  const openModal = (modalName) => {
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1> Fitness Tracker </h1>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={() => openModal('workout')}
          >
            + Add Workout
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => openModal('meal')}
          >
            + Add Meal
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => openModal('goal')}
          >
            + Set Goal
          </button>
        </div>
      </header>

      <main className="app-main">
        <Dashboard fitnessData={fitnessData} />
      </main>

      {activeModal === 'workout' && (
        <WorkoutForm 
          onClose={closeModal}
          onSave={fitnessData.addWorkout}
        />
      )}

      {activeModal === 'meal' && (
        <MealForm 
          onClose={closeModal}
          onSave={fitnessData.addMeal}
        />
      )}

      {activeModal === 'goal' && (
        <GoalForm 
          onClose={closeModal}
          onSave={fitnessData.addGoal}
        />
      )}
    </div>
  );
}

export default App;
