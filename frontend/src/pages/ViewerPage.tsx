import React from 'react';
import { motion } from 'framer-motion';
import { useArticle } from '../context/ArticleContext';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const ViewerPage: React.FC = () => {
  const { article } = useArticle();

  // Function to copy article content to clipboard
  const copyToClipboard = () => {
    if (article) {
      navigator.clipboard.writeText(article.content)
        .then(() => {
          alert('Article content copied to clipboard!');
        })
        .catch((err) => {
          console.error('Failed to copy text: ', err);
          alert('Failed to copy text. Please try again.');
        });
    }
  };

  // Function to download article as markdown file
  const downloadArticle = () => {
    if (article) {
      const element = document.createElement('a');
      const file = new Blob([article.content], { type: 'text/markdown' });
      element.href = URL.createObjectURL(file);
      element.download = `${article.name.replace(/\s+/g, '-').toLowerCase()}.md`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-center mb-8">Article Viewer</h1>
      </motion.div>

      {article ? (
        <motion.div
          className="card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-2xl font-serif font-bold">{article.name}</h2>
            
            <div className="flex gap-2 mt-4 sm:mt-0">
              <button
                onClick={copyToClipboard}
                className="btn-secondary flex items-center text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy
              </button>
              <button
                onClick={downloadArticle}
                className="btn-primary flex items-center text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>
            </div>
          </div>
          
          <div className="bg-secondary-50 rounded-md p-4 mb-6">
            <p className="text-secondary-600">{article.description}</p>
          </div>
          
          <div className="mb-8">
            <div className="prose max-w-none">
              <ReactMarkdown>{article.content}</ReactMarkdown>
            </div>
          </div>
          
          <div className="border-t border-secondary-200 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {article.qualityScore !== undefined && (
                <div className="bg-primary-50 rounded-md p-4 text-center">
                  <div className="text-2xl font-bold text-primary-700">{article.qualityScore}/100</div>
                  <div className="text-sm text-primary-600">Quality Score</div>
                </div>
              )}
              
              {article.iterations !== undefined && (
                <div className="bg-secondary-50 rounded-md p-4 text-center">
                  <div className="text-2xl font-bold text-secondary-700">{article.iterations}</div>
                  <div className="text-sm text-secondary-600">Iterations</div>
                </div>
              )}
              
              {article.createdAt && (
                <div className="bg-secondary-50 rounded-md p-4 text-center">
                  <div className="text-lg font-medium text-secondary-700">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-secondary-600">Created Date</div>
                </div>
              )}
            </div>
            
            {article.improvements && article.improvements.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Improvements Made</h3>
                <ul className="list-disc pl-5 text-secondary-600 space-y-1">
                  {article.improvements.map((improvement, index) => (
                    <li key={index}>{improvement}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="card text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-secondary-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="text-2xl font-serif font-bold mb-4">No Article to Display</h2>
          <p className="text-secondary-600 max-w-md mx-auto mb-8">
            You haven't generated any articles yet. Go to the generator page to create your first article.
          </p>
          <Link to="/generator" className="btn-primary inline-block">
            Go to Generator
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default ViewerPage;
