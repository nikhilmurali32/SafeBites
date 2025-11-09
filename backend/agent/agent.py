import os
import logging
from agents import Agent, Runner, trace, WebSearchTool, ModelSettings, function_tool
from .models.search_models import WebSearchResult
from .models.scorer_models import ScorerResult
from .models.reccomender_models import ReccomenderResult
from .tools.db_tools import mcp_params
from agents.mcp import MCPServerStdio
from .system_prompts import instructions
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

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

reccomender_agent = Agent(
    name="ReccomenderAgent",
    instructions=instructions["RECCOMENDER_AGENT_INSTRUCTIONS"],
    model="gpt-4.1-mini",
    tools=[WebSearchTool(search_context_size="low")],
    model_settings=ModelSettings(tool_choice="required"),
    output_type=ReccomenderResult
)

async def run_web_search_agent(product_name: str) -> WebSearchResult:
    """
    Runs the web search agent to find product ingredient information.

    Args:
        product_name (str): The name of the product to search for.

    Returns:
        WebSearchResult: The result containing a list of ingredients found in the product.
    """
    logger.info(f"Running web search agent for product: {product_name}")
    
    result = await Runner.run(web_search_agent, product_name)
    
    logger.info("Web search agent completed successfully")
    
    return result.final_output

async def run_scorer_agent(ingredients: str) -> ScorerResult:
    """
    Runs the scorer agent to evaluate the relevance and quality of ingredient information.

    Args:
        ingredients (str): JSON string containing a list of ingredients with their descriptions.

    Returns:
        ScorerResult: The result containing the relevance scores for each ingredient.
    """
    logger.info("Running scorer agent to evaluate product safety")

    result = await Runner.run(scorer_agent, ingredients)
    
    logger.info("Scorer agent completed successfully")
    
    return result.final_output

async def run_reccomender_agent(product_name: str, overall_score: float) -> ReccomenderResult:
    """
    Runs the reccomender agent to suggest healthier alternatives to the product.

    Args:
        product_name (str): The name of the product.
        overall_score (float): The overall safety score of the product.

    Returns:
        ReccomenderResult: The result containing recommended healthier alternatives.
    """
    logger.info(f"Running reccomender agent for product: {product_name} with overall score: {overall_score}")

    input_data = f"product_name: {product_name}\noverall_score: {overall_score}"

    result = await Runner.run(reccomender_agent, input_data)
    
    logger.info("Reccomender agent completed successfully")
    
    return result.final_output

async def run_user_preferences_agent(preference_input: str) -> str:
    """
    Runs the user preferences agent to store or update user dietary preferences.

    Args:
        preference_input (str): The user preference input string.
    Returns:
        str: Confirmation message after storing/updating preferences.
    """
    logger.info("Running user preferences agent to update dietary preferences")
    async with MCPServerStdio(params=mcp_params) as mcp_server:
        agent = Agent(
            name="UserPreferencesAgent",
            instructions=instructions["USER_PREFERENCES_AGENT_INSTRUCTIONS"],
            model="gpt-4.1-mini",
            mcp_servers=[mcp_server]
        )
        result = await Runner.run(agent, preference_input)
    
    logger.info("User preferences agent completed successfully")
    
    return "User preferences updated successfully."