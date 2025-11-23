from typing import List, Optional
from typing_extensions import TypedDict

class MyState(TypedDict):
    # Input fields
    article_name: str
    article_description: str
    
    # Content fields
    article_content: Optional[str]
    
    # Workflow tracking
    improvements: List[str]
    quality_score: Optional[int]
    iteration_count: int
    
    # Messages for debugging/logging
    messages: List[str]
