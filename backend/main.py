"""
SafeBites AI Backend - FastAPI Application
"""
import logging
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException, status
from pydantic import BaseModel
from typing import Optional, List
from utils import gemini_client
from utils import database
from agent import agent
from config import settings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="SafeBites AI Backend",
    description="AI-powered product health analysis API",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "SafeBites AI Backend is running!", "status": "healthy"}



# Placeholder endpoints (will be implemented in later tasks)
@app.post("/api/analyze")
async def analyze_product(
    image: UploadFile = File(...),
    user_id: Optional[str] = Form(None)
):
    """Analyze product image and return enriched product data.
    
    Args:
        image: Product image file
        user_id: Optional user ID to fetch user preferences for personalized analysis
    """
    logger.info(f"API REQUEST - /api/analyze - Starting product analysis (user_id: {user_id})")
    
    image_bytes = await image.read()

    if not image_bytes:
        logger.error("No image bytes provided")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image bytes payload is required.",
        )

    # Fetch user preferences if user_id is provided
    user_preferences = None
    if user_id:
        try:
            user = database.get_user(user_id)
            if user:
                user_preferences = {
                    "allergies": user.get("allergies", []),
                    "dietGoals": user.get("dietGoals", []),
                    "avoidIngredients": user.get("avoidIngredients", []),
                }
                logger.info(f"User preferences loaded for user {user_id}: {user_preferences}")
        except Exception as exc:
            logger.warning(f"Failed to fetch user preferences: {exc}")
            # Continue without preferences if fetch fails

    try:
        product_name =  await gemini_client.extract_product_name(image_bytes)
    except Exception as exc:
        logger.error(f"Failed to extract product name: {type(exc).__name__} at line {exc.__traceback__.tb_lineno} of {__file__}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Failed to extract product information from image.",
        ) from exc

    if not product_name:
        logger.warning("No recognizable product found in the provided image.")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="No recognizable product found in the provided image.",
        )

    try:
        web_search_result = await agent.run_web_search_agent(product_name)
    except Exception as exc:
        logger.error(f"Web search agent failed: {type(exc).__name__} at line {exc.__traceback__.tb_lineno} of {__file__}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Failed to retrieve external product data.",
        ) from exc
    
    # web search agent calls scorer agent internally now
    try:
        scoring_result = await agent.run_scorer_agent(
            web_search_result.model_dump_json(),
            user_preferences=user_preferences
        )
    except Exception as exc:
        logger.error(f"Scorer agent failed: {type(exc).__name__} at line {exc.__traceback__.tb_lineno} of {__file__}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Failed to retrieve scoring data.",
        ) from exc
    
    # add extracted data to response
    scoring_result = scoring_result.model_dump_json()

    logger.info("API REQUEST - /api/analyze - Analysis completed successfully")

    return {
        "status": "success",
        "product_name": product_name,
        "scoring_data": scoring_result,
    }

@app.get("/api/reccomendations/{product_name}/{overall_score}")
async def reccomended_alternatives(product_name: str, overall_score: float):
    """Get reccomended alternatives for a product based on its overall score."""
    logger.info(f"API REQUEST - /api/reccomended_alternatives - Getting alternatives for {product_name} with score {overall_score}")
    
    try:
        reccomender_result = await agent.run_reccomender_agent(product_name, overall_score)
    except Exception as exc:
        logger.error(f"Reccomender agent failed: {type(exc).__name__} at line {exc.__traceback__.tb_lineno} of {__file__}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Failed to retrieve reccomender data.",
        ) from exc

    logger.info("API REQUEST - /api/reccomended_alternatives - Alternatives retrieved successfully")

    return {
        "status": "success",
        "reccomender_data": reccomender_result.model_dump_json(),
    }

@app.post("/api/preferences")
async def update_preferences(preference_input: str):
    try:
        result = await agent.run_user_preferences_agent(preference_input)
    except Exception as exc:
        logger.error(f"User preferences agent failed: {type(exc).__name__} at line {exc.__traceback__.tb_lineno} of {__file__}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Failed to update user preferences.",
        ) from exc

    return {
        "status": "success",
        "message": result
    }


# User endpoints
class UserCreate(BaseModel):
    id: str
    email: str
    name: str
    picture: Optional[str] = None
    allergies: Optional[List[str]] = None
    dietGoals: Optional[List[str]] = None
    avoidIngredients: Optional[List[str]] = None


@app.get("/api/users/{user_id}")
async def get_user(user_id: str):
    """Get user by ID"""
    user = database.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"user": user}


@app.post("/api/users")
async def create_or_update_user(user_data: UserCreate):
    """Create or update user"""
    user = database.create_or_update_user(user_data.dict())
    return {"user": user}


class UserPreferences(BaseModel):
    allergies: Optional[List[str]] = None
    dietGoals: Optional[List[str]] = None
    avoidIngredients: Optional[List[str]] = None

@app.post("/api/users/{user_id}/preferences")
async def update_user_preferences(user_id: str, preferences: UserPreferences):
    """Update user preferences"""
    # Convert Pydantic model to dict
    preferences_dict = preferences.dict(exclude_none=True)
    user = database.update_user_preferences(user_id, preferences_dict)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    logger.info(f"User preferences updated for {user_id}: {preferences_dict}")
    return {"user": user}


# Scan endpoints
class ScanCreate(BaseModel):
    productName: str
    brand: Optional[str] = ""
    image: str
    safetyScore: int
    isSafe: bool
    ingredients: List[dict]
    id: Optional[str] = None
    timestamp: Optional[str] = None


@app.get("/api/users/{user_id}/scans")
async def get_user_scans(user_id: str, limit: Optional[int] = None):
    """Get scans for a user"""
    scans = database.get_user_scans(user_id, limit)
    return {"scans": scans}


@app.post("/api/users/{user_id}/scans")
async def add_user_scan(user_id: str, scan_data: ScanCreate):
    """Add a scan for a user"""
    scan = database.add_user_scan(user_id, scan_data.dict())
    return {"scan": scan, "status": "success"}


# Stats endpoint
@app.get("/api/users/{user_id}/stats")
async def get_user_stats(user_id: str):
    """Get statistics for a user"""
    stats = database.get_user_stats(user_id)
    if stats is None:
        raise HTTPException(status_code=404, detail="User not found")
    return {"stats": stats}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=settings.port)