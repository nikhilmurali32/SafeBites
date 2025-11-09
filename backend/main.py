"""
SafeBites AI Backend - FastAPI Application
"""
import logging
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException, status
from utils import gemini_client
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
async def analyze_product(image: UploadFile = File(...)):
    """Analyze product image and return enriched product data.."""
    logger.info("API REQUEST - /api/analyze - Starting product analysis")
    
    image_bytes = await image.read()

    if not image_bytes:
        logger.error("No image bytes provided")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image bytes payload is required.",
        )

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
        scoring_result = await agent.run_scorer_agent(web_search_result.model_dump_json())
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

@app.get("/api/history")
async def get_history():
    """Get analysis history - TODO: Implement in task 7.3"""
    return {"message": "History endpoint - coming soon!"}

@app.get("/api/analysis/{analysis_id}")
async def get_analysis(analysis_id: str):
    """Get specific analysis - TODO: Implement in task 7.4"""
    return {"message": f"Analysis {analysis_id} endpoint - coming soon!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=settings.port)