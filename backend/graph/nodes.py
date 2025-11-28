from .state import MyState
from .chains import write_chain, reflect_chain

def write_node(state: MyState):
    """Write agent node that generates or improves the article"""
    print("Entered write chain")
    chain = write_chain()
    
    # Prepare context for improvements if this is not the first iteration
    improvements_context = ""
    if state.get("improvements") and state.get("iteration_count", 0) > 0:
        improvements_list = "\n".join([f"- {imp}" for imp in state["improvements"]])
        improvements_context = f"""
Previous feedback to address:
{improvements_list}

Please incorporate these improvements into your article.
"""
    
    # Invoke the chain with proper context
    response = chain.invoke({
        "article_name": state["article_name"],
        "article_description": state["article_description"],
        "iteration_count": state.get("iteration_count", 0),
        "improvements_context": improvements_context
    })
    print(response.article) 
    # Update state with new article content
    return {
        "article_content": response.article,
        "iteration_count": state.get("iteration_count", 0) + 1,
        "messages": state.get("messages", []) + [f"Article written/updated (iteration {state.get('iteration_count', 0) + 1})"]
    }

def reflect_node(state: MyState):
    """Reflect agent node that analyzes the article and suggests improvements"""
    print("Entered reflect chain")
    chain = reflect_chain()
    
    # Invoke the reflection chain
    response = chain.invoke({
        "article_content": state["article_content"],
        "article_name": state["article_name"],
        "article_description": state["article_description"]
    })
    
    # Update state with reflection results
    print(f"The improvements are \n\n {response.improvements}")
    return {
        "improvements": response.improvements,
        "quality_score": response.overall_quality_score,
        "messages": state.get("messages", []) + [f"Article reviewed - Quality Score: {response.overall_quality_score}/10"]
    }
