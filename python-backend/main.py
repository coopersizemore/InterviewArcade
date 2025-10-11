### Backend Code (Python + FastAPI)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Run with uvicorn main:app --reload
app = FastAPI()

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
from questions import router as questions_router
from feedback import router as feedback_router
from companies import router as companies_router

app.include_router(questions_router)
app.include_router(feedback_router)
app.include_router(companies_router)