"""
HealthScan AI Backend - FastAPI Application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings

# Initialize FastAPI app
app = FastAPI(
    title="HealthScan AI Backend",
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
    return {"message": "HealthScan AI Backend is running!", "status": "healthy"}

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "environment": settings.environment,
        "port": settings.port
    }

# Placeholder endpoints (will be implemented in later tasks)
@app.post("/api/analyze")
async def analyze_product():
    """Analyze product image - TODO: Implement in task 7.2"""
    return {"message": "Product analysis endpoint - coming soon!"}

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