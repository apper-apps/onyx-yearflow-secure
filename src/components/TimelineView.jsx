import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, isSameMonth, parseISO } from 'date-fns';
import ApperIcon from './ApperIcon';

const TimelineView = ({
  viewMode,
  currentYear,
  months,
  goals,
  events,
  onGoalEdit,
  onGoalDelete,
  onProgressUpdate,
  selectedMonth,
  onMonthSelect
}) => {
  const [hoveredGoal, setHoveredGoal] = useState(null);

  const getGoalsForMonth = (month) => {
    return goals.filter(goal => {
      const goalDate = parseISO(goal.targetDate);
      return isSameMonth(goalDate, month);
    });
  };

  const getEventsForMonth = (month) => {
    return events.filter(event => {
      const eventDate = parseISO(event.date);
      return isSameMonth(eventDate, month);
    });
  };

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

  const GoalCard = ({ goal, compact = false }) => (
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
        
        {!compact && (
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

  if (viewMode === 'year') {
    return (
      <div className="p-6 max-w-full overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {months.map((month, index) => {
            const monthGoals = getGoalsForMonth(month);
            const monthEvents = getEventsForMonth(month);
            const isCurrentMonth = isSameMonth(month, new Date());
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-lg border-2 shadow-sm hover:shadow-md transition-all cursor-pointer ${
                  isCurrentMonth ? 'border-primary bg-primary/5' : 'border-surface-200'
                } ${selectedMonth && isSameMonth(selectedMonth, month) ? 'ring-2 ring-primary' : ''}`}
                onClick={() => onMonthSelect(selectedMonth && isSameMonth(selectedMonth, month) ? null : month)}
              >
                <div className="p-4 border-b border-surface-100">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {format(month, 'MMMM')}
                    </h3>
                    {isCurrentMonth && (
                      <span className="px-2 py-1 bg-primary text-white text-xs rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-surface-600">
                    <span>{monthGoals.length} goals</span>
                    <span>{monthEvents.length} events</span>
                  </div>
                </div>
                
                <div className="p-4 space-y-3">
                  {monthGoals.slice(0, 2).map(goal => (
                    <GoalCard key={goal.id} goal={goal} compact />
                  ))}
                  
                  {monthGoals.length > 2 && (
                    <div className="text-center">
                      <span className="text-sm text-surface-500">
                        +{monthGoals.length - 2} more
                      </span>
                    </div>
                  )}
                  
                  {monthGoals.length === 0 && (
                    <div className="text-center py-4">
                      <ApperIcon name="Calendar" className="w-8 h-8 text-surface-300 mx-auto mb-2" />
                      <p className="text-sm text-surface-500">No goals this month</p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {selectedMonth && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <div className="bg-white rounded-lg border border-surface-200 shadow-sm">
              <div className="p-6 border-b border-surface-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {format(selectedMonth, 'MMMM yyyy')} Details
                  </h2>
                  <button
                    onClick={() => onMonthSelect(null)}
                    className="p-2 text-surface-400 hover:text-surface-600 transition-colors"
                  >
                    <ApperIcon name="X" className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid gap-4">
                  {getGoalsForMonth(selectedMonth).map(goal => (
                    <GoalCard key={goal.id} goal={goal} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  // Quarter and Month views would be implemented similarly
  return (
    <div className="p-6">
      <div className="text-center py-12">
        <ApperIcon name="Calendar" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} View
        </h3>
        <p className="text-surface-600">
          This view is currently in development. Use Year view for full functionality.
        </p>
      </div>
    </div>
  );
};

export default TimelineView;