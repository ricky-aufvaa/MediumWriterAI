import os
from dotenv import load_dotenv
from langchain_aws import ChatBedrock

# Load environment variables
load_dotenv()

def get_chat_model():
    """
    Create and return a configured ChatBedrock model instance
    """
    model_id = os.getenv("BEDROCK_MODEL_ID")
    aws_region = os.getenv("AWS_REGION", "us-east-1")
    
    if not model_id:
        raise ValueError("BEDROCK_MODEL_ID environment variable is required")
    
    llm = ChatBedrock(
        model=model_id,
        region_name=aws_region,
        model_kwargs={
            "max_tokens": 8000,  # Increased for better article completion
            "temperature": 0.7
        }
    )
    return llm
