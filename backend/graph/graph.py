from langgraph.graph import START, END, StateGraph
from typing import List

from .nodes import write_node, reflect_node
from .state import MyState

def should_continue(state: MyState) -> str:
    """Decide whether to continue improving or finish"""
    quality_score = state.get("quality_score", 0)
    iteration_count = state.get("iteration_count", 0)
    
    # More permissive threshold for testing - stop if quality is 6+ or max iterations reached
    # This accounts for token limitations during testing that may cause article truncation
    if quality_score >= 6 or iteration_count >= 3:
        return "end"
    else:
        return "continue"

def input_node(state: MyState):
    """Initialize the state with input data"""
    # This node just passes through the input state
    # In a real application, this might validate inputs or set defaults
    return {
        "iteration_count": 0,
        "improvements": [],
        "messages": [f"Starting article generation for: {state['article_name']}"]
    }

# Build the graph
graph_builder = StateGraph(MyState)

# Add nodes
graph_builder.add_node("input", input_node)
graph_builder.add_node("write", write_node)
graph_builder.add_node("reflect", reflect_node)

# Set entry point
graph_builder.set_entry_point("input")

# Add edges
graph_builder.add_edge("input", "write")
graph_builder.add_edge("write", "reflect")

# Add conditional edge from reflect
graph_builder.add_conditional_edges(
    "reflect",
    should_continue,
    {
        "continue": "write",  # Go back to write for improvement
        "end": END           # Finish the process
    }
)

# Compile the graph
graph = graph_builder.compile()
