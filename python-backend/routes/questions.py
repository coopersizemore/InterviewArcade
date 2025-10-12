from fastapi import APIRouter, HTTPException
from models import InterviewQuestion
import services.questions_service as qs
import random

router = APIRouter(prefix="/api/questions", tags=["questions"])

QUESTIONS = qs.load_questions_from_file()

@router.get("/", response_model=list[InterviewQuestion])
async def get_questions():
    """Endpoint to fetch all interview questions."""
    if not QUESTIONS:
        raise HTTPException(status_code=404, detail="No questions available")
    return QUESTIONS

@router.get("/random", response_model=InterviewQuestion)
async def get_random_question():
    """Endpoint to fetch a random interview question."""
    if not QUESTIONS:
        raise HTTPException(status_code=404, detail="No questions available")
    return random.choice(QUESTIONS)

@router.get("/id/{question_id}", response_model=InterviewQuestion)
async def get_question_by_id(question_id: int):
    """Endpoint to fetch a single question by its ID."""
    question = next((q for q in QUESTIONS if q["id"] == question_id), None)
    if not question:
        raise HTTPException(status_code=404, detail=f"Question with id {question_id} doesn't exist")
    return question

@router.get("/companyName/{company_name}", response_model=InterviewQuestion)
async def get_question_by_company_name(company_name: str):
    """Endpoint for getting a random question from a specific company"""
    questions = [q for q in QUESTIONS if company_name in q.get("companies", [])]
    return random.choice(questions)


@router.get("/categoryName/{category_name}", response_model=InterviewQuestion)
async def get_question_by_category_name(category_name: str):
    """Endpoint for getting a random question from a specific category"""
    questions = [q for q in QUESTIONS if category_name in q.get("categories", [])]
    return random.choice(questions)
