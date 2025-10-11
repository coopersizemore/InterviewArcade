from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class InterviewQuestion(BaseModel):
    """
    Stores information about the interview questions
    This is based on the format from questions.json
    """
    id: int
    title: str
    difficulty: str
    categories: List[str]
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


class Review(BaseModel):
    """A structured review for either code or audio."""
    score: Optional[int] = 0  # Integer score out of 10
    strengths_list: Optional[List[str]] = []  # Concise list of strengths
    strengths_description: Optional[str] = ""  # Description of strengths
    improvements_list: Optional[List[str]] = []  # Concise list of improvements
    improvement_description: Optional[str] = ""  # Description of improvements


class FeedbackResponse(BaseModel):
    """
    Structured feedback response containing separate reviews for code and audio.
    """
    code_review: Review  # the review of the interviwee's code
    audio_review: Review  # the review of the interviewee's audio walkthrough
    overall_assessment: str  # an overall assessment of the interviewee's performance, as a transcript


class FeedbackRequest(BaseModel):
    """
    Stores information about the feedback request
    """
    code: str  # the code the interviewee submitted for the problem
    question: str  # the question the interviewee is answering
    audio_filepath: str  # the filepath to the audio of the interviewee's walkthrough


class TTSRequest(BaseModel):
    """
    Stores information about a text-to-speech request
    """
    transcript: str  # The transcript of the interviewee's walkthrough


class TTSResponse(BaseModel):
    """
    Returns the text-to-speech audio file produced by an external TTS provider
    """
    audio_filepath: str  # The audio transcript of the LLM evaluation