import React from 'react';

const getColorClass = (pct: number) => {
  if (pct >= 90) return 'top-performance';
  if (pct >= 50) return 'medium-performance';
  return 'bad-performance';
};

export const CircularProgress = ({percentage, label, size=90}: { percentage: number, label: string, size?: number}) => (

  <div>
    <div className="percentage" style={{ width: size, height: size }}>
      <svg  height={size} width={size} viewBox="0 0 100 100" >
        
        <circle className="circle-bg"/>
        
        <circle
          className={`circle-progress ${getColorClass(percentage)}`}
          style={{ '--percentage': percentage } as React.CSSProperties}
        />
      </svg>
      {/* Testo centrato nel cerchio */}
      <div className="percentage-text">
        <span className="text-xl">{percentage}%</span>
      </div>
    </div>
    
    {/* Label sotto il cerchio */}
    <span className="label-persentage">
      {label}
    </span>
  </div>
);