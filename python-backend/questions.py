from fastapi import APIRouter, HTTPException
from models import InterviewQuestion
import json

router = APIRouter()

def load_questions_from_db():
    """Loads interview questions from a JSON file."""
    try:
        with open('questions.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

QUESTIONS_DB = load_questions_from_db()

@router.get("/api/questions", response_model=list[InterviewQuestion])
async def get_questions():
    """Endpoint to fetch all interview questions."""
    return QUESTIONS_DB

@router.get("/api/questions/id/{question_id}", response_model=InterviewQuestion)
async def get_question_by_id(question_id: int):
    """Endpoint to fetch a single question by its ID."""
    question = next((q for q in QUESTIONS_DB if q["id"] == question_id), None)
    if not question:
        raise HTTPException(status_code=404, detail=f"Question with id {question_id} doesn't exist")
    return question

@router.get("/question/companyName/{company_name}", response_model=list[InterviewQuestion])
async def get_question_by_company_name(company_name: str):
    """Endpoint for getting all the questions for a specific company"""
    questions = [q for q in QUESTIONS_DB if q["company"] == company_name]
    return questions

@router.get("/companies", response_model=list[str])
async def get_companies():
    """Endpoint to get a list of all companies"""
    companies = set()
    for q in QUESTIONS_DB:
        for company in q["companies"]:
            companies.add(company)
    return list(companies)