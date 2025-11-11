import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';

const WeightChart = ({ weightHistory }) => {
  if (weightHistory.length === 0) {
    return (
      <div className="empty-state">
        <p>No weight data yet. Track your weight progress!</p>
      </div>
    );
  }

  const data = weightHistory.map(entry => ({
    date: format(new Date(entry.date), 'MM/dd'),
    weight: entry.weight
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
        <XAxis 
          dataKey="date" 
          stroke="rgba(245, 245, 247, 0.6)"
          style={{ fontSize: '13px' }}
        />
        <YAxis 
          stroke="rgba(245, 245, 247, 0.6)"
          style={{ fontSize: '13px' }}
          domain={['dataMin - 2', 'dataMax + 2']}
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
          <linearGradient id="weightGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#34c759" />
            <stop offset="50%" stopColor="#0071e3" />
            <stop offset="100%" stopColor="#af52de" />
          </linearGradient>
        </defs>
        <Line 
          type="monotone" 
          dataKey="weight" 
          stroke="url(#weightGradient)" 
          strokeWidth={3}
          name="Weight (kg)"
          dot={{ fill: '#0071e3', r: 5, strokeWidth: 2, stroke: '#34c759' }}
          activeDot={{ r: 7, fill: '#af52de' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default WeightChart;
