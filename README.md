# Article Writing System

An intelligent article writing system using LangGraph that employs a Write-Reflect workflow to generate high-quality articles.

## System Overview

The system implements a multi-agent workflow:

1. **Input**: Article name and description
2. **Write Agent**: Generates/improves the article using available tools
3. **Reflect Agent**: Reviews the article and suggests improvements
4. **Iterative Improvement**: Continues until quality threshold is met (score ≥8) or max iterations (3)

## Screenshots
![screenshot][./screenshots/1.jpeg]
![screenshot][./screenshots/2.jpeg]
![screenshot][./screenshots/3.jpeg]
![screenshot][./screenshots/4.jpeg]
![screenshot][./screenshots/5.jpeg]
![screenshot][./screenshots/6.jpeg]
![screenshot][./screenshots/7.jpeg]
![screenshot][./screenshots/8.jpeg]

## Architecture

### Components

- **State Management** (`state.py`): Tracks article content, improvements, and workflow progress
- **Models** (`models.py`): Pydantic models for structured outputs
- **Prompts** (`prompts.py`): System prompts for write and reflect agents
- **Chains** (`chains.py`): LangChain chains with structured outputs
- **Nodes** (`nodes.py`): Graph nodes for write and reflect operations
- **Tools** (`tools.py`): Two tools for the write agent:
  - `fetch_readme`: Loads project README for context
  - `fetch_images`: Lists available images for article inclusion
- **Graph** (`graph.py`): LangGraph workflow with conditional logic

### Workflow

```
Input → Write Agent → Reflect Agent → Decision
                ↑                        ↓
                └── Continue (if score < 8) ← End (if score ≥ 8 or max iterations)
```

## Features

- **Tool Integration**: Write agent can use tools when needed for enhanced content
- **Quality Control**: Reflect agent scores articles 1-10 and provides specific feedback
- **Iterative Improvement**: Automatic refinement based on feedback
- **Structured Outputs**: Ensures consistent response formats

## Usage

### FastAPI Web API (Recommended)

The system is now available as a REST API using FastAPI:

#### Quick Start

```bash
cd backend
python start_server.py
```

This will:
- Check environment variables
- Install dependencies
- Start the server at http://localhost:8000

#### API Endpoints

**Generate Article** - `POST /generate-article`
```json
{
  "article_name": "Your Article Title",
  "article_description": "Detailed description of what the article should cover"
}
```

**Test Generation** - `POST /test-generation`
- Generates a sample article about FastAPI

**System Info** - `GET /system-info`
- Returns system configuration and status

**Health Check** - `GET /health`
- Basic health check endpoint

#### API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

#### Example API Usage

```bash
# Using curl
curl -X POST "http://localhost:8000/generate-article" \
     -H "Content-Type: application/json" \
     -d '{
       "article_name": "Introduction to Machine Learning",
       "article_description": "A comprehensive guide covering ML basics, algorithms, and applications"
     }'

# Test endpoint
curl -X POST "http://localhost:8000/test-generation"
```

### Direct Python Usage

```python
from graph.graph import graph
from graph.state import MyState

# Define your article requirements
initial_state: MyState = {
    "article_name": "Your Article Title",
    "article_description": "Detailed description of what the article should cover",
    "article_content": None,
    "improvements": [],
    "quality_score": None,
    "iteration_count": 0,
    "messages": []
}

# Generate the article
result = graph.invoke(initial_state)

# Access the final article
final_article = result["article_content"]
quality_score = result["quality_score"]
```

### Running Tests

```bash
cd backend
python test_article_system.py
```

## Configuration

### Environment Variables

Create a `.env` file with:

```
```

### Dependencies

```bash
pip install langgraph langchain pydantic
```

## Key Improvements Made

1. **Removed Improvement Suggestions from Write Agent**: As requested, only the reflect agent suggests improvements
2. **Enhanced State Management**: Comprehensive state tracking for the workflow
3. **Tool Integration**: Write agent equipped with README and image fetching tools
4. **Conditional Flow**: Smart decision-making for when to stop iterating
5. **Structured Outputs**: Proper Pydantic models for consistent responses
6. **Error Handling**: Robust error handling throughout the system

## Customization

### Adding New Tools

1. Create tool functions in `tools.py` using `@tool` decorator
2. Add tools to the `write_chain()` function in `chains.py`
3. Update prompts to include tool usage instructions

### Modifying Quality Criteria

Adjust the `should_continue()` function in `graph.py` to change:
- Quality score threshold (currently 8/10)
- Maximum iterations (currently 3)

### Customizing Prompts

Edit `prompts.py` to modify:
- Writing guidelines and style
- Reflection criteria and scoring
- Tool usage instructions

## Output

The system produces:
- **High-quality article** in markdown format
- **Quality score** (1-10 scale)
- **Improvement suggestions** (if score < 8)
- **Workflow messages** for debugging/monitoring

This system ensures consistent, high-quality article generation through intelligent agent collaboration and iterative refinement.
