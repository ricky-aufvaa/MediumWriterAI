"""
Creating 2 tools 
"""
from langchain.tools import tool
import os

@tool(description="This tool will load the readme.md file of the project to understand more context of the project")
def fetch_readme(doc_path:str):
    """

    """
    with open(doc_path) as f:
        readme = f.read()
    return readme

@tool(description="This tool will give out a list of images file names for the llm to understand what the image is about and add them in the document")
def fetch_images(image_folder_path:str):
    """

    """
    # Supported image extensions
    image_extensions = {'.jpg', '.jpeg', '.png', '.svg'}

    # List all files in the folder
    files = os.listdir(image_folder_path)

    # Filter files by extension
    image_files = [
        f for f in files
        if os.path.isfile(os.path.join(image_folder_path, f)) and os.path.splitext(f)[1].lower() in image_extensions
    ]

    return image_files
