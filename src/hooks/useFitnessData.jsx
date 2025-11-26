import { useState, useEffect } from 'react';

/**
 * Local storage keys for persisting fitness data
 */
const STORAGE_KEYS = {
  WORKOUTS: 'fitness_workouts',
  MEALS: 'fitness_meals',
  GOALS: 'fitness_goals',
  WEIGHT: 'fitness_weight'
};

/**
 * Custom hook for managing all fitness tracking data
 * Provides state management, CRUD operations, and calculation utilities
 * All data is automatically persisted to localStorage
 * 
 * @returns {Object} Fitness data and operations
 */
export const useFitnessData = () => {
  // Initialize state with lazy loading from localStorage
  // This pattern ensures data loads synchronously on first render
  const [workouts, setWorkouts] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [meals, setMeals] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEALS);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [weightHistory, setWeightHistory] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WEIGHT);
    return saved ? JSON.parse(saved) : [];
  });

  // Auto-save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WEIGHT, JSON.stringify(weightHistory));
  }, [weightHistory]);

  /**
   * Add a new workout entry
   * @param {Object} workout - Workout data (type, duration, intensity, etc.)
   */
  const addWorkout = (workout) => {
    const newWorkout = {
      ...workout,
      id: Date.now(),
      date: workout.date || new Date().toISOString()
    };
    setWorkouts(prev => [newWorkout, ...prev]);
  };

  /**
   * Delete a workout by ID
   * @param {number} id - Workout ID
   */
  const deleteWorkout = (id) => {
    setWorkouts(prev => prev.filter(w => w.id !== id));
  };

  /**
   * Add a new meal entry
   * @param {Object} meal - Meal data (name, calories, macros, etc.)
   */
  const addMeal = (meal) => {
    const newMeal = {
      ...meal,
      id: Date.now(),
      date: meal.date || new Date().toISOString()
    };
    setMeals(prev => [newMeal, ...prev]);
  };

  /**
   * Delete a meal by ID
   * @param {number} id - Meal ID
   */
  const deleteMeal = (id) => {
    setMeals(prev => prev.filter(m => m.id !== id));
  };

  /**
   * Add a new weight entry and sort chronologically
   * @param {number} weight - Weight value in kg
   * @param {string} date - ISO date string (optional, defaults to today)
   */
  const addWeightEntry = (weight, date) => {
    const newEntry = {
      weight: parseFloat(weight),
      date: date || new Date().toISOString(),
      id: Date.now()
    };
    setWeightHistory(prev => [...prev, newEntry].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    ));
  };

  /**
   * Add a new goal
   * @param {Object} goal - Goal data (title, type, target, etc.)
   */
  const addGoal = (goal) => {
    const newGoal = {
      ...goal,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      progress: 0
    };
    setGoals(prev => [newGoal, ...prev]);

    // Sync with weight history if it's a weight goal
    if (goal.type === 'weight' && goal.current) {
      addWeightEntry(goal.current);
    }
  };

  /**
   * Update progress for a specific goal
   * @param {number} id - Goal ID
   * @param {number} progress - New progress value
   */
  const updateGoalProgress = (id, progress) => {
    setGoals(prev => 
      prev.map(goal => 
        goal.id === id ? { ...goal, progress } : goal
      )
    );

    // Sync with weight history if it's a weight goal
    const goal = goals.find(g => g.id === id);
    if (goal && goal.type === 'weight') {
      addWeightEntry(progress);
    }
  };

  /**
   * Delete a goal by ID
   * @param {number} id - Goal ID
   */
  const deleteGoal = (id) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  /**
   * Calculate total calories consumed
   * @param {Date} dateFilter - Optional date to filter by specific day
   * @returns {number} Total calories
   */
  const getTotalCalories = (dateFilter = null) => {
    let filteredMeals = meals;
    if (dateFilter) {
      filteredMeals = meals.filter(m => 
        new Date(m.date).toDateString() === new Date(dateFilter).toDateString()
      );
    }
    return filteredMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
  };

  /**
   * Calculate total number of workouts
   * @param {Date} dateFilter - Optional date to filter by specific day
   * @returns {number} Total workout count
   */
  const getTotalWorkouts = (dateFilter = null) => {
    if (dateFilter) {
      return workouts.filter(w => 
        new Date(w.date).toDateString() === new Date(dateFilter).toDateString()
      ).length;
    }
    return workouts.length;
  };

  /**
   * Calculate total workout duration in minutes
   * @returns {number} Total minutes across all workouts
   */
  const getTotalWorkoutMinutes = () => {
    return workouts.reduce((sum, workout) => sum + (workout.duration || 0), 0);
  };

  return {
    workouts,
    meals,
    goals,
    weightHistory,
    addWorkout,
    deleteWorkout,
    addMeal,
    deleteMeal,
    addGoal,
    updateGoalProgress,
    deleteGoal,
    addWeightEntry,
    getTotalCalories,
    getTotalWorkouts,
    getTotalWorkoutMinutes
  };
};
