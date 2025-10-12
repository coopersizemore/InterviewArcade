## Inspiration

Ever felt overwhelmed with the interview process when looking for an internship?  
We bring you **InterviewArcade** - an interactive **retro-styled** technical mock interview tool to help prepare students for the real thing!  
  
InterviewArcade brings you the opportunity to **select any company or problem category** for a mock technical interview, and then provides you with **personalized feedback** on both communication and technical skills.

## What it does
InterviewArcade simulates a technical interview, and provides case-by-case feedback:
1. Student selects the company or type of question they'd like to solve in their technical interview
2. Technical interview starts! Student talks through their approach, and writes a code solution.
3. Student's verbal approach and code solution are sent for Gemini evaluation.
4. Formatted feedback is returned with strengths and areas to improve for communication, and coding skills.
5. Student can listen to their feedback with a personalized AI-voiceover provided by Eleven-Labs as well!

## How we built it

We used a React.js front end that connects to a a Python FastAPI backend. The backend interacts with GeminiAPI, ElevenLabs, and our list of questions to provide information and files to the front end. As users talk, we send chunks of audio to avoid sending a long upload at the end of the interview. We prepare this audio in a combined file, and send that audio, the code, and the question to Gemini API for feedback on the interview. We then provide this feedback as a score through json, and a transcript of overall feedback. We run that transcript of feedback through ElevenLabs to create an mp3 audio file to play as speech back to the user to make it like an interactive interview.

## Challenges we ran into

- Scope creep: Our initial scope included allowing real-time conversation with AI, much like a technical interview, however that was not feasible in 24 hours.
- File & audio streaming between front and back end
- Front-end and back-end integration

## Accomplishments that we're proud of
- Our retro themes! We designed our frontend to be representative of various nostalgic retro games - PacMan, Space Invaders, Breakout.
- Audio recording & streaming! We send student audio to represent a very important component of technical interviews: **communication**!
- Focus on personalization & user-experience!

## What we learned
- Binary transfers are **very** hard through POST requests.
- Storyboarding before implementation is key!
- Endpoint design documentation is very helpful during front-end and back-end integration.

## What's next for InterviewArcade
- Real-time conversations with AI to better simulate the real technical interview experience.
- Implement **Behavioral Interview** preparation!
