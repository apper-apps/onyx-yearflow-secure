import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import FormField from '@/components/molecules/FormField';
import Input from '@/components/atoms/Input'; // Used for select type
import Button from '@/components/atoms/Button';

const GoalModal = ({ goal, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetDate: '',
    category: 'personal',
    progress: 0,
    status: 'planned',
    notifications: []
  });
  const [errors, setErrors] = useState({});
  const [showNotificationForm, setShowNotificationForm] = useState(false);
  const [currentNotification, setCurrentNotification] = useState({
    type: 'before',
    timing: { days: 7 },
    message: '',
    enabled: true
  });

  const categories = [
    { value: 'career', label: 'Career', icon: 'Briefcase' },
    { value: 'health', label: 'Health', icon: 'Heart' },
    { value: 'personal', label: 'Personal', icon: 'User' },
    { value: 'finance', label: 'Finance', icon: 'DollarSign' },
    { value: 'education', label: 'Education', icon: 'BookOpen' },
    { value: 'relationship', label: 'Relationship', icon: 'Users' },
    { value: 'travel', label: 'Travel', icon: 'Plane' },
    { value: 'hobby', label: 'Hobby', icon: 'Palette' }
  ];

  const statuses = [
    { value: 'planned', label: 'Planned', color: 'text-surface-600' },
    { value: 'active', label: 'Active', color: 'text-primary' },
    { value: 'completed', label: 'Completed', color: 'text-success' },
    { value: 'archived', label: 'Archived', color: 'text-surface-400' }
  ];

  useEffect(() => {
    if (goal) {
      setFormData({
        title: goal.title || '',
        description: goal.description || '',
        targetDate: goal.targetDate?.split('T')[0] || '',
        category: goal.category || 'personal',
        progress: goal.progress || 0,
        status: goal.status || 'planned',
        notifications: goal.notifications || []
      });
    }
  }, [goal]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.targetDate) {
      newErrors.targetDate = 'Target date is required';
    } else {
      const targetDate = new Date(formData.targetDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (targetDate < today) {
        newErrors.targetDate = 'Target date cannot be in the past';
      }
    }
    
    if (formData.progress < 0 || formData.progress > 100) {
      newErrors.progress = 'Progress must be between 0 and 100';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const goalData = {
      ...formData,
      targetDate: new Date(formData.targetDate).toISOString(),
      progress: parseInt(formData.progress)
    };
    
    onSave(goalData);
  };

  const handleAddNotification = () => {
    if (!currentNotification.message.trim()) {
      return;
    }

    const notification = {
      ...currentNotification,
      id: Date.now().toString(),
      timing: {
        ...currentNotification.timing,
        date: formData.targetDate
      }
    };

    setFormData(prev => ({
      ...prev,
      notifications: [...prev.notifications, notification]
    }));

    setCurrentNotification({
      type: 'before',
      timing: { days: 7 },
      message: '',
      enabled: true
    });
    setShowNotificationForm(false);
  };

  const handleRemoveNotification = (notificationId) => {
    setFormData(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== notificationId)
    }));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-surface-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {goal ? 'Edit Goal' : 'Create New Goal'}
              </h2>
              <Button
                onClick={onClose}
                className="p-2 text-surface-400 hover:text-surface-600 transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <FormField
              id="title"
              label="Goal Title *"
              error={errors.title}
              inputProps={{
                type: 'text',
                value: formData.title,
                onChange: (e) => setFormData(prev => ({ ...prev, title: e.target.value })),
                placeholder: "Enter your goal title",
              }}
            />

            <FormField
              id="description"
              label="Description"
              type="textarea"
              rows={3}
              inputProps={{
                value: formData.description,
                onChange: (e) => setFormData(prev => ({ ...prev, description: e.target.value })),
                placeholder: "Describe your goal in detail",
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                id="targetDate"
                label="Target Date *"
                error={errors.targetDate}
                inputProps={{
                  type: 'date',
                  value: formData.targetDate,
                  onChange: (e) => setFormData(prev => ({ ...prev, targetDate: e.target.value })),
                }}
              />

              <FormField
                id="progress"
                label="Current Progress (%)"
                error={errors.progress}
                inputProps={{
                  type: 'number',
                  min: "0",
                  max: "100",
                  value: formData.progress,
                  onChange: (e) => setFormData(prev => ({ ...prev, progress: e.target.value })),
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Category
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categories.map(category => (
                  <Button
                    key={category.value}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData(prev => ({ ...prev, category: category.value }))}
                    className={`p-3 border-2 rounded-lg flex flex-col items-center space-y-1 transition-all ${
                      formData.category === category.value
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-surface-200 hover:border-surface-300'
                    }`}
                  >
                    <ApperIcon name={category.icon} className="w-5 h-5" />
                    <span className="text-xs font-medium">{category.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Status
              </label>
              <div className="flex flex-wrap gap-2">
                {statuses.map(status => (
                  <Button
                    key={status.value}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData(prev => ({ ...prev, status: status.value }))}
                    className={`px-4 py-2 border-2 rounded-lg font-medium transition-all ${
                      formData.status === status.value
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-surface-200 hover:border-surface-300'
                    }`}
                  >
                    {status.label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Notifications
                </label>
                <Button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowNotificationForm(true)}
                  className="flex items-center px-3 py-1 text-sm bg-accent text-white rounded-lg hover:brightness-110 transition-all"
                >
                  <ApperIcon name="Plus" className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>

              {formData.notifications.length > 0 && (
                <div className="space-y-2 mb-4">
                  {formData.notifications.map(notification => (
                    <div
                      key={notification.id}
                      className="flex items-center justify-between p-3 bg-surface-50 border border-surface-200 rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {notification.message}
                        </p>
                        <p className="text-xs text-surface-600">
                          {notification.type === 'before' ? 
                            `${notification.timing.days} days before` :
                            'On target date'
                          }
                        </p>
                      </div>
                      <Button
                        type="button"
                        onClick={() => handleRemoveNotification(notification.id)}
                        className="p-1 text-surface-400 hover:text-error transition-colors"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {showNotificationForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 border border-surface-200 rounded-lg bg-surface-50 space-y-3"
                >
                  <FormField
                    label="Notification Message"
                    inputProps={{
                        type: 'text',
                        value: currentNotification.message,
                        onChange: (e) => setCurrentNotification(prev => ({ ...prev, message: e.target.value })),
                        placeholder: "Don't forget to work on your goal!",
                    }}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                        label="When"
                    >
                        <Input
                            type="select"
                            value={currentNotification.type}
                            onChange={(e) => setCurrentNotification(prev => ({ ...prev, type: e.target.value }))}
                            options={[
                                { value: 'before', label: 'Days Before' },
                                { value: 'on', label: 'On Target Date' },
                            ]}
                        />
                    </FormField>

                    {currentNotification.type === 'before' && (
                      <FormField
                          label="Days"
                          inputProps={{
                              type: 'number',
                              min: "1",
                              max: "365",
                              value: currentNotification.timing.days,
                              onChange: (e) => setCurrentNotification(prev => ({ 
                                  ...prev, 
                                  timing: { ...prev.timing, days: parseInt(e.target.value) }
                              })),
                          }}
                      />
                    )}
                  </div>

                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      type="button"
                      onClick={() => setShowNotificationForm(false)}
                      className="px-3 py-1 text-sm text-surface-600 hover:text-surface-800 transition-colors"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleAddNotification}
                      className="px-3 py-1 text-sm bg-primary text-white rounded-lg hover:brightness-110 transition-all"
                    >
                      Add Notification
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-surface-200">
              <Button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-surface-600 hover:text-surface-800 transition-colors"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:brightness-110 transition-all"
              >
                {goal ? 'Update Goal' : 'Create Goal'}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GoalModal;