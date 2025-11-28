from langchain_core.output_parsers import PydanticOutputParser
from langchain_core.runnables import RunnableLambda
from .prompts import write_chain_prompt, reflect_chain_prompt
from .models import WriteResponse, ReflectResponse
from .helpers import get_chat_model
from .tools import fetch_readme, fetch_images

def write_chain():
    """
    Create a write chain that can use tools and return structured output
    """
    llm = get_chat_model()
    
    # Create output parser for structured response
    output_parser = PydanticOutputParser(pydantic_object=WriteResponse)
    
    # Create the chain without tool binding for now
    # Tools will be handled at the node level if needed
    chain = write_chain_prompt | llm | output_parser
    return chain

def reflect_chain():
    """
    Create a reflect chain with structured output
    """
    llm = get_chat_model()
    
    # Create output parser for structured response
    output_parser = PydanticOutputParser(pydantic_object=ReflectResponse)
    
    chain = reflect_chain_prompt | llm | output_parser
    return chain
