from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from models import FeedbackRequest, FeedbackResponse, Review, AudioBlob, TTSRequest, TTSResponse
from pathlib import Path
import asyncio
import base64

from services import gemini_service
from services.elevenlabs_service import textToSpeech

router = APIRouter(prefix="/api/feedback")


@router.post("/", response_model=FeedbackResponse)
async def get_interview_feedback(request: FeedbackRequest):
    """
    Return separate reviews for code and audio plus an overall assessment.

    The endpoint performs three focused LLM calls concurrently:
    - code review (focus='code')
    - audio review (focus='audio')
    - overall assessment (focus='overall')
    """

    audio_path = "data/recording.wav"
    if not audio_path:
        raise HTTPException(
            status_code=400, detail=f"audio_filepath not found: {audio_path}"
        )

    # Kick off all three Gemini requests concurrently
    code_task = asyncio.create_task(
        gemini_service.analyze_interview(
            audio_filepath=str(audio_path),
            question=request.question,
            code=request.code,
            focus="code",
        )
    )
    audio_task = asyncio.create_task(
        gemini_service.analyze_interview(
            audio_filepath=str(audio_path),
            question=request.question,
            code=request.code,
            focus="audio",
        )
    )
    overall_task = asyncio.create_task(
        gemini_service.analyze_interview(
            audio_filepath=str(audio_path),
            question=request.question,
            code=request.code,
            focus="overall",
        )
    )

    # Wait for all tasks to complete concurrently
    try:
        code_result, audio_result, overall_result = await asyncio.gather(
            code_task, audio_task, overall_task
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini API call failed: {str(e)}")

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
        overall_assessment=overall_assessment,
    )

"""
@router.post("/tts", response_model=AudioBlob)
async def transcript_to_audio(request: TTSRequest):
    try:
        # call sync function without await
        audio_bytes = textToSpeech(request.transcript)

        # encode as base64 so it is safe to include in JSON
        # b64 = base64.b64encode(audio_bytes).decode("ascii")
        return AudioBlob(data=audio_bytes, data_type="audio/mpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
"""

@router.post("/tts")
async def transcript_to_audio(request: TTSRequest):
    try:
        # run blocking textToSpeech in a thread (doesn't block event loop)
        audio_bytes = await asyncio.to_thread(textToSpeech, request.transcript)
        return Response(content=audio_bytes, media_type="audio/mpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))