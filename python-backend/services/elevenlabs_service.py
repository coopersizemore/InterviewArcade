from elevenlabs.client import ElevenLabs
from elevenlabs.play import play
from dotenv import load_dotenv
import os
from typing import Dict, Any
load_dotenv()

api_key = os.getenv("ELEVENLABS_API_KEY")

elevenlabs = ElevenLabs(
    api_key=api_key,
)

def textToSpeech(text: str):
    audio = elevenlabs.text_to_speech.convert(
        text=text,
        voice_id="56AoDkrOh6qfVPDXZ7Pt",
        model_id="eleven_turbo_v2_5",
        output_format="mp3_44100_128"
    )
    print(type(audio))
    audio_bytes = b"".join(audio)
    with open("output.mp3", "wb") as f:
        f.write(audio_bytes)

textToSpeech("Hello, welcome to Interview Arcade! We are excited to have you here.")

