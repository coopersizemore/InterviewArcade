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


class Company(BaseModel):
    """
    Stores information about a company
    """
    id: int
    name: str
    description: Optional[str] = ""


class FeedbackResponse(BaseModel):
    """
    Stores information about a feedback response from the LLM
    This is incomplete, edit for specific use case
    """
    scoring: str
    feedback: str
    transcript: str


class FeedbackRequest(BaseModel):
    """
    Stores information about the feedback request
    This doesn't include 
    """
    code: str
    question: str
    audio_filepath: str


class TTSRequest(BaseModel):
    """
    Stores information aboyt a text-to-speech request
    """
    transcript: str


class TTSResponse(BaseModel):
    """
    Returns the text-to-speech audio file produced by eleven labs
    """
    audio_filepath: str