"""
Configuration settings for HealthScan AI Backend
"""
import os
from typing import List
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings(BaseModel):
    """Application settings loaded from environment variables"""
    
    # API Keys
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    
    # Server Configuration
    port: int = int(os.getenv("PORT", "8000"))
    environment: str = os.getenv("ENV", "development")
    
    # CORS Configuration
    cors_origins: List[str] = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
    
    # Data Storage
    data_dir: str = "data"
    analyses_file: str = "data/analyses.json"
    
    class Config:
        env_file = ".env"

# Global settings instance
settings = Settings()