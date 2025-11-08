# HealthScan AI Backend

A FastAPI-based backend service that analyzes product images to determine health safety using AI agents.

## Quick Start

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Run the server:**
   ```bash
   uvicorn main:app --reload --port 8000
   ```

4. **View API docs:**
   Open http://localhost:8000/docs

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key
- `GEMINI_API_KEY`: Your Google Gemini API key  
- `PORT`: Server port (default: 8000)
- `ENV`: Environment (development/production)
- `CORS_ORIGINS`: Allowed CORS origins (comma-separated)

## API Endpoints

- `POST /api/analyze` - Analyze product image
- `GET /api/history` - Get analysis history
- `GET /api/analysis/{id}` - Get specific analysis