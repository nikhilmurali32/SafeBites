# HealthScan AI - Backend API Documentation (MVP)

## 📁 Project Structure

```
backend/
├── agents/
│   ├── __init__.py
│   ├── parser_agent.py         # Detect barcode OR product name
│   ├── web_search_agent.py     # Search for product details
│   └── scorer_agent.py         # Determine if product is safe
│
├── tools/
│   ├── __init__.py
│   ├── search_tools.py         # Web search functions
│   └── scoring_tools.py        # Health scoring calculations
│
├── data/
│   └── analyses.json           # Analysis history
│
├── utils/
│   ├── __init__.py
│   ├── gemini_client.py        # Gemini Vision API wrapper
│   └── db_manager.py           # JSON file operations
│
├── main.py                      # FastAPI application entry
├── config.py                    # Configuration settings
├── requirements.txt             # Python dependencies
├── .env.example                 # Environment variables template
└── README.md                    # Backend documentation
```

---

## 🔌 API Endpoints

### Base URL: `http://localhost:8000`

---

## 📍 Endpoints

### 1. Analyze Product

**Endpoint:** `POST /api/analyze`

**Description:** Upload a product image and get health analysis.

**Request:**

```http
POST /api/analyze
Content-Type: multipart/form-data

Form Data:
- image: File (required) - Product image (JPEG/PNG)
```

**Response (Safe Product):**

```json
{
  "analysis_id": "analysis_abc123",
  "timestamp": "2024-11-08T10:30:00Z",
  "product": {
    "name": "Simple Mills Crackers",
    "brand": "Simple Mills"
  },
  "ingredients": [
    {"name": "Organic Almond Flour", "safe": true, "unsafe_reason": ""},
    {"name": "Organic Sunflower Seeds", "safe": true, "unsafe_reason": ""}
  ],
  "is_safe": true,
  "status": "SAFE",
  "message": "This product is safe!"
}
```

**Response (Unsafe Product):**

```json
{
  "analysis_id": "analysis_def456",
  "timestamp": "2024-11-08T10:35:00Z",
  "product": {
    "name": "Oreos Original",
    "brand": "Nabisco"
  },
  "ingredients": [
    {"name": "High Fructose Corn Syrup", "safe": false, "unsafe_reason": "High sugar content linked to health issues"},
    {"name": "Palm Oil", "safe": false, "unsafe_reason": "High in saturated fat"},
    {"name": "Artificial Flavor", "safe": false, "unsafe_reason": "Contains artificial additives"},
    {"name": "Enriched Flour", "safe": true, "unsafe_reason": ""}
  ],
  "is_safe": false,
  "status": "UNSAFE",
  "message": "This product contains unsafe ingredients"
}
```

---

### 2. Get Analysis History

**Endpoint:** `GET /api/history`

**Description:** Retrieve all past product analyses.

**Request:**

```http
GET /api/history
```

**Response:**

```json
{
  "analyses": [
    {
      "analysis_id": "analysis_abc123",
      "timestamp": "2024-11-08T10:30:00Z",
      "product_name": "Oreos Original",
      "brand": "Nabisco",
      "is_safe": false
    },
    {
      "analysis_id": "analysis_def456",
      "timestamp": "2024-11-07T15:22:00Z",
      "product_name": "Simple Mills Crackers",
      "brand": "Simple Mills",
      "is_safe": true
    }
  ]
}
```

---

### 3. Get Single Analysis

**Endpoint:** `GET /api/analysis/{analysis_id}`

**Description:** Retrieve a specific analysis by ID.

**Request:**

```http
GET /api/analysis/analysis_abc123
```

**Response:**

```json
{
  // Same structure as POST /api/analyze response
}
```

---

## 🔄 Agent Flow

```
1. User uploads image
   ↓
2. [Gemini Vision API] Extract raw text
   ↓
3. [Parser Agent (OpenAI)] Extract product name
   Output: {"product_name": "Oreos Original"}
   ↓
4. [Web Search Agent (OpenAI)] Find product details
   Tools: search_by_name()
   Output: Ingredients with safety flags
   ↓
5. [Scorer Agent (OpenAI)] Determine overall safety
   ↓
6. Save analysis to analyses.json
   ↓
7. Return complete response
```

---

## 🛠️ Agent Specifications

### Parser Agent (OpenAI SDK)

**Input:** Raw text from Gemini Vision OCR
**Output:** `{ "product_name": "Oreos Original" }`
**Behavior:** Extracts the product name from OCR text.

---

### Web Search Agent (OpenAI SDK)

**Input:** `{ "product_name": "Oreos Original" }`
**Tools Available:** `search_by_name(product_name: str)`
**Behavior:** Uses `search_tools` to fetch ingredients and assess safety.

---

### Scorer Agent (OpenAI SDK)

**Input:** Ingredients with safety flags
**Output:** `{ "is_safe": false, "status": "UNSAFE", "message": "..." }`
**Behavior:** Marks unsafe if any ingredient is unsafe.

---

## 🛠️ Tool Functions

### search_tools.py

```python
search_by_name(product_name: str) → dict
  # Searches OpenFoodFacts or other APIs
  # Returns product name, brand, ingredients
```

### scoring_tools.py

```python
analyze_ingredient_safety(ingredient_name: str) → tuple[bool, str]
  # Returns (is_safe, reason_if_unsafe)
```

---

## 🗄️ Data Files

### analyses.json

```json
{
  "analysis_abc123": {
    "timestamp": "2024-11-08T10:30:00Z",
    "product": {"name": "Oreos Original", "brand": "Nabisco"},
    "ingredients": [
      {"name": "High Fructose Corn Syrup", "safe": false, "unsafe_reason": "High sugar content"}
    ],
    "is_safe": false,
    "status": "UNSAFE",
    "message": "This product contains unsafe ingredients"
  }
}
```

---

## ⚙️ Environment Variables

```bash
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...
PORT=8000
ENV=development
```

---

## 🚀 Running the Backend

```bash
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload --port 8000
```

Docs: [http://localhost:8000/docs]

---

## 📦 Requirements

```txt
fastapi
uvicorn[standard]
python-multipart
openai
openai-agents-sdk
google-generativeai
requests
python-dotenv
```

---

## 🔮 Future Enhancements

1. Barcode Detection (Gemini Vision)
2. Recommender Agent (Healthier Alternatives)
3. Auth0 Authentication
4. Personalized Preferences
5. Local Product/Ingredient DB
6. Batch & Nutrition Scoring
7. Cloud Deployment (GCP/AWS)
