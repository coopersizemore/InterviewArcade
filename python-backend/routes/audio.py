from fastapi import APIRouter, HTTPException
from models import AudioBlob
from pathlib import Path
import base64
import wave
import io

router = APIRouter("/api/audio")

# Defining data path
DATA_DIR = Path("data")
DATA_DIR.mkdir(exist_ok=True)
AUDIO_PATH = DATA_DIR / "recording.wav"

@router.post("/")
def send_audio(request: AudioBlob):
    """
    Receives an audio chunk (base64-encoded) from the frontend,
    decodes it, and appends it to a stored .wav file.
    """

    try:
        # Decode base64 to bytes
        audio_bytes = base64.b64decode(request.data)

        # Open the in-memory audio chunk
        buffer = io.BytesIO(audio_bytes)
        with wave.open(buffer, "rb") as src:
            params = src.getparams()
            frames = src.readframes(src.getnframes())

        # If the file doesn't exist, create it
        if not AUDIO_PATH.exists():
            with wave.open(str(AUDIO_PATH), "wb") as dst:
                dst.setparams(params)
                dst.writeframes(frames)
        else:
            # Read existing file and append
            with wave.open(str(AUDIO_PATH), "rb") as existing:
                existing_params = existing.getparams()
                if existing_params[:3] != params[:3]:
                    raise HTTPException(
                        status_code=400,
                        detail="Audio format mismatch"
                    )
                existing_frames = existing.readframes(existing.getnframes())

            with wave.open(str(AUDIO_PATH), "wb") as dst:
                dst.setparams(params)
                dst.writeframes(existing_frames + frames)

        return {"message": "Audio chunk appended successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

