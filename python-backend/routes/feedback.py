from fastapi import APIRouter, HTTPException
from models import FeedbackRequest, FeedbackResponse, Review
from pathlib import Path

from services import gemini_service

router = APIRouter("/api/feedback")


@router.post("/", response_model=FeedbackResponse)
async def get_interview_feedback(request: FeedbackRequest):
    """
    Return separate reviews for code and audio plus an overall assessment.

    The endpoint performs three focused LLM calls (or fewer depending on fallbacks):
    - code review (focus='code')
    - audio review (focus='audio')
    - overall assessment (focus='overall')
    """

    audio_path = Path(request.audio_filepath)
    if not audio_path.exists():
        raise HTTPException(status_code=400, detail=f"audio_filepath not found: {request.audio_filepath}")

    # Request a code-focused review
    code_result = await gemini_service.analyze_interview(
        audio_filepath=str(audio_path), question=request.question, code=request.code, focus="code"
    )

    # Request an audio-focused review
    audio_result = await gemini_service.analyze_interview(
        audio_filepath=str(audio_path), question=request.question, code=request.code, focus="audio"
    )

    # Request an overall assessment (could be optional)
    overall_result = await gemini_service.analyze_interview(
        audio_filepath=str(audio_path), question=request.question, code=request.code, focus="overall"
    )

    # Map results into Review models with safe defaults
    code_review = Review(
        score=str(code_result.get("score")) if code_result.get("score") is not None else None,
        description=code_result.get("description"),
        strengths=code_result.get("strengths") or [],
        improvements=code_result.get("improvements") or [],
    )

    audio_review = Review(
        score=str(audio_result.get("score")) if audio_result.get("score") is not None else None,
        description=audio_result.get("description"),
        strengths=audio_result.get("strengths") or [],
        improvements=audio_result.get("improvements") or [],
        transcript=audio_result.get("transcript"),
    )

    overall_assessment = overall_result.get("description") or overall_result.get("raw_output")

    return FeedbackResponse(
        code_review=code_review,
        audio_review=audio_review,
        overall_assessment=overall_assessment,
        audio_filepath=str(audio_path),
        raw_output={"code": code_result, "audio": audio_result, "overall": overall_result},
    )