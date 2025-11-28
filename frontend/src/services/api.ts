import axios from 'axios';

// Types
interface ArticleRequest {
  name: string;
  description: string;
}

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

// Backend response interfaces
interface BackendArticleResponse {
  article_content: string;
  quality_score: number;
  iteration_count: number;
  improvements: string[];
  messages: string[];
  success: boolean;
}

interface SystemInfo {
  version: string;
  modelName: string;
  maxTokens: number;
  features: string[];
}

interface HealthResponse {
  status: string;
  message: string;
}

// Helper functions to map between frontend and backend data structures
const mapBackendToFrontend = (backendResponse: BackendArticleResponse, request: ArticleRequest): Article => {
  return {
    name: request.name,
    description: request.description,
    content: backendResponse.article_content,
    qualityScore: backendResponse.quality_score,
    iterations: backendResponse.iteration_count,
    improvements: backendResponse.improvements,
    createdAt: new Date().toISOString(),
  };
};

const mapRequestToBackend = (request: ArticleRequest) => {
  return {
    article_name: request.name,
    article_description: request.description,
  };
};

// Create axios instance
const api = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// API functions
export const ArticleService = {
  // Generate article
  generateArticle: async (request: ArticleRequest): Promise<Article> => {
    try {
      console.log('Sending request to backend:', mapRequestToBackend(request));
      const response = await api.post<BackendArticleResponse>('/generate-article', mapRequestToBackend(request));
      console.log('Received response from backend:', response.data);
      return mapBackendToFrontend(response.data, request);
    } catch (error) {
      console.error('Error generating article:', error);
      throw new Error('Failed to generate article');
    }
  },

  // Run test generation
  runTestGeneration: async (): Promise<Article> => {
    try {
      console.log('Sending test generation request to backend');
      const response = await api.post<BackendArticleResponse>('/test-generation');
      console.log('Received test generation response from backend:', response.data);
      // Create a dummy request for mapping
      const dummyRequest = {
        name: 'Test Article',
        description: 'Test article generated with predefined parameters'
      };
      return mapBackendToFrontend(response.data, dummyRequest);
    } catch (error) {
      console.error('Error running test generation:', error);
      throw new Error('Failed to run test generation');
    }
  },

  // Get system info
  getSystemInfo: async (): Promise<SystemInfo> => {
    try {
      const response = await api.get('/system-info');
      return response.data;
    } catch (error) {
      console.error('Error getting system info:', error);
      throw new Error('Failed to get system info');
    }
  },

  // Health check
  healthCheck: async (): Promise<HealthResponse> => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Error checking health:', error);
      throw new Error('Failed to check health');
    }
  },
};

export default ArticleService;
