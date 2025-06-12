import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import ApperIcon from './ApperIcon';

const NotificationPanel = ({ notifications, onClose }) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'before':
        return 'Clock';
      case 'on':
        return 'Calendar';
      case 'recurring':
        return 'Repeat';
      default:
        return 'Bell';
    }
  };

  const getTimingText = (notification) => {
    if (notification.type === 'before') {
      return `${notification.timing.days} days before`;
    } else if (notification.type === 'on') {
      return 'On target date';
    } else if (notification.type === 'recurring') {
      return 'Recurring reminder';
    }
    return 'Unknown timing';
  };

  const getDaysUntil = (notification) => {
    const notifDate = new Date(notification.timing.date);
    const now = new Date();
    const diffTime = notifDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 0) return `In ${diffDays} days`;
    return 'Overdue';
  };

  const getPriorityColor = (notification) => {
    const notifDate = new Date(notification.timing.date);
    const now = new Date();
    const diffTime = notifDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 'text-error bg-error/10 border-error/20';
    if (diffDays <= 1) return 'text-warning bg-warning/10 border-warning/20';
    if (diffDays <= 3) return 'text-accent bg-accent/10 border-accent/20';
    return 'text-info bg-info/10 border-info/20';
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-surface-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
              <ApperIcon name="Bell" className="w-4 h-4 text-accent" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Notifications</h2>
              <p className="text-sm text-surface-600">
                {notifications.length} active reminder{notifications.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-surface-400 hover:text-surface-600 transition-colors"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {notifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
            >
              <ApperIcon name="BellOff" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Active Notifications
            </h3>
            <p className="text-surface-600 mb-4">
              Your upcoming reminders will appear here when you have goals with notification deadlines approaching.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 border rounded-lg ${getPriorityColor(notification)}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <ApperIcon 
                      name={getNotificationIcon(notification.type)} 
                      className="w-5 h-5" 
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm break-words">
                        {notification.message}
                      </p>
                      <span className="text-xs font-medium whitespace-nowrap ml-2">
                        {getDaysUntil(notification)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs opacity-80">
                      <span>{getTimingText(notification)}</span>
                      {notification.timing.date && (
                        <span>
                          {format(parseISO(notification.timing.date), 'MMM d, yyyy')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {notification.enabled && (
                  <div className="mt-3 flex items-center justify-end">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-xs px-3 py-1 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                    >
                      Mark as Read
                    </motion.button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="p-6 border-t border-surface-200 bg-surface-50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-surface-600">
              Showing next 7 days
            </span>
            <button className="text-primary hover:text-primary/80 font-medium transition-colors">
              View All Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;