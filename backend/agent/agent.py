import os
from agents import Agent, Runner, trace, WebSearchTool, ModelSettings, function_tool
from .models.search_models import WebSearchResult
from .models.scorer_models import ScorerResult
from .system_prompts import instructions
from dotenv import load_dotenv

load_dotenv(override=True)    
open_ai_api_key = os.getenv("OPEN_AI_API_KEY")

web_search_agent = Agent(
    name="WebSearchAgent",
    instructions=instructions["WEB_SEARCH_AGENT_INSTRUCTIONS"],
    model="gpt-4.1-mini",
    tools=[WebSearchTool(search_context_size="low")],
    model_settings=ModelSettings(tool_choice="required"),
    output_type=WebSearchResult
)


scorer_agent = Agent(
    name="ScorerAgent",
    instructions=instructions["SCORER_AGENT_INSTRUCTIONS"],
    model="gpt-4.1-mini",
    output_type=ScorerResult
)

async def run_web_search_agent(product_name: str) -> WebSearchResult:
    """
    Runs the web search agent to find product ingredient information.

    Args:
        product_name (str): The name of the product to search for.

    Returns:
        WebSearchResult: The result containing a list of ingredients found in the product.
    """
    result = await Runner.run(web_search_agent, product_name)
    return result

async def run_scorer_agent(ingredients: WebSearchResult) -> ScorerResult:
    """
    Runs the scorer agent to evaluate the relevance and quality of ingredient information.

    Args:
        ingredients (WebSearchResult): The result containing a list of ingredients with their descriptions.

    Returns:
        ScorerResult: The result containing the relevance scores for each ingredient.
    """

    result = await Runner.run(scorer_agent, ingredients.model_dump_json())
    return result