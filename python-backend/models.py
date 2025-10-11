from pydantic import BaseModel
from typing import List, Optional, Dict

class InterviewQuestion(BaseModel):
    """
    Stores information about the interview questions
    This is based on the format from questions.json
    """
    id: int
    title: str
    difficulty: str
    category: str
    description: str
    examples: List[Dict[str, str]]
    constraints: List[str]
    starterCode: Dict[str, str]
    hints: List[str]
    companies: Optional[List[str]] = []