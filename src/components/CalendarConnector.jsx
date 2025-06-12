import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import * as calendarService from '../services/api/calendarService';

const CalendarConnector = ({ onConnect }) => {
  const [calendarId, setCalendarId] = useState('');
  const [calendarType, setCalendarType] = useState('google');
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  const validateCalendarId = (id, type) => {
    if (!id.trim()) {
      return 'Calendar ID is required';
    }
    
    if (type === 'google') {
      // Google Calendar ID format validation
      if (!id.includes('@') || (!id.endsWith('@group.calendar.google.com') && !id.endsWith('@gmail.com'))) {
        return 'Invalid Google Calendar ID format (e.g., your-calendar@gmail.com)';
      }
    } else if (type === 'apple') {
      // Apple Calendar ID format validation
      if (id.length < 10 || !/^[A-Za-z0-9-]+$/.test(id)) {
        return 'Invalid Apple Calendar ID format (alphanumeric with dashes)';
      }
    }
    
    return null;
  };

  const handleConnect = async (e) => {
    e.preventDefault();
    
    const error = validateCalendarId(calendarId, calendarType);
    if (error) {
      setValidationError(error);
      return;
    }
    
    setLoading(true);
    setValidationError('');
    
    try {
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const calendarData = {
        id: calendarId.trim(),
        type: calendarType,
        name: calendarType === 'google' ? 
          calendarId.split('@')[0] : 
          `Apple Calendar (${calendarId.slice(0, 8)}...)`,
        connected: true,
        lastSync: new Date().toISOString()
      };
      
      const newCalendar = await calendarService.create(calendarData);
      onConnect(newCalendar);
    } catch (err) {
      toast.error('Failed to connect calendar. Please check your ID and try again.');
      setValidationError('Connection failed. Please verify your calendar ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="mb-6"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <ApperIcon name="Calendar" className="w-10 h-10 text-primary" />
          </div>
        </motion.div>
        
        <h1 className="text-3xl font-bold font-display text-gray-900 mb-2">
          Welcome to YearFlow
        </h1>
        <p className="text-surface-600 mb-8">
          Connect your calendar to start planning and tracking your yearly goals with dynamic notifications.
        </p>
      </div>

      <form onSubmit={handleConnect} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Calendar Provider
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'google', label: 'Google', icon: 'Mail' },
              { value: 'apple', label: 'Apple', icon: 'Smartphone' }
            ].map(provider => (
              <motion.button
                key={provider.value}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCalendarType(provider.value)}
                className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-all ${
                  calendarType === provider.value
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-surface-200 hover:border-surface-300'
                }`}
              >
                <ApperIcon name={provider.icon} className="w-6 h-6" />
                <span className="font-medium">{provider.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="calendarId" className="block text-sm font-medium text-gray-700 mb-2">
            Calendar ID
          </label>
          <input
            type="text"
            id="calendarId"
            value={calendarId}
            onChange={(e) => {
              setCalendarId(e.target.value);
              setValidationError('');
            }}
            placeholder={
              calendarType === 'google' 
                ? 'your-calendar@gmail.com'
                : 'ABCD-EFGH-1234-5678'
            }
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
              validationError ? 'border-error' : 'border-surface-300'
            }`}
            disabled={loading}
          />
          {validationError && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-error flex items-center"
            >
              <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
              {validationError}
            </motion.p>
          )}
          <p className="mt-2 text-sm text-surface-500">
            {calendarType === 'google' ? (
              <>
                Find your Google Calendar ID in Calendar Settings → Integrate calendar.
                Use your primary email or specific calendar ID.
              </>
            ) : (
              <>
                Find your Apple Calendar ID in Settings → Calendar → Accounts.
                Look for the calendar identifier string.
              </>
            )}
          </p>
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading || !calendarId.trim()}
          className="w-full py-3 px-4 bg-primary text-white rounded-lg font-medium hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Connecting...
            </>
          ) : (
            <>
              <ApperIcon name="Link" className="w-5 h-5 mr-2" />
              Connect Calendar
            </>
          )}
        </motion.button>
      </form>

      <div className="mt-8 p-4 bg-info/5 border border-info/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <ApperIcon name="Info" className="w-5 h-5 text-info mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-info mb-1">Privacy & Security</p>
            <p className="text-info/80">
              Your calendar data stays private. We only read basic event information to help with planning.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CalendarConnector;