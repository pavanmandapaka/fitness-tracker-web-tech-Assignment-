import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';

const CalorieChart = ({ meals }) => {
  const getLast7DaysData = () => {
    const last7Days = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = startOfDay(subDays(new Date(), i));
      const dateStr = format(date, 'MM/dd');
      
      const dayMeals = meals.filter(m => {
        const mealDate = startOfDay(new Date(m.date));
        return mealDate.getTime() === date.getTime();
      });

      const totalCalories = dayMeals.reduce((sum, m) => sum + (m.calories || 0), 0);
      const protein = dayMeals.reduce((sum, m) => sum + (m.protein || 0), 0);
      const carbs = dayMeals.reduce((sum, m) => sum + (m.carbs || 0), 0);
      const fats = dayMeals.reduce((sum, m) => sum + (m.fats || 0), 0);

      last7Days.push({
        date: dateStr,
        calories: totalCalories,
        protein,
        carbs,
        fats
      });
    }

    return last7Days;
  };

  const data = getLast7DaysData();

  if (meals.length === 0) {
    return (
      <div className="empty-state">
        <p>No meal data yet. Start tracking your nutrition!</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
        <XAxis 
          dataKey="date" 
          stroke="rgba(245, 245, 247, 0.6)"
          style={{ fontSize: '13px' }}
        />
        <YAxis 
          stroke="rgba(245, 245, 247, 0.6)"
          style={{ fontSize: '13px' }}
        />
        <Tooltip 
          contentStyle={{
            background: 'rgba(29, 29, 31, 0.95)',
            border: '0.5px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            fontSize: '13px',
            color: '#f5f5f7',
            backdropFilter: 'blur(20px)'
          }}
        />
        <Legend 
          wrapperStyle={{ fontSize: '13px', color: '#f5f5f7' }}
        />
        <defs>
          <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff6b35" stopOpacity={1}/>
            <stop offset="100%" stopColor="#ff9500" stopOpacity={0.7}/>
          </linearGradient>
        </defs>
        <Bar 
          dataKey="calories" 
          fill="url(#colorCalories)" 
          name="Calories"
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CalorieChart;
