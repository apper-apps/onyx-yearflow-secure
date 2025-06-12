import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import CalendarConnector from '../components/CalendarConnector';
import * as calendarService from '../services/api/calendarService';

const Home = () => {
  const [calendar, setCalendar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadConnectedCalendar = async () => {
      setLoading(true);
      setError(null);
      try {
        const calendars = await calendarService.getAll();
        const connected = calendars.find(cal => cal.connected);
        if (connected) {
          setCalendar(connected);
        }
      } catch (err) {
        setError(err.message || 'Failed to load calendar connection');
      } finally {
        setLoading(false);
      }
    };
    loadConnectedCalendar();
  }, []);

  const handleCalendarConnected = (newCalendar) => {
    setCalendar(newCalendar);
    toast.success('Calendar connected successfully!');
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-surface-600">Loading your planning workspace...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-error text-2xl">⚠</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-surface-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        {!calendar ? (
          <motion.div
            key="connector"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex items-center justify-center p-6"
          >
            <CalendarConnector onConnect={handleCalendarConnected} />
          </motion.div>
        ) : (
          <motion.div
            key="planner"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 overflow-hidden"
          >
            <MainFeature calendar={calendar} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;