import React from 'react';
import './StatsCard.css';

const StatsCard = ({ title, value, unit, icon: IconComponent, color, gradientStart, gradientEnd }) => {
  return (
    <div 
      className="stats-card"
      style={{
        '--card-color': color,
        '--icon-color': color,
        '--icon-bg-1': gradientStart,
        '--icon-bg-2': gradientEnd,
        '--icon-shadow': `${color}33`,
        '--card-glow': `${color}15`,
        '--card-shadow': `${color}66`
      }}
    >
      <div className="stats-icon">
        {IconComponent}
      </div>
      <div className="stats-content">
        <div className="stats-title">{title}</div>
        <div className="stats-value">
          <span className="value-number">{value}</span>
          <span className="value-unit">{unit}</span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
