# Implementation Plan

- [ ] 1. Set up project structure and dependencies
  - Create backend directory structure with agents/, tools/, utils/, data/ folders
  - Create requirements.txt with FastAPI, OpenAI Agents SDK, Gemini API, and other dependencies
  - Create .env.example file with required environment variables
  - Create config.py for application settings
  - _Requirements: 3.1, 5.4_

- [ ] 2. Implement Gemini Vision client
  - [ ] 2.1 Create GeminiVisionClient class in utils/gemini_client.py
    - Implement initialization with API key
    - Create extract_product_name method to process uploaded images
    - Handle image bytes input and return product name string
    - _Requirements: 1.1_

- [ ] 3. Implement OpenAI Agents SDK tools
  - [x] 3.1 Create WebSearchTool in tools/search_tools.py
    - Implement Tool class inheritance from OpenAI Agents SDK
    - Create search_by_name method for product information lookup
    - Add get_product_ingredients method for ingredient extraction
    - _Requirements: 1.3, 4.1_

  - [ ] 3.2 Create IngredientSafetyTool in tools/scoring_tools.py
    - Implement Tool class inheritance from OpenAI Agents SDK
    - Create analyze_ingredient_safety method for individual ingredient assessment
    - Add calculate_overall_safety method for product-level safety determination
    - _Requirements: 4.1, 4.2, 4.3_

- [ ] 4. Implement OpenAI Agents
  - [ ] 4.1 Create Web Search Agent in agents/web_search_agent.py
    - Initialize Agent with search instructions and WebSearchTool
    - Configure model settings with tool_choice="required"
    - Create function to execute product search and return structured results
    - _Requirements: 1.3, 4.1_

  - [ ] 4.2 Create Scorer Agent in agents/scorer_agent.py
    - Initialize Agent with health scoring instructions and IngredientSafetyTool
    - Configure model settings for safety assessment
    - Create function to process ingredients and return safety evaluation
    - _Requirements: 4.2, 4.3, 4.4_

- [ ] 5. Implement data persistence
  - [ ] 5.1 Create JSONDBManager in utils/db_manager.py
    - Implement save_analysis method to store analysis records
    - Create get_analysis method to retrieve specific analysis by ID
    - Add get_all_analyses method for history retrieval
    - Implement generate_analysis_id method for unique ID creation
    - _Requirements: 3.1, 3.2, 3.3_

- [ ] 6. Create Pydantic data models
  - [ ] 6.1 Define data models in main.py or separate models file
    - Create Ingredient model with name, safe flag, and unsafe_reason
    - Create Product model with name and optional brand
    - Create AnalysisResponse model for complete analysis structure
    - Create HistoryItem model for analysis history listing
    - _Requirements: 2.2, 3.3_

- [ ] 7. Implement FastAPI application
  - [ ] 7.1 Create main FastAPI app in main.py
    - Initialize FastAPI application with basic configuration
    - Set up CORS middleware for frontend integration
    - Create startup event to initialize agents and clients
    - _Requirements: 5.5_

  - [ ] 7.2 Implement POST /api/analyze endpoint
    - Handle multipart/form-data image upload
    - Orchestrate agent pipeline: Gemini → Web Search → Scorer
    - Save analysis results using JSONDBManager
    - Return complete AnalysisResponse with all required fields
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [ ] 7.3 Implement GET /api/history endpoint
    - Retrieve all analysis records from JSONDBManager
    - Return formatted history list with HistoryItem structure
    - _Requirements: 2.1, 2.2_

  - [ ] 7.4 Implement GET /api/analysis/{analysis_id} endpoint
    - Retrieve specific analysis by ID from JSONDBManager
    - Return complete analysis details or 404 if not found
    - _Requirements: 2.3, 2.4_

- [ ] 8. Create application entry point and configuration
  - [ ] 8.1 Set up environment configuration
    - Load environment variables for API keys
    - Configure application settings and CORS origins
    - _Requirements: 5.4_

  - [ ] 8.2 Create development startup script
    - Add uvicorn server configuration for development
    - Create simple startup instructions in README
    - _Requirements: 5.1_