from fastapi import APIRouter
from models import FeedbackRequest, FeedbackResponse
import services
from routes.questions import get_question_by_id

router = APIRouter(prefix="/api/feedback", tags=["feedback"])

@router.post("/", response_model=FeedbackResponse, summary="Submit interview attempt for feedback")
async def get_interview_feedback(request: FeedbackRequest):
    """
    Main endpoint to process the user's interview attempt.
    This will transcribe audio, evaluate code, and generate feedback.
    """
    print(f"Received feedback request for question ID: {request.question_id}")

    # 1. Transcribe the user's spoken audio (placeholder)
    transcript = await services.transcribe_audio_with_whisper(request.audio_data)

    # 2. Evaluate the user's code using an LLM
    code_evaluation = await services.evaluate_code_with_llm(request.user_code)

    # 3. Get the solution for comparison
    question = await get_question_by_id(request.question_id)
    solution = question["solution"] if question else "No solution found."

    # 4. Generate comprehensive feedback based on all inputs
    final_feedback = await services.generate_final_feedback(
        transcript=transcript,
        user_code=request.user_code,
        code_evaluation=code_evaluation,
        solution_code=solution
    )

    # 5. Convert the feedback text to speech (placeholder)
    feedback_audio_url = await services.convert_text_to_speech_elevenlabs(final_feedback["report_text"])

    return FeedbackResponse(
        scores=final_feedback["scores"],
        report_text=final_feedback["report_text"],
        suggestions=final_feedback["suggestions"],
        feedback_audio_url=feedback_audio_url
    )