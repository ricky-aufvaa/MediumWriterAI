"""
Test script to demonstrate the article writing system
"""
import os
import sys
from dotenv import load_dotenv
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
load_dotenv()


from graph.graph import graph
from graph.state import MyState

def test_article_generation():
    """Test the article generation workflow"""
    
    # Example input state
    initial_state: MyState = {
        "article_name": "Introduction to Machine Learning",
        "article_description": "A comprehensive guide covering the basics of machine learning, including supervised and unsupervised learning, common algorithms, and practical applications.",
        "article_content": None,
        "improvements": [],
        "quality_score": None,
        "iteration_count": 0,
        "messages": []
    }
    
    print("Starting article generation...")
    print(f"Article Name: {initial_state['article_name']}")
    print(f"Description: {initial_state['article_description']}")
    print("-" * 50)
    
    try:
        # Run the graph
        result = graph.invoke(initial_state)
        
        print("Article generation completed!")
        print(f"Final Quality Score: {result.get('quality_score', 'N/A')}/10")
        print(f"Total Iterations: {result.get('iteration_count', 0)}")
        print(f"Messages: {result.get('messages', [])}")
        print("-" * 50)
        print("Generated Article:")
        print(result.get('article_content', 'No article content generated'))
        
        return result
        
    except Exception as e:
        print(f"Error during article generation: {str(e)}")
        return None

if __name__ == "__main__":
    test_article_generation()
