# ArticleAI Frontend

A modern, professional React.js frontend for the ArticleAI article writing system.

## Features

- **Modern UI**: Clean, professional interface with Tailwind CSS
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Interactive Article Generation**: Real-time article creation with progress feedback
- **Article Viewer**: Dedicated page for viewing and exporting generated articles
- **Animations**: Smooth transitions and animations with Framer Motion
- **Type Safety**: Built with TypeScript for robust code
- **State Management**: Context API for global state
- **Form Validation**: Client-side validation for all inputs
- **API Integration**: Seamless communication with the backend API

## Technology Stack

- **React 18+**: Modern JavaScript library for building user interfaces
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **React Router v6**: Declarative routing for React applications
- **Framer Motion**: Animation library for React
- **Axios**: Promise-based HTTP client for API requests
- **React Markdown**: Markdown renderer for React
- **Webpack**: Module bundler for JavaScript applications

## Getting Started

### Prerequisites

- Node.js 14+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd articleai-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. The application will open in your default browser at http://localhost:3001

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Footer.tsx   # Footer component
│   │   ├── Layout.tsx   # Layout wrapper component
│   │   └── Navbar.tsx   # Navigation bar component
│   ├── context/         # React Context for state management
│   │   └── ArticleContext.tsx  # Article state management
│   ├── pages/           # Page components
│   │   ├── AboutPage.tsx       # About page
│   │   ├── GeneratorPage.tsx   # Article generator page
│   │   ├── HomePage.tsx        # Landing page
│   │   ├── NotFoundPage.tsx    # 404 page
│   │   └── ViewerPage.tsx      # Article viewer page
│   ├── services/        # API services
│   │   └── api.ts       # API integration with Axios
│   ├── App.tsx          # Main application component
│   ├── index.css        # Global styles with Tailwind
│   └── index.tsx        # Application entry point
├── .babelrc             # Babel configuration
├── package.json         # Project dependencies and scripts
├── postcss.config.js    # PostCSS configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── webpack.config.js    # Webpack configuration
```

## Pages

- **Home**: Landing page with introduction and features
- **Generator**: Main page for article generation
- **Viewer**: Page for viewing and exporting generated articles
- **About**: Information about the application and technology
- **NotFound**: 404 page for invalid routes

## API Integration

The frontend communicates with the ArticleAI backend API using Axios. The main endpoints used are:

- `POST /generate-article`: Generate an article with name and description
- `POST /test-generation`: Run a test generation with predefined example
- `GET /system-info`: Get information about the system configuration
- `GET /health`: Check API health status

## State Management

The application uses React Context API for state management. The main context is `ArticleContext` which provides:

- Article request data
- Article response data
- Loading states
- Error handling
- Methods for article generation

## Styling

The UI is styled using Tailwind CSS with custom extensions for:

- Color palette (primary, secondary, accent)
- Typography (sans-serif for body, serif for headings)
- Component styles (buttons, cards, forms)
- Responsive design

## License

This project is licensed under the ISC License.
