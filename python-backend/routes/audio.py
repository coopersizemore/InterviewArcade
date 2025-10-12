from fastapi import APIRouter, HTTPException
from models import AudioBlob
from pathlib import Path
import base64
import wave
import io

router = APIRouter(prefix="/api/audio", tags=["audio"])

# Defining data path
DATA_DIR = Path("data")
DATA_DIR.mkdir(exist_ok=True)
AUDIO_PATH = DATA_DIR / "recording.webm"

@router.post("/")
def send_audio(request: AudioBlob):
    """
    Receives an audio chunk (base64-encoded) from the frontend,
    decodes it, and appends it to a stored .wav file.
    """

    try:
        # 1. Decode the base64 string directly into bytes
        audio_bytes = base64.b64decode(request.data)

        # 2. Write the bytes to the specified .webm file
        #    This will create the file if it doesn't exist or
        #    overwrite it if it does.
        AUDIO_PATH.write_bytes(audio_bytes)

        return {"message": "Audio file saved successfully."}

    except base64.BinasciiError as e:
        # Handle cases where the base64 string is invalid
        raise HTTPException(status_code=400, detail=f"Invalid Base64 data: {e}")
    except Exception as e:
        # Handle other potential errors (e.g., file permissions)
        raise HTTPException(status_code=500, detail=str(e))

