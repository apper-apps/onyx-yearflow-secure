import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import ProgressRing from '@/components/molecules/ProgressRing';

const GoalCard = ({ goal, compact = false, onGoalEdit, onGoalDelete, onProgressUpdate }) => {
  const [hoveredGoal, setHoveredGoal] = useState(null); // Local state for hover, though not used in the parent
  
  const getCategoryColor = (category) => {
    const colors = {
      'career': 'bg-primary',
      'health': 'bg-success',
      'personal': 'bg-secondary',
      'finance': 'bg-accent',
      'education': 'bg-info',
      'relationship': 'bg-pink-500',
      'travel': 'bg-purple-500',
      'hobby': 'bg-orange-500'
    };
    return colors[category] || 'bg-surface-400';
  };

  const getStatusColor = (status) => {
    const colors = {
      'planned': 'border-surface-300 bg-surface-50',
      'active': 'border-primary bg-primary/5',
      'completed': 'border-success bg-success/5',
      'archived': 'border-surface-200 bg-surface-100'
    };
    return colors[status] || 'border-surface-300 bg-surface-50';
  };

  return (
    <motion.div
      key={goal.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      onHoverStart={() => setHoveredGoal(goal.id)}
      onHoverEnd={() => setHoveredGoal(null)}
      className={`bg-white rounded-lg border-2 shadow-sm hover:shadow-md transition-all p-${compact ? '3' : '4'} ${getStatusColor(goal.status)}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${getCategoryColor(goal.category)}`}></div>
          <span className="text-xs font-medium text-surface-500 uppercase tracking-wide">
            {goal.category}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onGoalEdit(goal)}
            className="p-1 text-surface-400 hover:text-primary transition-colors"
          >
            <ApperIcon name="Edit2" className="w-4 h-4" />
          </button>
          <button
            onClick={() => onGoalDelete(goal.id)}
            className="p-1 text-surface-400 hover:text-error transition-colors"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <h3 className={`font-semibold text-gray-900 mb-2 ${compact ? 'text-sm' : 'text-base'}`}>
        {goal.title}
      </h3>
      
      {!compact && goal.description && (
        <p className="text-sm text-surface-600 mb-3 line-clamp-2">
          {goal.description}
        </p>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ProgressRing progress={goal.progress} size={compact ? 32 : 40} />
          <div>
            <p className="text-xs text-surface-500">
              Due {format(parseISO(goal.targetDate), 'MMM d')}
            </p>
            <p className={`text-xs font-medium ${
              goal.status === 'completed' ? 'text-success' :
              goal.status === 'active' ? 'text-primary' :
              'text-surface-600'
            }`}>
              {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
            </p>
          </div>
        </div>
        
        {!compact && onProgressUpdate && (
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onProgressUpdate(goal.id, Math.min(100, goal.progress + 10))}
              className="p-1 text-success hover:bg-success/10 rounded transition-colors"
              disabled={goal.progress >= 100}
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
            </button>
            <button
              onClick={() => onProgressUpdate(goal.id, Math.max(0, goal.progress - 10))}
              className="p-1 text-surface-400 hover:bg-surface-100 rounded transition-colors"
              disabled={goal.progress <= 0}
            >
              <ApperIcon name="Minus" className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      
      {goal.notifications && goal.notifications.length > 0 && (
        <div className="mt-2 flex items-center space-x-1">
          <ApperIcon name="Bell" className="w-3 h-3 text-accent" />
          <span className="text-xs text-accent">
            {goal.notifications.length} notification{goal.notifications.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default GoalCard;