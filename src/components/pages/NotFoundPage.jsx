import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const NotFoundPage = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-surface-50">
      <div className="text-center max-w-md p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="mb-6"
          >
            <ApperIcon name="Calendar" className="w-24 h-24 text-surface-300 mx-auto" />
          </motion.div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
          <p className="text-surface-600 mb-6">
            Looks like this page got lost in time. Let's get you back to planning your year.
          </p>
          
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
            Back to YearFlow
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;