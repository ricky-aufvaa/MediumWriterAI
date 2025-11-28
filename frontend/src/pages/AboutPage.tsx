import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ArticleService from '../services/api';

interface SystemInfo {
  version: string;
  modelName: string;
  maxTokens: number;
  features: string[];
}

const AboutPage: React.FC = () => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSystemInfo = async () => {
      try {
        const info = await ArticleService.getSystemInfo();
        setSystemInfo(info);
      } catch (error) {
        console.error('Error fetching system info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSystemInfo();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  // Technology stack data
  const frontendTech = [
    { name: 'React 18+', description: 'JavaScript library for building user interfaces' },
    { name: 'TypeScript', description: 'Typed superset of JavaScript' },
    { name: 'Tailwind CSS', description: 'Utility-first CSS framework' },
    { name: 'React Router', description: 'Declarative routing for React' },
    { name: 'Framer Motion', description: 'Animation library for React' },
    { name: 'React Markdown', description: 'Markdown renderer for React' },
  ];

  const backendTech = [
    { name: 'FastAPI', description: 'Modern, fast web framework for building APIs with Python' },
    { name: 'LangGraph', description: 'Framework for building stateful, multi-step AI workflows' },
    { name: 'Python', description: 'Programming language for backend development' },
    { name: 'Large Language Models', description: 'Advanced AI models for text generation' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-center mb-8">About ArticleAI</h1>
        <p className="text-center text-secondary-600 mb-12 max-w-3xl mx-auto">
          ArticleAI is an intelligent article writing system that uses a Write-Reflect workflow to generate high-quality content.
        </p>
      </motion.div>

      {/* How it works section */}
      <motion.section 
        className="card mb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2 
          className="text-2xl font-serif font-bold mb-6"
          variants={itemVariants}
        >
          How It Works
        </motion.h2>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center">
            <div className="bg-primary-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-600">1</span>
            </div>
            <h3 className="text-lg font-bold mb-2">Input</h3>
            <p className="text-secondary-600">
              You provide a name and description for your article.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center">
            <div className="bg-primary-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-600">2</span>
            </div>
            <h3 className="text-lg font-bold mb-2">Write-Reflect</h3>
            <p className="text-secondary-600">
              Our AI generates content and then critically evaluates and improves it.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center">
            <div className="bg-primary-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-600">3</span>
            </div>
            <h3 className="text-lg font-bold mb-2">Quality Results</h3>
            <p className="text-secondary-600">
              You receive a polished article with quality metrics and improvement details.
            </p>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* System info section */}
      <motion.section 
        className="card mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-2xl font-serif font-bold mb-6">System Information</h2>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          </div>
        ) : systemInfo ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-secondary-50 p-4 rounded-md">
              <div className="text-sm text-secondary-500 mb-1">Version</div>
              <div className="font-medium">{systemInfo.version}</div>
            </div>
            
            <div className="bg-secondary-50 p-4 rounded-md">
              <div className="text-sm text-secondary-500 mb-1">Model</div>
              <div className="font-medium">{systemInfo.modelName}</div>
            </div>
            
            <div className="bg-secondary-50 p-4 rounded-md">
              <div className="text-sm text-secondary-500 mb-1">Max Tokens</div>
              <div className="font-medium">{systemInfo.maxTokens.toLocaleString()}</div>
            </div>
            
            <div className="bg-secondary-50 p-4 rounded-md">
              <div className="text-sm text-secondary-500 mb-1">Features</div>
              <div className="font-medium">
                {systemInfo.features.join(', ')}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-red-50 text-red-700 p-4 rounded-md">
            Unable to load system information. Please try again later.
          </div>
        )}
      </motion.section>

      {/* Technology stack section */}
      <motion.section 
        className="card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-2xl font-serif font-bold mb-6">Technology Stack</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary-700">Frontend</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {frontendTech.map((tech, index) => (
                <div key={index} className="bg-secondary-50 p-4 rounded-md">
                  <div className="font-medium mb-1">{tech.name}</div>
                  <div className="text-sm text-secondary-600">{tech.description}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary-700">Backend</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {backendTech.map((tech, index) => (
                <div key={index} className="bg-secondary-50 p-4 rounded-md">
                  <div className="font-medium mb-1">{tech.name}</div>
                  <div className="text-sm text-secondary-600">{tech.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutPage;
