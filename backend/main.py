"""
FastAPI application for the Article Writing System
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from graph.graph import graph
from graph.state import MyState

app = FastAPI(
    title="Article Writing System API",
    description="An intelligent article writing system using LangGraph with Write-Reflect workflow",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response Models
class ArticleRequest(BaseModel):
    article_name: str = Field(..., description="The title/name of the article to generate")
    article_description: str = Field(..., description="Detailed description of what the article should cover")
    doc_path: Optional[str] = Field(None, description="Optional path to README file for context")
    image_folder_path: Optional[str] = Field(None, description="Optional path to images folder")

class ArticleResponse(BaseModel):
    article_content: str = Field(..., description="The generated article content in markdown format")
    quality_score: int = Field(..., description="Quality score from 1-10")
    iteration_count: int = Field(..., description="Number of iterations performed")
    improvements: List[str] = Field(..., description="List of improvements suggested (if any)")
    messages: List[str] = Field(..., description="Workflow messages for debugging")
    success: bool = Field(..., description="Whether the generation was successful")

class HealthResponse(BaseModel):
    status: str
    message: str

@app.get("/", response_model=HealthResponse)
async def root():
    """Root endpoint - health check"""
    return HealthResponse(
        status="healthy",
        message="Article Writing System API is running"
    )

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    try:
        # Basic check to ensure the system is working
        return HealthResponse(
            status="healthy",
            message="All systems operational"
        )
    except Exception as e:
        return HealthResponse(
            status="unhealthy",
            message=f"System error: {str(e)}"
        )

@app.post("/generate-article", response_model=ArticleResponse)
async def generate_article(request: ArticleRequest):
    """
    Generate an article using the Write-Reflect workflow
    
    This endpoint:
    1. Takes article name and description as input
    2. Uses the Write agent to generate content (with optional tools)
    3. Uses the Reflect agent to review and suggest improvements
    4. Iterates until quality threshold is met or max iterations reached
    """
    # Input validation
    if not request.article_name.strip():
        raise HTTPException(
            status_code=400,
            detail="Article name cannot be empty"
        )
    
    if not request.article_description.strip():
        raise HTTPException(
            status_code=400,
            detail="Article description cannot be empty"
        )
    
    if len(request.article_name) > 200:
        raise HTTPException(
            status_code=400,
            detail="Article name must be less than 200 characters"
        )
    
    if len(request.article_description) > 2000:
        raise HTTPException(
            status_code=400,
            detail="Article description must be less than 2000 characters"
        )
    
    try:
        # Prepare initial state
        initial_state: MyState = {
            "article_name": request.article_name.strip(),
            "article_description": request.article_description.strip(),
            "article_content": None,
            "improvements": [],
            "quality_score": None,
            "iteration_count": 0,
            "messages": []
        }
        
        # Run the article generation workflow
        result = graph.invoke(initial_state)
        
        # Validate result
        if not result.get("article_content"):
            raise HTTPException(
                status_code=500,
                detail="Article generation failed - no content produced"
            )
        
        # Return the response
        return ArticleResponse(
            article_content=result.get("article_content", ""),
            quality_score=result.get("quality_score", 0),
            iteration_count=result.get("iteration_count", 0),
            improvements=result.get("improvements", []),
            messages=result.get("messages", []),
            success=True
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Log the error (in production, use proper logging)
        print(f"Error generating article: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error during article generation: {str(e)}"
        )

@app.get("/system-info")
async def get_system_info():
    """Get information about the system configuration"""
    return {
        "system": "Article Writing System",
        "version": "1.0.0",
        "workflow": "Write-Reflect with iterative improvement",
        "max_iterations": 3,
        "quality_threshold": 8,
        "tools_available": [
            "fetch_readme - Load project README for context",
            "fetch_images - List available images for article inclusion"
        ],
        "model": os.getenv("BEDROCK_MODEL_ID", "Not configured"),
        "aws_region": os.getenv("AWS_REGION", "Not configured")
    }

@app.post("/test-generation")
async def test_article_generation():
    """
    Test endpoint with a predefined example
    Useful for testing the system without providing custom input
    """
    test_request = ArticleRequest(
        article_name="Introduction to FastAPI",
        article_description="A comprehensive guide to building REST APIs with FastAPI, covering basic concepts, request/response models, dependency injection, and best practices."
    )
    
    return await generate_article(test_request)

if __name__ == "__main__":
    # Run the server
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
