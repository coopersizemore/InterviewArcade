### Backend Code (Python + FastAPI)
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import InterviewQuestion, FeedbackRequest, FeedbackResponse
import services
import json

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

# --- Data Loading ---
def load_questions_from_db():
    """Loads interview questions from a JSON file."""
    try:
        with open('questions.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

QUESTIONS_DB = load_questions_from_db()

# --- API Endpoints ---

@app.get("/api/questions", response_model=list[InterviewQuestion])
async def get_questions():
    """Endpoint to fetch all interview questions."""
    return QUESTIONS_DB

@app.get("/api/questions/id/{question_id}", response_model=InterviewQuestion)
async def get_question_by_id(question_id: int):
    """Endpoint to fetch a single question by its ID."""
    question = next((q for q in QUESTIONS_DB if q["id"] == question_id), None)
    if not question:
        raise HTTPException(status_code=404, detail=f"Question with id {id} doesn't exist")
    return question

@app.get("/question/companyName/{company_name}", response_model=list[InterviewQuestion])
async def get_question_by_company_name(company_name: str):
    """Endpoint for getting all the questions for a specific company"""
    questions = (q for q in QUESTIONS_DB if q["company"] == company_name)
    return questions

@app.get("/companies", response_model=list[str])
async def get_companies():
    """Endpoint to get a list of all companies"""
    companies = set()
    for q in QUESTIONS_DB:
        for company in q["companies"]:
            companies.add(company)
    return list(companies)

@app.post("/api/feedback", response_model=FeedbackResponse)
async def get_interview_feedback(request: FeedbackRequest):
    """
    Main endpoint to process the user's interview attempt.
    This will transcribe audio, evaluate code, and generate feedback.
    """
    print(f"Received feedback request for question ID: {request.question_id}")

    # 1. Transcribe the user's spoken audio (placeholder)
    transcript = await services.transcribe_audio_with_whisper(request.audio_data)

    # 2. Evaluate the user's code using an LLM
    code_evaluation = await services.evaluate_code_with_llm(request.user_code)

    # 3. Get the solution for comparison
    question = await get_question_by_id(request.question_id)
    solution = question.solution if question else "No solution found."

    # 4. Generate comprehensive feedback based on all inputs
    final_feedback = await services.generate_final_feedback(
        transcript=transcript,
        user_code=request.user_code,
        code_evaluation=code_evaluation,
        solution_code=solution
    )

    # 5. Convert the feedback text to speech (placeholder)
    feedback_audio_url = await services.convert_text_to_speech_elevenlabs(final_feedback["report_text"])

    return FeedbackResponse(
        scores=final_feedback["scores"],
        report_text=final_feedback["report_text"],
        suggestions=final_feedback["suggestions"],
        feedback_audio_url=feedback_audio_url
    )