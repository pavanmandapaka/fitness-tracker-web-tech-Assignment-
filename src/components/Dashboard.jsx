import React from 'react';
import './Dashboard.css';
import StatsCard from './StatsCard';
import WorkoutChart from './WorkoutChart';
import WeightChart from './WeightChart';
import CalorieChart from './CalorieChart';
import GoalProgress from './GoalProgress';
import WorkoutHistory from './WorkoutHistory';
import MealHistory from './MealHistory';
import { IoFlameSharp, IoBarbell, IoTime, IoScale } from 'react-icons/io5';

const Dashboard = ({ fitnessData }) => {
  const {
    workouts,
    meals,
    goals,
    weightHistory,
    deleteWorkout,
    deleteMeal,
    updateGoalProgress,
    deleteGoal,
    getTotalCalories,
    getNetCalories,
    getTotalWorkouts,
    getTotalWorkoutMinutes
  } = fitnessData;

  const todayCalories = getNetCalories(new Date());
  const totalWorkouts = getTotalWorkouts();
  const totalMinutes = getTotalWorkoutMinutes();
  const currentWeight = weightHistory.length > 0 
    ? weightHistory[weightHistory.length - 1].weight 
    : 0;

  return (
    <div className="dashboard">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Transform Your Body</h1>
          <p className="hero-subtitle">Track. Train. Achieve Your Goals.</p>
          <div className="hero-stats">
            <div className="hero-stat-item">
              <span className="hero-stat-value">{totalWorkouts}</span>
              <span className="hero-stat-label">Workouts</span>
            </div>
            <div className="hero-stat-item">
              <span className="hero-stat-value">{Math.round(todayCalories)}</span>
              <span className="hero-stat-label">Net Calories</span>
            </div>
            <div className="hero-stat-item">
              <span className="hero-stat-value">{totalMinutes}</span>
              <span className="hero-stat-label">Minutes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <StatsCard
          title="Net Calories"
          value={todayCalories}
          unit="kcal"
          icon={<IoFlameSharp />}
          color="#ff6b35"
          gradientStart="rgba(255, 107, 53, 0.2)"
          gradientEnd="rgba(255, 107, 53, 0.05)"
        />
        <StatsCard
          title="Total Workouts"
          value={totalWorkouts}
          unit="sessions"
          icon={<IoBarbell />}
          color="#0071e3"
          gradientStart="rgba(0, 113, 227, 0.2)"
          gradientEnd="rgba(0, 113, 227, 0.05)"
        />
        <StatsCard
          title="Total Minutes"
          value={totalMinutes}
          unit="min"
          icon={<IoTime />}
          color="#af52de"
          gradientStart="rgba(175, 82, 222, 0.2)"
          gradientEnd="rgba(175, 82, 222, 0.05)"
        />
        <StatsCard
          title="Current Weight"
          value={currentWeight || '--'}
          unit="kg"
          icon={<IoScale />}
          color="#34c759"
          gradientStart="rgba(52, 199, 89, 0.2)"
          gradientEnd="rgba(52, 199, 89, 0.05)"
        />
      </div>

      {/* Goals Section */}
      <div className="goals-section">
        <h2 className="section-title">Active Goals</h2>
        <GoalProgress 
          goals={goals}
          onUpdateProgress={updateGoalProgress}
          onDeleteGoal={deleteGoal}
        />
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        <div className="chart-container">
          <h2 className="section-title">Workout Activity</h2>
          <WorkoutChart workouts={workouts} />
        </div>
        
        <div className="chart-container">
          <h2 className="section-title">Weight Progress</h2>
          <WeightChart weightHistory={weightHistory} />
        </div>
      </div>

      <div className="chart-container-full">
        <h2 className="section-title">Calorie Tracking</h2>
        <CalorieChart meals={meals} />
      </div>

      {/* History Section */}
      <div className="history-grid">
        <div className="history-container">
          <h2 className="section-title">Workout History</h2>
          <WorkoutHistory 
            workouts={workouts}
            onDelete={deleteWorkout}
          />
        </div>

        <div className="history-container">
          <h2 className="section-title">Meal History</h2>
          <MealHistory 
            meals={meals}
            onDelete={deleteMeal}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
