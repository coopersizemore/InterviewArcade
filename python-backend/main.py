### Backend Code (Python + FastAPI)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# OpenAPI/Docs metadata
tags_metadata = [
    {"name": "questions", "description": "Browse and retrieve interview questions."},
    {"name": "companies", "description": "List companies and filter questions by company."},
    {"name": "feedback", "description": "Submit interview attempts and get AI-generated feedback."},
]

# Run with: uvicorn main:app --reload
app = FastAPI(
    title="Mockly.ai Backend",
    version="0.1.0",
    description="FastAPI backend for interview questions and AI feedback.",
    openapi_tags=tags_metadata,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS to allow the React frontend to communicate with this backend
origins = [
    "http://localhost:3000", # Default React dev server port
    "http://localhost:5173", # Default Vite dev server port
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Include Routers ---
from routes.questions import router as questions_router
from routes.feedback import router as feedback_router
from routes.companies import router as companies_router

@app.get("/live", tags=["health"])
async def live_check():
    return {"status": "alive"}

@app.get("/ready", tags=["health"])
async def readiness_check():
    return {"status": "ready"}

app.include_router(questions_router)
app.include_router(feedback_router)
app.include_router(companies_router)
