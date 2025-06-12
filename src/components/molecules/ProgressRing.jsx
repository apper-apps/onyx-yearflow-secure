import React from 'react';

const ProgressRing = ({ progress, size = 40 }) => {
    const radius = (size - 8) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = `${(progress / 100) * circumference} ${circumference}`;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg className="transform -rotate-90" width={size} height={size}>
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="transparent"
                    className="text-surface-200"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="transparent"
                    strokeDasharray={strokeDasharray}
                    className="text-primary transition-all duration-300"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium">{progress}%</span>
            </div>
        </div>
    );
};

export default ProgressRing;