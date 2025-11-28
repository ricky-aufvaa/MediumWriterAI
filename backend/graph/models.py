from pydantic import BaseModel, Field
from typing import List

class WriteResponse(BaseModel):
    """
    The output from this model will ensure
    that the entire article is generated 
    without improvements field (as requested by user)
    """
    article: str = Field(description="The complete article content in markdown format")

class ReflectResponse(BaseModel):
    """
    This is the output from reflection agent.
    """
    improvements: List[str] = Field(description="List of specific improvements suggested for the article")
    overall_quality_score: int = Field(description="Quality score from 1-10, where 8+ means article is ready")
    reasoning: str = Field(description="Detailed reasoning for the improvements and quality score")
