from fastapi import APIRouter
from services.questions_service import load_questions_from_file
from models import Company

router = APIRouter(prefix="/api/companies", tags=["companies"])

@router.get("/", response_model=list[Company])
async def get_companies():
    """Endpoint to get a list of all companies"""
    companies = set()
    for q in load_questions_from_file():
        for company in q["companies"]:
            companies.add(company)
    rtn = []
    companies = list(companies)
    for i in range(len(companies)):
        rtn.append(Company(
            id=i,
            name=companies[i],
            description=""
        ))
    return list(companies)
