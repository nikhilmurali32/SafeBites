# SafeBites - AI-Powered Food Safety Analyzer

<div align="center">
  
![WhatsApp Image 2025-11-09 at 04 36 54_caa1fe8e](https://github.com/user-attachments/assets/3b257410-d82c-4dbc-9def-072631d58740)


**A comprehensive AI-powered application that helps users make healthier food choices by analyzing product labels, checking for unsafe ingredients, and recommending safer alternatives.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.11-blue)](https://www.python.org/)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Contributing](#contributing)

## 🎯 Overview

SafeBites is a full-stack application that combines modern web technologies with AI agents to provide intelligent food safety analysis. Users can scan product labels using their camera, and the system uses OCR, AI agents, and databases to analyze ingredients, check for allergens, and recommend safer alternatives.

### Key Capabilities

- 📸 **Image Scanning**: Upload or capture photos of product labels
- 🔍 **OCR Processing**: Extract text from product images using Google Gemini
- 🤖 **AI Agent System**: Multi-agent architecture for retrieval, scoring, and recommendation
- 🗄️ **Database Integration**: Product catalog and user preference databases
- 🔐 **Secure Authentication**: Auth0 integration for user management
- 📊 **Personalized Analysis**: Customized recommendations based on user allergies and preferences

## 🏗️ System Architecture

The SafeBites system follows a sophisticated multi-agent architecture that processes product images through several stages:

![Backend Architecture Diagram](docs/images/backend-architecture.png)

*Note: Please add the architecture diagram image to `docs/images/backend-architecture.png`*

### Architecture Flow

#### 1. **User Input & Authentication**
- User authenticates via **Auth0**
- User provides a **photo** of a product label

  <img width="1440" height="900" alt="login" src="https://github.com/user-attachments/assets/02ad7f5c-a15e-4197-828b-bf6a9d26f3c0" />

  <img width="1440" height="900" alt="dashboard" src="https://github.com/user-attachments/assets/132f923d-172e-46b2-99b7-cbc978fdfb3d" />


#### 2. **Optical Character Recognition (OCR)**
- Photo is processed by **OCR (Gemini)** to extract text and ingredient lists
- Extracted text is passed to the agent system

  <img width="1440" height="900" alt="prod-scan" src="https://github.com/user-attachments/assets/7e1d600e-94c9-4b1a-ac44-e04fe10cde0f" />


#### 3. **Data Retrieval & Enrichment**
- **Retriever Agent (ADK)** receives the extracted ingredient data
- Queries **Products DB** to find product information and ingredient details
- Queries **User DB** to fetch user preferences, allergies, and dietary restrictions
- If product is not in catalog, **Web Search Agent (ADK)** performs web searches
- Web Search Agent returns ingredient descriptions to Retriever Agent
- Retriever Agent outputs enriched ingredient descriptions to Scorer Agent

#### 4. **Scoring & Recommendation Loop**
- **Scorer Agent (ADK)** receives ingredient descriptions
- Enters iterative loop with **Recommender Agent (ADK)** (runs x times):
  - Scorer Agent sends feedback to Recommender Agent
  - Recommender Agent sends recommended items back to Scorer Agent
  - Process refines recommendations based on safety scores
    
  ![scan res](https://github.com/user-attachments/assets/93f2a9cf-5aae-434b-a6c9-a7bce109bf42)
  
  ![scan res -2](https://github.com/user-attachments/assets/25ad6385-c51e-4ebd-b5e7-e19b7de79023)

#### 5. **Final Output**
- **Scorer Agent** outputs final result:
  - Recommended products (safer alternatives)
  - Queried product (if safe)
  - Safety scores and detailed analysis

### Technology Components

- **Auth0**: Identity and access management
- **Google Gemini**: OCR and text extraction
- **OpenAI Agents (ADK)**: Multi-agent system for analysis
- **Products Database**: Product catalog and ingredient information
- **User Database**: User preferences, allergies, and scan history

## ✨ Features

### Frontend Features

#### 🔐 Authentication & Onboarding
- Secure Auth0 authentication
- Multi-step onboarding flow:
  - Allergy selection (10+ common allergens)
  - Diet goals (vegan, keto, paleo, etc.)
  - Custom ingredient preferences
- User profile management

#### 📱 Dashboard
- Personalized welcome interface
- Recent scans carousel with safety badges
- Safety overview charts (Safe vs Risky items)
- Quick scan access with floating action button
- Real-time statistics

#### 📸 Camera Scanner
- Real-time webcam access
- File upload alternative
- Visual scanning frame with animations
- Photo preview before analysis

#### 📊 Scan Results
- Animated safety score dial (0-100)
- Color-coded ingredient analysis:
  - 🟢 Safe ingredients
  - 🟡 Moderate risk
  - 🔴 Risky ingredients
- Better alternatives carousel
- Detailed ingredient explanations
- Dynamic background based on safety score

#### 🌐 Additional Features
- Food Universe visualization
- Ingredient network explorer
- User statistics modal
- Responsive design for all devices

### Backend Features

#### 🤖 AI Agent System
- **Retriever Agent**: Fetches product and ingredient data
- **Web Search Agent**: Performs web searches for unknown products
- **Scorer Agent**: Calculates safety scores based on user preferences
- **Recommender Agent**: Suggests safer alternatives

#### 🗄️ Database Management
- Product catalog database
- User database with preferences and scan history
- JSON-based storage with utility functions

#### 🔌 API Endpoints
- `/api/analyze` - Analyze product images
- `/api/history` - Get analysis history
- `/api/analysis/{id}` - Get specific analysis

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Authentication**: [Auth0](https://auth0.com/)
- **Visualization**: [D3.js](https://d3js.org/) (d3-force)

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Language**: Python 3.11+
- **AI/ML**:
  - [OpenAI Agents SDK](https://github.com/openai/agents) (ADK)
  - [Google Gemini API](https://ai.google.dev/) (OCR)
- **Server**: [Uvicorn](https://www.uvicorn.org/)
- **Data Validation**: [Pydantic](https://docs.pydantic.dev/)

### Infrastructure
- **Database**: JSON-based storage (can be migrated to PostgreSQL/MongoDB)
- **Environment**: Python dotenv for configuration
- **CORS**: FastAPI CORS middleware

## 📁 Project Structure

```
Front-end/
├── frontend/                 # Next.js frontend application
│   ├── app/                  # Next.js App Router
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # Auth0 authentication
│   │   │   └── user/         # User management endpoints
│   │   ├── dashboard/        # Dashboard page
│   │   ├── login/            # Login page
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page
│   │   └── globals.css       # Global styles
│   ├── components/           # React components
│   │   ├── dashboard/        # Dashboard components
│   │   ├── onboarding/      # Onboarding flow components
│   │   ├── scan-result/     # Scan result components
│   │   ├── food-universe/    # Food universe visualization
│   │   ├── ingredient-explorer/ # Ingredient network
│   │   └── ...
│   ├── lib/                  # Utility libraries
│   │   ├── backendApi.ts     # Backend API client
│   │   ├── userDatabase.ts  # User database utilities
│   │   └── db/              # Database files
│   ├── public/              # Static assets
│   ├── types/               # TypeScript type definitions
│   ├── package.json         # Frontend dependencies
│   └── README.md           # Frontend-specific README
│
├── backend/                 # FastAPI backend application
│   ├── agent/               # AI agent implementations
│   │   ├── agent.py         # Main agent orchestrator
│   │   ├── models/          # Agent output models
│   │   │   ├── search_models.py
│   │   │   ├── scorer_models.py
│   │   │   └── reccomender_models.py
│   │   ├── system_prompts.py # Agent instructions
│   │   └── tools/           # Agent tools
│   │       └── db_tools.py  # Database tools
│   ├── utils/               # Utility modules
│   │   ├── database.py      # Database utilities
│   │   └── gemini_client.py # Gemini API client
│   ├── data/                # Data storage
│   │   ├── scans.json       # Scan history
│   │   └── users.json       # User data
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration settings
│   ├── requirements.txt     # Python dependencies
│   └── README.md           # Backend-specific README
│
├── docs/                    # Documentation
│   └── images/             # Documentation images
│       └── backend-architecture.png
│
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.11+
- **Auth0 Account** (for authentication)
- **OpenAI API Key** (for AI agents)
- **Google Gemini API Key** (for OCR)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/nikhilmurali32/SafeBites.git
cd SafeBites/Front-end
```

#### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file:

```env
AUTH0_SECRET='your-auth0-secret'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://your-tenant.auth0.com'
AUTH0_CLIENT_ID='your-client-id'
AUTH0_CLIENT_SECRET='your-client-secret'
NEXT_PUBLIC_BACKEND_URL='http://localhost:8000'
```

#### 3. Backend Setup

```bash
cd ../backend
pip install -r requirements.txt
```

Create a `.env` file:

```env
OPEN_AI_API_KEY=your-openai-api-key
GEMINI_API_KEY=your-gemini-api-key
PORT=8000
ENV=development
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Running the Application

#### Start the Backend Server

```bash
cd backend
uvicorn main:app --reload --port 8000
```

The backend API will be available at `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/`

#### Start the Frontend Server

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Quick Start Guide

For detailed setup instructions, see:
- Frontend: [frontend/QUICK_START.md](frontend/QUICK_START.md)
- Auth0 Setup: [frontend/AUTH0_SETUP.md](frontend/AUTH0_SETUP.md)

## 📡 API Documentation

### Backend API Endpoints

#### Health Check
```
GET /
```
Returns server status and health information.

#### Analyze Product
```
POST /api/analyze
Content-Type: multipart/form-data

Parameters:
- image: File (required) - Product image file
- user_id: string (optional) - User ID for personalized analysis
```

**Response:**
```json
{
  "analysis_id": "uuid",
  "product_name": "Product Name",
  "safety_score": 85,
  "ingredients": [
    {
      "name": "Ingredient Name",
      "status": "safe|moderate|risky",
      "reason": "Explanation"
    }
  ],
  "recommendations": [
    {
      "product_name": "Alternative Product",
      "safety_score": 92,
      "improvement": 7
    }
  ]
}
```

#### Get Analysis History
```
GET /api/history?user_id={user_id}&limit={limit}
```

#### Get Specific Analysis
```
GET /api/analysis/{analysis_id}
```

### Frontend API Routes

#### User Management
- `GET /api/user` - Get current user profile
- `POST /api/user/preferences` - Save user preferences
- `GET /api/user/scans` - Get user scan history
- `POST /api/user/scans` - Save new scan
- `GET /api/user/stats` - Get user statistics

#### Authentication
- `GET /api/auth/[auth0]/login` - Initiate login
- `GET /api/auth/[auth0]/logout` - Logout
- `GET /api/auth/[auth0]/callback` - Auth0 callback

## 🧪 Development

### Frontend Development

```bash
cd frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Backend Development

```bash
cd backend
uvicorn main:app --reload --port 8000  # Development with auto-reload
```

### Code Structure Guidelines

- **Frontend**: Follow Next.js App Router conventions
- **Components**: Keep components modular and reusable
- **TypeScript**: Maintain strict type safety
- **Styling**: Use TailwindCSS utility classes
- **Animations**: Use Framer Motion for all animations

### Environment Variables

See `.env.example` files in respective directories for required environment variables.


## 🔮 Future Enhancements

- [ ] Real-time barcode scanning
- [ ] Integration with product databases (Open Food Facts, USDA)
- [ ] Machine learning model for ingredient classification
- [ ] Social sharing features
- [ ] Export reports as PDF
- [ ] Push notifications for product recalls
- [ ] Shopping list integration
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Recipe recommendations based on safe ingredients

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

Private project - All rights reserved

## 🙏 Acknowledgments

- OpenAI for the Agents SDK
- Google for Gemini API
- Auth0 for authentication services
- The open-source community for amazing tools and libraries

---

<div align="center">

**Made with ❤️ for healthier food choices**

[Report Bug](https://github.com/nikhilmurali32/SafeBites/issues) · [Request Feature](https://github.com/nikhilmurali32/SafeBites/issues)

</div>

