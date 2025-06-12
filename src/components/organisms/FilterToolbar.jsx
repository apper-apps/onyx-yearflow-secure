import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { startOfMonth, endOfMonth, startOfQuarter, endOfQuarter } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const FilterToolbar = ({ goals, filters, onFiltersChange }) => {
  const [showFilters, setShowFilters] = useState(false);

  const categories = [...new Set(goals.map(goal => goal.category))];
  const statuses = ['all', 'planned', 'active', 'completed', 'archived'];

  const dateRangeOptions = [
    { label: 'All Time', value: null },
    { label: 'This Month', value: { start: startOfMonth(new Date()), end: endOfMonth(new Date()) } },
    { label: 'This Quarter', value: { start: startOfQuarter(new Date()), end: endOfQuarter(new Date()) } },
    { label: 'This Year', value: { start: new Date(new Date().getFullYear(), 0, 1), end: new Date(new Date().getFullYear(), 11, 31) } }
  ];

  const handleCategoryToggle = (category) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    
    onFiltersChange({
      ...filters,
      categories: newCategories
    });
  };

  const handleStatusChange = (status) => {
    onFiltersChange({
      ...filters,
      status
    });
  };

  const handleDateRangeChange = (dateRange) => {
    onFiltersChange({
      ...filters,
      dateRange
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      categories: [],
      status: 'all',
      dateRange: null
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.categories.length > 0) count++;
    if (filters.status !== 'all') count++;
    if (filters.dateRange) count++;
    return count;
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

  return (
    <div className="border-t border-surface-100">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-4 py-2 border rounded-lg transition-all ${
                showFilters || getActiveFilterCount() > 0
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-surface-300 text-surface-600 hover:border-surface-400'
              }`}
            >
              <ApperIcon name="Filter" className="w-4 h-4 mr-2" />
              Filter
              {getActiveFilterCount() > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-primary text-white text-xs rounded-full">
                  {getActiveFilterCount()}
                </span>
              )}
            </Button>

            {getActiveFilterCount() > 0 && (
              <Button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={clearFilters}
                className="text-sm text-surface-500 hover:text-surface-700 transition-colors"
              >
                Clear all
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-4 text-sm text-surface-600">
            <span>{goals.length} total goals</span>
            <span>•</span>
            <span>{goals.filter(g => g.status === 'active').length} active</span>
            <span>•</span>
            <span>{goals.filter(g => g.status === 'completed').length} completed</span>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 space-y-4"
            >
              {/* Categories */}
              {categories.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categories
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                      <Button
                        key={category}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCategoryToggle(category)}
                        className={`flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all ${
                          filters.categories.includes(category)
                            ? 'bg-primary text-white'
                            : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full mr-2 ${getCategoryColor(category)}`}></div>
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {statuses.map(status => (
                    <Button
                      key={status}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleStatusChange(status)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                        filters.status === status
                          ? 'bg-primary text-white'
                          : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                      }`}
                    >
                      {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Range
                </label>
                <div className="flex flex-wrap gap-2">
                  {dateRangeOptions.map((option, index) => (
                    <Button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDateRangeChange(option.value)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                        (filters.dateRange === null && option.value === null) ||
                        (filters.dateRange && option.value && 
                         filters.dateRange.start.getTime() === option.value.start.getTime())
                          ? 'bg-primary text-white'
                          : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                      }`}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FilterToolbar;