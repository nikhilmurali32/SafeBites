# Requirements Document

## Introduction

HealthScan AI Backend is a FastAPI-based system that analyzes product images to determine health safety. The system uses multiple AI agents (Gemini Vision for OCR, OpenAI agents for web search, and scoring) to extract product information, find ingredient details, and provide safety assessments. The backend provides REST API endpoints for product analysis and maintains analysis history.

## Glossary

- **HealthScan_Backend**: The FastAPI application that orchestrates product health analysis
- **Web_Search_Agent**: OpenAI-powered agent that searches for product details and ingredients
- **Scorer_Agent**: OpenAI-powered agent that determines overall product safety based on ingredients
- **Gemini_Vision_API**: Google's vision API used for OCR text extraction from product images
- **Analysis_Record**: A complete product analysis including ingredients, safety assessment, and metadata
- **Product_Image**: User-uploaded image file (JPEG/PNG) containing product information

## Requirements

### Requirement 1

**User Story:** As a mobile app user, I want to upload a product image and receive a health safety analysis, so that I can make informed purchasing decisions.

#### Acceptance Criteria

1. WHEN a user uploads a product image via POST /api/analyze, THE HealthScan_Backend SHALL extract the product name using Gemini_Vision_API
2. WHEN product name is extracted, THE HealthScan_Backend SHALL invoke Web_Search_Agent to find ingredient details
3. WHEN ingredient details are found, THE HealthScan_Backend SHALL invoke Scorer_Agent to determine overall safety
4. WHEN analysis is complete, THE HealthScan_Backend SHALL return a JSON response containing product details, ingredients with safety flags, and overall safety assessment

### Requirement 2

**User Story:** As a mobile app user, I want to view my analysis history, so that I can reference previous product evaluations.

#### Acceptance Criteria

1. WHEN a user requests GET /api/history, THE HealthScan_Backend SHALL return all stored Analysis_Records in chronological order
2. THE HealthScan_Backend SHALL include analysis_id, timestamp, product_name, brand, and is_safe status for each record
3. WHEN a user requests GET /api/analysis/{analysis_id}, THE HealthScan_Backend SHALL return the complete Analysis_Record for the specified ID
4. IF the analysis_id does not exist, THEN THE HealthScan_Backend SHALL return a 404 error response

### Requirement 3

**User Story:** As a system administrator, I want the backend to persist analysis data, so that user history is maintained across sessions.

#### Acceptance Criteria

1. WHEN an analysis is completed, THE HealthScan_Backend SHALL store the Analysis_Record in analyses.json file
2. THE HealthScan_Backend SHALL generate unique analysis_id values for each Analysis_Record
3. THE HealthScan_Backend SHALL include timestamp, product details, ingredients with safety assessments, and overall safety determination in each Analysis_Record
4. WHEN the system starts, THE HealthScan_Backend SHALL load existing Analysis_Records from analyses.json file

### Requirement 4

**User Story:** As a developer, I want the system to handle ingredient safety assessment, so that users receive accurate health evaluations.

#### Acceptance Criteria

1. WHEN Web_Search_Agent processes ingredients, THE HealthScan_Backend SHALL assess each ingredient for safety using scoring tools
2. THE HealthScan_Backend SHALL mark ingredients as safe or unsafe with specific reasons for unsafe classifications
3. WHEN Scorer_Agent evaluates overall safety, THE HealthScan_Backend SHALL mark products as unsafe if any ingredient is unsafe
4. THE HealthScan_Backend SHALL provide clear safety messages and status indicators in analysis responses

### Requirement 5

**User Story:** As a system integrator, I want the backend to provide proper API documentation and error handling, so that frontend integration is straightforward.

#### Acceptance Criteria

1. THE HealthScan_Backend SHALL provide OpenAPI documentation at /docs endpoint
2. WHEN API errors occur, THE HealthScan_Backend SHALL return appropriate HTTP status codes with descriptive error messages
3. THE HealthScan_Backend SHALL validate uploaded images for supported formats (JPEG/PNG)
4. THE HealthScan_Backend SHALL handle multipart/form-data requests for image uploads
5. THE HealthScan_Backend SHALL support CORS for frontend integration