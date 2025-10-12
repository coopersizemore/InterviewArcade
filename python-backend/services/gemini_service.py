import os
import re
import json
from typing import Dict, Any
from google import genai


# === Prompt Builders ===
def build_audio_prompt(question: str, code: str) -> str:
    """Builds a JSON-only prompt for analyzing audio and transcript quality."""
    return f"""
    You are an expert technical interviewer assistant overseeing a 
    technical interview of a candidate's code answer to a question, 
    and an audio description walking you through their answer.
    Respond directly to the candidate with a single valid JSON object only.
    In your evaluation, consider if the candidate clearly explained their thought process, 
    understood the problem, and considered edge cases. Do not include explanations,
    markdown, or extra text.

    Question: 
    {question}

    Candidate code answer:
    {code}

    Return a JSON object for the AUDIO review with the following keys:
    {{
    "score": int,               // a score 0–10 indicating the candidate's walkthrough performance
    "strengths_list": [string],  // A list of the candidate's walkthrough strengths
    "strengths_description": string,  // A description of the candidate's walkthrough strengths
    "improvements_list": [string],  // A list of potential improvements for the candidate's walkthrough
    "improvements_description": string,  // A description of improvements for the candidate's walkthrough
    }}
    """


def build_code_prompt(question: str, code: str) -> str:
    """Builds a JSON-only prompt for evaluating the candidate's code."""
    return f"""
    You are an expert technical interviewer assistant overseeing a 
    technical interview of a candidate's code answer to a question, 
    and an audio description walking you through their answer.
    Respond directly to the candidate with a single valid JSON object only.
    Do not include explanations, markdown, or extra text.

    Question: 
    {question}

    Candidate code answer:
    {code}

    Return a JSON object for the CODE review with the following keys:
    {{
    "score": int,               // 0–10 indicating the candidate's coding performance
    "strengths_list": [string],  // A list of the candidate's coding strengths
    "strengths_description": string,  // A description of the candidate's coding strengths
    "improvements_list": [string],  // A list of potential improvements for the candidate's code
    "improvements_description": string,  // A description of improvements for the candidate's code
    }}
    """


def build_overall_prompt(question: str, code: str) -> str:
    """Builds a JSON-only prompt for an overall assessment."""
    return f"""
    You are an expert technical interviewer assistant overseeing a 
    technical interview of a candidate's code answer to a question, 
    and an audio description walking you through their answer.
    Respond directly to the candidate with a single valid JSON object only.
    Do not include explanations, markdown, or extra text.

    Question: 
    {question}

    Candidate code answer:
    {code}

    Your return should follow the following format EXACTLY. In the JSON object, the string value should be
    a thorough overall assessment of around 30 seconds of spoken feedback. Discuss the candidate's strengths and areas for
    improvement in both their coding and their audio.

    Return a JSON object for the OVERALL assessment with the following key:
    {{
    "overall_assessment": string  // An overall assessment of the candidate's performance on coding and walkthrough
    }}
    """


# === Main Function ===

async def analyze_interview(
    audio_filepath: str,
    question: str,
    code: str,
    model: str = "gemini-2.0-flash",
    focus: str = "overall",
) -> Dict[str, Any]:
    """
    Analyze an interview using Gemini.
    Returns a pure JSON response that can be directly saved and reloaded with json.load().
    """

    # --- Select the correct helper function ---
    if focus == "audio":
        prompt_text = build_audio_prompt(question, code)
    elif focus == "code":
        prompt_text = build_code_prompt(question, code)
    else:
        prompt_text = build_overall_prompt(question, code)

    print(prompt_text)

    # --- Initialize Gemini client ---
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise EnvironmentError("Missing GEMINI_API_KEY in environment variables.")
    client = genai.Client(api_key=api_key)

    # --- Upload audio file ---
    uploaded_audio = client.files.upload(
        file=audio_filepath,
        config={"mime_type": "audio/webm"}
    )

    # --- Generate model response ---
    resp = client.models.generate_content(
        model=model,
        contents=[prompt_text, uploaded_audio],
    )

    # --- Parse as JSON ---
    text_response = getattr(resp, "text", None) or str(resp)
    
    # Extracting json from text, with simple regex
    match = re.search(r"\{[^{}]*\}", text_response)
    json_string = match.group(0) if match else None

    try:
        data = json.loads(json_string)
    except json.JSONDecodeError:
        raise ValueError(
            f"Gemini response was not valid JSON:\n{text_response[:500]}"
        )

    return data
