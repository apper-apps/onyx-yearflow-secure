import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, startOfYear, endOfYear, eachMonthOfInterval, isWithinInterval } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import TimelineView from '@/components/organisms/TimelineView';
import GoalModal from '@/components/organisms/GoalModal';
import NotificationPanel from '@/components/organisms/NotificationPanel';
import FilterToolbar from '@/components/organisms/FilterToolbar';
import Button from '@/components/atoms/Button';
import * as goalService from '@/services/api/goalService';
import * as eventService from '@/services/api/eventService';
import * as notificationService from '@/services/api/notificationService';

const MainFeature = ({ calendar }) => {
  const [currentYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState('year'); // year, quarter, month
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [goals, setGoals] = useState([]);
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [filters, setFilters] = useState({
    categories: [],
    status: 'all',
    dateRange: null
  });

  const months = eachMonthOfInterval({
    start: startOfYear(new Date(currentYear, 0, 1)),
    end: endOfYear(new Date(currentYear, 0, 1))
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [goalsData, eventsData, notificationsData] = await Promise.all([
        goalService.getAll(),
        eventService.getAll(),
        notificationService.getAll()
      ]);
      setGoals(goalsData);
      setEvents(eventsData);
      setNotifications(notificationsData);
    } catch (err) {
      setError(err.message || 'Failed to load planning data');
      toast.error('Failed to load planning data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (goalData) => {
    try {
      const newGoal = await goalService.create(goalData);
      setGoals(prev => [...prev, newGoal]);
      setShowGoalModal(false);
      setEditingGoal(null);
      toast.success('Goal created successfully!');
    } catch (err) {
      toast.error('Failed to create goal');
    }
  };

  const handleUpdateGoal = async (goalId, goalData) => {
    try {
      const updatedGoal = await goalService.update(goalId, goalData);
      setGoals(prev => prev.map(g => g.id === goalId ? updatedGoal : g));
      setShowGoalModal(false);
      setEditingGoal(null);
      toast.success('Goal updated successfully!');
    } catch (err) {
      toast.error('Failed to update goal');
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return;
    
    try {
      await goalService.delete(goalId);
      setGoals(prev => prev.filter(g => g.id !== goalId));
      toast.success('Goal deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete goal');
    }
  };

  const handleProgressUpdate = async (goalId, progress) => {
    try {
      const updatedGoal = await goalService.update(goalId, { progress });
      setGoals(prev => prev.map(g => g.id === goalId ? updatedGoal : g));
      toast.success('Progress updated!');
    } catch (err) {
      toast.error('Failed to update progress');
    }
  };

  const filteredGoals = goals.filter(goal => {
    if (filters.status !== 'all' && goal.status !== filters.status) return false;
    if (filters.categories.length > 0 && !filters.categories.includes(goal.category)) return false;
    if (filters.dateRange) {
      const goalDate = new Date(goal.targetDate);
      if (!isWithinInterval(goalDate, filters.dateRange)) return false;
    }
    return true;
  });

  const getActiveNotifications = () => {
    const now = new Date();
    return notifications.filter(notif => {
      const notifDate = new Date(notif.timing.date);
      const daysDiff = Math.ceil((notifDate - now) / (1000 * 60 * 60 * 24));
      return daysDiff >= 0 && daysDiff <= 7 && notif.enabled;
    });
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col">
        {/* Header Skeleton */}
        <div className="border-b border-surface-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-surface-200 rounded-full animate-pulse"></div>
              <div className="w-32 h-6 bg-surface-200 rounded animate-pulse"></div>
            </div>
            <div className="flex space-x-2">
              <div className="w-24 h-10 bg-surface-200 rounded-lg animate-pulse"></div>
              <div className="w-24 h-10 bg-surface-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Content Skeleton */}
        <div className="flex-1 flex">
          <div className="flex-1 p-6">
            <div className="grid grid-cols-12 gap-4 mb-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="h-32 bg-surface-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-surface-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
          <div className="w-80 border-l border-surface-200 p-6">
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-surface-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md p-6">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="AlertCircle" className="w-8 h-8 text-error" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load</h2>
          <p className="text-surface-600 mb-4">{error}</p>
          <Button
            onClick={loadData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-surface-200 bg-white z-40">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${calendar.connected ? 'bg-success animate-pulse-dot' : 'bg-surface-300'}`}></div>
                <span className="text-sm text-surface-600">
                  {calendar.connected ? `Connected to ${calendar.name}` : 'Calendar disconnected'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-surface-600 hover:text-primary transition-colors"
              >
                <ApperIcon name="Bell" className="w-5 h-5" />
                {getActiveNotifications().length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-xs rounded-full flex items-center justify-center animate-pulse-dot">
                    {getActiveNotifications().length}
                  </span>
                )}
              </Button>
              
              <div className="flex bg-surface-100 rounded-lg p-1">
                {['year', 'quarter', 'month'].map(mode => (
                  <Button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-all ${
                      viewMode === mode
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-surface-600 hover:text-surface-900'
                    }`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </Button>
                ))}
              </div>
              
              <Button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowGoalModal(true)}
                className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:brightness-110 transition-all"
              >
                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                Add Goal
              </Button>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold font-display text-gray-900 mb-2">
            {currentYear} Planning Overview
          </h1>
          <p className="text-surface-600">
            Track your yearly goals and milestones with calendar integration
          </p>
        </div>
        
        <FilterToolbar
          goals={goals}
          filters={filters}
          onFiltersChange={setFilters}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <TimelineView
            viewMode={viewMode}
            currentYear={currentYear}
            months={months}
            goals={filteredGoals}
            events={events}
            onGoalEdit={(goal) => {
              setEditingGoal(goal);
              setShowGoalModal(true);
            }}
            onGoalDelete={handleDeleteGoal}
            onProgressUpdate={handleProgressUpdate}
            selectedMonth={selectedMonth}
            onMonthSelect={setSelectedMonth}
          />
        </div>
        
        {/* Notification Panel */}
        {showNotifications && (
          <motion.div
            initial={{ x: 320 }}
            animate={{ x: 0 }}
            exit={{ x: 320 }}
            className="w-80 border-l border-surface-200 bg-white z-30"
          >
            <NotificationPanel
              notifications={getActiveNotifications()}
              onClose={() => setShowNotifications(false)}
            />
          </motion.div>
        )}
      </div>

      {/* Goal Modal */}
      {showGoalModal && (
        <GoalModal
          goal={editingGoal}
          onSave={editingGoal ? 
            (data) => handleUpdateGoal(editingGoal.id, data) : 
            handleCreateGoal
          }
          onClose={() => {
            setShowGoalModal(false);
            setEditingGoal(null);
          }}
        />
      )}
    </div>
  );
};

export default MainFeature;