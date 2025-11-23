from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from .models import WriteResponse, ReflectResponse

# Create output parsers
write_output_parser = PydanticOutputParser(pydantic_object=WriteResponse)
reflect_output_parser = PydanticOutputParser(pydantic_object=ReflectResponse)

write_chain_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are an expert article writer. Your task is to write a comprehensive, well-structured article based on the given name and description.

You have access to two tools that you should use when they would enhance the article:
1. fetch_readme - Use this to get context about a project if the article is about a specific project
2. fetch_images - Use this to get a list of available images that you can reference in the article

Guidelines:
- Write in markdown format
- Create engaging, informative content
- Use proper headings, subheadings, and formatting
- Include relevant examples and explanations
- Make the article comprehensive and valuable to readers
- If you use the tools, incorporate the information naturally into the article
- Reference images by their filenames when appropriate (e.g., ![Description](image_filename.png))

Article Name: {article_name}
Article Description: {article_description}

Current iteration: {iteration_count}
{improvements_context}

{format_instructions}

Write the complete article now:"""),
    ("human", "Please write the article based on the requirements above.")
]).partial(format_instructions=write_output_parser.get_format_instructions())

reflect_chain_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are an expert content reviewer and editor. Your task is to carefully analyze the provided article and suggest specific improvements.

IMPORTANT: This system is in testing mode. Be more lenient with scoring, especially if the article appears to be cut off due to token limitations. Focus on the quality of the content that IS present rather than penalizing for incompleteness.

Evaluate the article on these criteria:
1. Content quality and accuracy
2. Structure and organization
3. Clarity and readability
4. Completeness and depth (be lenient if article seems truncated)
5. Engagement and flow
6. Technical accuracy (if applicable)
7. Grammar and style

Scoring Guidelines:
- Score 6-7: Good content with minor issues or appears truncated but has solid foundation
- Score 8-10: Excellent content that's comprehensive and well-written
- Score 4-5: Needs significant improvement
- Score 1-3: Major issues requiring complete rewrite

If the article appears to be cut off or incomplete due to token limits, focus your evaluation on the content that IS present and be more forgiving in your scoring.

Provide:
- Specific, actionable improvements
- A quality score from 1-10 (where 6+ is acceptable for testing)
- Detailed reasoning for your assessment

Be constructive and specific in your feedback. Focus on what would make the article more valuable to readers.

Article to review:
{article_content}

Article Name: {article_name}
Article Description: {article_description}

{format_instructions}"""),
    ("human", "Please analyze this article and provide your feedback.")
]).partial(format_instructions=reflect_output_parser.get_format_instructions())
