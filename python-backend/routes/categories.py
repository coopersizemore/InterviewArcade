from fastapi import APIRouter
from services.questions_service import load_questions_from_file
from models import Category

router = APIRouter(prefix="/api/categories", tags=["categories"])

@router.get("/", response_model=list[Category])
async def get_categories():
    """Endpoint to get a list of all categories represented by the problems"""
    categories = set()
    for q in load_questions_from_file():
        for category in q["categories"]:
            categories.add(category)
    rtn = []
    categories = list(categories)
    for i in range(len(categories)):
        rtn.append(Category(
            id=i,
            name=categories[i]
        ))

    return rtn
