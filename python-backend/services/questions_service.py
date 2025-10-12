import json
import os

def load_questions_from_file():
    """Loads interview questions from a JSON file."""
    try:
        questions_path = os.path.join(os.path.dirname(__file__), '..', 'questions.json')
        with open(questions_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return []
