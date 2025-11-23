import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto text-center py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-9xl font-bold text-primary-300 mb-6">404</div>
        
        <h1 className="text-4xl font-serif font-bold mb-4">Page Not Found</h1>
        
        <p className="text-xl text-secondary-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Link 
            to="/" 
            className="btn-primary inline-flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Home
          </Link>
        </motion.div>
      </motion.div>
      
      <motion.div
        className="mt-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <h2 className="text-xl font-medium mb-4">Looking for something else?</h2>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/generator" className="btn-secondary">
            Generate an Article
          </Link>
          <Link to="/viewer" className="btn-secondary">
            View Articles
          </Link>
          <Link to="/about" className="btn-secondary">
            About ArticleAI
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
