from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os

app = Flask(__name__)
CORS(app)

# ---------------------------------------------------
# 1. GOOGLE API KEY SETUP
# ---------------------------------------------------
# Make sure you have:
#   set GOOGLE_API_KEY=your_key_here   (Windows)
# or export GOOGLE_API_KEY=your_key_here (Mac/Linux)

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Use the FREE model
MODEL_NAME = "models/gemini-2.5-flash-lite"
model = genai.GenerativeModel(MODEL_NAME)

# ---------------------------------------------------
# 2. Helper function to call Gemini
# ---------------------------------------------------
def ask_gemini(prompt: str):
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print("Gemini API Error:", e)
        return None


# ---------------------------------------------------
# 3. EXTRACT CHAPTERS
# ---------------------------------------------------
@app.route("/extract_chapters", methods=["POST"])
def route_extract_chapters():
    data = request.json
    pdf_text = data.get("pdf", "")

    if not pdf_text:
        return jsonify({"error": "No PDF text provided"}), 400

    prompt = f"""
    Extract the chapter titles from the following PDF text.
    Return ONLY a JSON array of chapter titles.

    Example output:
    ["Chapter 1: Intro", "Chapter 2: Theory"]

    PDF TEXT:
    {pdf_text}
    """

    result = ask_gemini(prompt)

    if not result:
        return jsonify({"error": "Model failed"}), 500

    # Try to parse JSON array safely
    try:
        import json
        chapters = json.loads(result)
    except:
        # Fallback: split by line if model returned plain text
        chapters = [line.strip() for line in result.split("\n") if line.strip()]

    return jsonify({"chapters": chapters})


# ---------------------------------------------------
# 4. GENERATE QUESTIONS
# ---------------------------------------------------
@app.route("/generate_questions", methods=["POST"])
def route_generate_questions():
    data = request.json
    chapter = data.get("chapter")
    count = int(data.get("count", 1))

    if not chapter:
        return jsonify({"error": "No chapter provided"}), 400

    prompt = f"""
    Generate {count} exam questions from the chapter below.
    Respond ONLY in JSON format like this:
    [
      {{"question": "Q1 text", "answer": "A1 text"}},
      {{"question": "Q2 text", "answer": "A2 text"}}
    ]

    CHAPTER:
    {chapter}
    """

    result = ask_gemini(prompt)

    if not result:
        return jsonify({"error": "Model failed"}), 500

    # Parse JSON safely
    try:
        import json
        questions = json.loads(result)
    except:
        # fallback extraction if model outputs text
        questions = []
        lines = result.split("\n")
        for line in lines:
            if "?" in line:
                questions.append({
                    "question": line.strip(),
                    "answer": "No answer provided by model"
                })

    return jsonify({"questions": questions})


# ---------------------------------------------------
# 5. Run the application
# ---------------------------------------------------
if __name__ == "__main__":
    print("Server running on http://127.0.0.1:5000")
    print(f"Using Model: {MODEL_NAME}")
    app.run(port=5000, debug=True)
