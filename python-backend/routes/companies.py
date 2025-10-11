from fastapi import APIRouter
from models import FeedbackRequest, FeedbackResponse
import services
from questions import get_question_by_id

router = APIRouter()

@router.get("/companies", response_model=list[str])
async def get_companies():
    """Endpoint to get a list of all companies"""
    companies = set()
    for q in QUESTIONS_DB:
        for company in q["companies"]:
            companies.add(company)
    return list(companies)