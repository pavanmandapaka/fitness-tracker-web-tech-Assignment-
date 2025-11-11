import { useState, useEffect } from 'react';

const STORAGE_KEYS = {
  WORKOUTS: 'fitness_workouts',
  MEALS: 'fitness_meals',
  GOALS: 'fitness_goals',
  WEIGHT: 'fitness_weight'
};

export const useFitnessData = () => {
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

  const addWorkout = (workout) => {
    const newWorkout = {
      ...workout,
      id: Date.now(),
      date: workout.date || new Date().toISOString()
    };
    setWorkouts(prev => [newWorkout, ...prev]);
  };

  const deleteWorkout = (id) => {
    setWorkouts(prev => prev.filter(w => w.id !== id));
  };

  const addMeal = (meal) => {
    const newMeal = {
      ...meal,
      id: Date.now(),
      date: meal.date || new Date().toISOString()
    };
    setMeals(prev => [newMeal, ...prev]);
  };

  const deleteMeal = (id) => {
    setMeals(prev => prev.filter(m => m.id !== id));
  };

  const addGoal = (goal) => {
    const newGoal = {
      ...goal,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      progress: 0
    };
    setGoals(prev => [newGoal, ...prev]);
  };

  const updateGoalProgress = (id, progress) => {
    setGoals(prev => 
      prev.map(goal => 
        goal.id === id ? { ...goal, progress } : goal
      )
    );
  };

  const deleteGoal = (id) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

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

  // Calculations
  const getTotalCalories = (dateFilter = null) => {
    let filteredMeals = meals;
    if (dateFilter) {
      filteredMeals = meals.filter(m => 
        new Date(m.date).toDateString() === new Date(dateFilter).toDateString()
      );
    }
    return filteredMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
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
