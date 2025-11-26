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
  const [workouts, setWorkouts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse workouts", e);
      return [];
    }
  });
  
  const [meals, setMeals] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEALS);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse meals", e);
      return [];
    }
  });
  
  const [goals, setGoals] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse goals", e);
      return [];
    }
  });
  
  const [weightHistory, setWeightHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WEIGHT);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse weight history", e);
      return [];
    }
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
   * Enforces numeric types for calculations
   */
  const addWorkout = (workout) => {
    const newWorkout = {
      ...workout,
      duration: parseInt(workout.duration) || 0,
      caloriesBurned: parseInt(workout.caloriesBurned) || 0,
      id: Date.now(),
      date: workout.date || new Date().toISOString()
    };
    setWorkouts(prev => [newWorkout, ...prev]);
  };

  const deleteWorkout = (id) => {
    setWorkouts(prev => prev.filter(w => w.id !== id));
  };

  /**
   * Add a new meal entry
   * Enforces numeric types for calculations
   */
  const addMeal = (meal) => {
    const newMeal = {
      ...meal,
      calories: parseInt(meal.calories) || 0,
      id: Date.now(),
      date: meal.date || new Date().toISOString()
    };
    setMeals(prev => [newMeal, ...prev]);
  };

  const deleteMeal = (id) => {
    setMeals(prev => prev.filter(m => m.id !== id));
  };

  /**
   * Add a new weight entry and sort chronologically
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
   * Initializes progress intelligently based on goal type
   */
  const addGoal = (goal) => {
    const currentVal = parseFloat(goal.current) || 0;
    const newGoal = {
      ...goal,
      target: parseFloat(goal.target),
      current: currentVal,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      // For weight goals, progress starts at current weight. For others (e.g. run 100km), it starts at 0.
      progress: goal.type === 'weight' ? currentVal : 0
    };
    setGoals(prev => [newGoal, ...prev]);

    // Sync with weight history if it's a weight goal
    if (goal.type === 'weight' && goal.current) {
      addWeightEntry(goal.current);
    }
  };

  /**
   * Update progress for a specific goal
   */
  const updateGoalProgress = (id, progress) => {
    const numericProgress = parseFloat(progress);
    setGoals(prev => 
      prev.map(goal => 
        goal.id === id ? { ...goal, progress: numericProgress } : goal
      )
    );

    // Sync with weight history if it's a weight goal
    const goal = goals.find(g => g.id === id);
    if (goal && goal.type === 'weight') {
      addWeightEntry(numericProgress);
    }
  };

  const deleteGoal = (id) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  /**
   * Calculate total calories consumed
   * Uses Number() casting to be safe against legacy string data
   */
  const getTotalCalories = (dateFilter = null) => {
    let filteredMeals = meals;
    if (dateFilter) {
      filteredMeals = meals.filter(m => 
        new Date(m.date).toDateString() === new Date(dateFilter).toDateString()
      );
    }
    return filteredMeals.reduce((sum, meal) => sum + (Number(meal.calories) || 0), 0);
  };

  /**
   * Calculate total calories burned from workouts
   * Uses Number() casting to be safe against legacy string data
   */
  const getTotalCaloriesBurned = (dateFilter = null) => {
    let filteredWorkouts = workouts;
    if (dateFilter) {
      filteredWorkouts = workouts.filter(w => 
        new Date(w.date).toDateString() === new Date(dateFilter).toDateString()
      );
    }
    return filteredWorkouts.reduce((sum, workout) => sum + (Number(workout.caloriesBurned) || 0), 0);
  };

  /**
   * Calculate net calories (Consumed - Burned)
   */
  const getNetCalories = (dateFilter = null) => {
    const consumed = getTotalCalories(dateFilter);
    const burned = getTotalCaloriesBurned(dateFilter);
    return consumed - burned;
  };

  const getTotalWorkouts = (dateFilter = null) => {
    if (dateFilter) {
      return workouts.filter(w => 
        new Date(w.date).toDateString() === new Date(dateFilter).toDateString()
      ).length;
    }
    return workouts.length;
  };

  const getTotalWorkoutMinutes = () => {
    return workouts.reduce((sum, workout) => sum + (Number(workout.duration) || 0), 0);
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
    getTotalCaloriesBurned,
    getNetCalories,
    getTotalWorkouts,
    getTotalWorkoutMinutes
  };
};
