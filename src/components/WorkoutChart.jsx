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

const WorkoutChart = ({ workouts }) => {
  const getLast7DaysData = () => {
    const last7Days = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = startOfDay(subDays(new Date(), i));
      const dateStr = format(date, 'MM/dd');
      
      const dayWorkouts = workouts.filter(w => {
        const workoutDate = startOfDay(new Date(w.date));
        return workoutDate.getTime() === date.getTime();
      });

      const totalDuration = dayWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0);
      const workoutCount = dayWorkouts.length;

      last7Days.push({
        date: dateStr,
        duration: totalDuration,
        count: workoutCount
      });
    }

    return last7Days;
  };

  const data = getLast7DaysData();

  if (workouts.length === 0) {
    return (
      <div className="empty-state">
        <p>No workout data yet. Start by adding your first workout!</p>
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
          <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0071e3" stopOpacity={1}/>
            <stop offset="100%" stopColor="#0071e3" stopOpacity={0.6}/>
          </linearGradient>
          <linearGradient id="colorWorkouts" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#af52de" stopOpacity={1}/>
            <stop offset="100%" stopColor="#af52de" stopOpacity={0.6}/>
          </linearGradient>
        </defs>
        <Bar 
          dataKey="duration" 
          fill="url(#colorDuration)" 
          name="Duration (min)"
          radius={[8, 8, 0, 0]}
        />
        <Bar 
          dataKey="count" 
          fill="url(#colorWorkouts)" 
          name="Workouts"
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default WorkoutChart;
