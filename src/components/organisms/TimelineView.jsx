import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, isSameMonth, parseISO } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import GoalCard from '@/components/molecules/GoalCard';

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
  // hoveredGoal state moved to GoalCard local state or could be managed by a common parent if needed
  // For now, it's not directly used here after GoalCard extraction

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
                    <GoalCard 
                      key={goal.id} 
                      goal={goal} 
                      compact 
                      onGoalEdit={onGoalEdit} 
                      onGoalDelete={onGoalDelete} 
                      onProgressUpdate={onProgressUpdate}
                    />
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
                    <GoalCard 
                        key={goal.id} 
                        goal={goal} 
                        onGoalEdit={onGoalEdit} 
                        onGoalDelete={onGoalDelete} 
                        onProgressUpdate={onProgressUpdate}
                    />
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