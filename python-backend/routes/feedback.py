from fastapi import APIRouter, HTTPException
from models import FeedbackRequest, FeedbackResponse, Review, AudioResponse
from pathlib import Path

from services import gemini_service
from services.elevenlabs_service import textToSpeech

router = APIRouter(prefix="/api/feedback")


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
        score=str(code_result.get("score")) if code_result.get("score") is not None else "0",
        strengths_list=code_result.get("strengths_list") or [],
        strengths_description=code_result.get("strengths_description") or "",
        improvements_list=code_result.get("improvements_list") or [],
        improvements_description=code_result.get("improvements_description") or "",
    )

    audio_review = Review(
        score=str(audio_result.get("score")) if audio_result.get("score") is not None else "0",
        strengths_list=audio_result.get("strengths_list") or [],
        strengths_description=audio_result.get("strengths_description") or "",
        improvements_list=audio_result.get("improvements_list") or [],
        improvements_description=audio_result.get("improvements_description") or "",
    )

    overall_assessment = overall_result.get("description") or ""

    return FeedbackResponse(
        code_review=code_review,
        audio_review=audio_review,
        overall_assessment=overall_assessment
    )

@router.post("/tts")
async def transcript_to_audio(transcript: str):
    """
    Converts a transcript string into an audio file using ElevenLabs.
    Returns the generated audio file as binary data.
    """
    try:
        audio_bytes = await textToSpeech(transcript)
        return AudioResponse(content=audio_bytes, media_type="audio/wav")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))