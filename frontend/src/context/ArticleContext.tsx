import React, { createContext, useContext, useState, ReactNode } from 'react';
import ArticleService from '../services/api';

// Types
interface Article {
  id?: string;
  name: string;
  description: string;
  content: string;
  qualityScore?: number;
  iterations?: number;
  improvements?: string[];
  createdAt?: string;
}

interface ArticleRequest {
  name: string;
  description: string;
}

interface ArticleContextType {
  articleRequest: ArticleRequest;
  article: Article | null;
  isLoading: boolean;
  error: string | null;
  setArticleRequest: (request: ArticleRequest) => void;
  generateArticle: () => Promise<void>;
  runTestGeneration: () => Promise<void>;
  clearArticle: () => void;
}

// Default values
const defaultArticleRequest: ArticleRequest = {
  name: '',
  description: '',
};

// Create context
const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

// Provider component
export const ArticleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [articleRequest, setArticleRequest] = useState<ArticleRequest>(defaultArticleRequest);
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Generate article
  const generateArticle = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Call the API service
      const response = await ArticleService.generateArticle(articleRequest);
      setArticle(response);
    } catch (err) {
      setError('Failed to generate article. Please try again.');
      console.error('Error generating article:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Run test generation
  const runTestGeneration = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Call the API service
      const response = await ArticleService.runTestGeneration();
      setArticle(response);
    } catch (err) {
      setError('Failed to run test generation. Please try again.');
      console.error('Error running test generation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear article
  const clearArticle = (): void => {
    setArticle(null);
    setError(null);
  };

  return (
    <ArticleContext.Provider
      value={{
        articleRequest,
        article,
        isLoading,
        error,
        setArticleRequest,
        generateArticle,
        runTestGeneration,
        clearArticle,
      }}
    >
      {children}
    </ArticleContext.Provider>
  );
};

// Custom hook to use the context
export const useArticle = (): ArticleContextType => {
  const context = useContext(ArticleContext);
  if (context === undefined) {
    throw new Error('useArticle must be used within an ArticleProvider');
  }
  return context;
};
