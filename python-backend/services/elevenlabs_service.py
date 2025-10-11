from elevenlabs import ElevenLabs


elevenlabs = ElevenLabs(
    api_key=api_key,
)

def textToSpeech(text: str, voice: str = "Rachel", model: str = "eleven_monolingual_v1") -> bytes: