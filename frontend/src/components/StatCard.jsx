import React from 'react';

const StatCard = ({ title, value, icon, iconColorClass, subtext, trend, trendType }) => {
  return (
    <div className="card glass-card border-0 p-4 h-100">
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <p className="text-muted small text-uppercase mb-1 fw-semibold">{title}</p>
          <h3 className="mb-2 text-dark fs-2">{value}</h3>
          {trend && (
            <div className="d-flex align-items-center gap-1">
              <span className={`small fw-bold ${trendType === 'positive' ? 'text-success' : 'text-danger'}`}>
                {trendType === 'positive' ? '↓' : '↑'} {trend}
              </span>
              <span className="text-muted small">{subtext}</span>
            </div>
          )}
          {!trend && subtext && (
            <span className="text-muted small">{subtext}</span>
          )}
        </div>
        <div className={`stat-icon ${iconColorClass}`}>
          <i className={`bi ${icon}`}></i>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
