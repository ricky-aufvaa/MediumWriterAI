import React, { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useArticle } from '../context/ArticleContext';
import ReactMarkdown from 'react-markdown';
import ArticleService from '../services/api';

const GeneratorPage: React.FC = () => {
  const { articleRequest, setArticleRequest, article, isLoading, error, generateArticle, runTestGeneration } = useArticle();
  
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    description: '',
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setArticleRequest({
      ...articleRequest,
      [name]: value,
    });
    
    // Clear validation error when user types
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors({
        ...validationErrors,
        [name]: '',
      });
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors = {
      name: '',
      description: '',
    };
    
    let isValid = true;
    
    if (!articleRequest.name.trim()) {
      errors.name = 'Article name is required';
      isValid = false;
    } else if (articleRequest.name.length < 3) {
      errors.name = 'Article name must be at least 3 characters';
      isValid = false;
    }
    
    if (!articleRequest.description.trim()) {
      errors.description = 'Description is required';
      isValid = false;
    } else if (articleRequest.description.length < 10) {
      errors.description = 'Description must be at least 10 characters';
      isValid = false;
    }
    
    setValidationErrors(errors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      generateArticle();
    }
  };

  // Handle test generation
  const handleTestGeneration = () => {
    runTestGeneration();
  };

  // Direct API health check test
  const testApiConnection = async () => {
    try {
      const result = await ArticleService.healthCheck();
      console.log('API Health Check Result:', result);
      alert(`API Connection Test: ${result.status}\n${result.message || ''}`);
    } catch (error) {
      console.error('API Connection Test Failed:', error);
      alert('API Connection Test Failed. Check console for details.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-center mb-8">Article Generator</h1>
        <p className="text-center text-secondary-600 mb-12 max-w-3xl mx-auto">
          Fill in the form below to generate a high-quality article using our AI-powered Write-Reflect workflow.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Column */}
        <motion.div
          className="card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-serif font-bold mb-6">Generate Article</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="form-label">Article Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={articleRequest.name}
                onChange={handleInputChange}
                className={`form-input ${validationErrors.name ? 'border-red-500' : ''}`}
                placeholder="E.g., The Future of AI in Healthcare"
                disabled={isLoading}
              />
              {validationErrors.name && (
                <p className="form-error">{validationErrors.name}</p>
              )}
            </div>
            
            <div className="mb-6">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                id="description"
                name="description"
                value={articleRequest.description}
                onChange={handleInputChange}
                className={`form-input min-h-[120px] ${validationErrors.description ? 'border-red-500' : ''}`}
                placeholder="Describe what you want the article to be about..."
                disabled={isLoading}
              />
              {validationErrors.description && (
                <p className="form-error">{validationErrors.description}</p>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                className="btn-primary flex-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  'Generate Article'
                )}
              </button>
              
              <button
                type="button"
                className="btn-secondary"
                onClick={handleTestGeneration}
                disabled={isLoading}
              >
                Run Test Generation
              </button>
              
              <button
                type="button"
                className="btn-secondary bg-purple-600 hover:bg-purple-700"
                onClick={testApiConnection}
                disabled={isLoading}
              >
                Test API Connection
              </button>
            </div>
          </form>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
              {error}
            </div>
          )}
        </motion.div>
        
        {/* Results Column */}
        <motion.div
          className="card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-serif font-bold mb-6">Results</h2>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
              <p className="text-secondary-600">Generating your article...</p>
              <p className="text-sm text-secondary-500 mt-2">This may take a few moments</p>
            </div>
          ) : article ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{article.name}</h3>
                {article.qualityScore !== undefined && (
                  <div className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                    Quality Score: {article.qualityScore}/100
                  </div>
                )}
              </div>
              
              <p className="text-secondary-600 mb-4">{article.description}</p>
              
              <div className="border-t border-b border-secondary-200 py-4 my-4">
                <div className="prose max-w-none">
                  <ReactMarkdown>{article.content}</ReactMarkdown>
                </div>
              </div>
              
              {article.improvements && article.improvements.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-secondary-900 mb-2">Improvements Made:</h4>
                  <ul className="list-disc pl-5 text-secondary-600">
                    {article.improvements.map((improvement, index) => (
                      <li key={index}>{improvement}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {article.iterations !== undefined && (
                <p className="text-sm text-secondary-500 mt-4">
                  Generated in {article.iterations} iterations
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-secondary-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-secondary-900 mb-1">No Article Generated Yet</h3>
              <p className="text-secondary-500 max-w-sm">
                Fill out the form and click "Generate Article" to create your content.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default GeneratorPage;
