from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import base64
import io
from PyPDF2 import PdfReader

app = Flask(__name__)
CORS(app)

GEMINI_API_KEY = "AIzaSyB6RA1sksPraEkqoE-S40q9Lj-c5poz83M"
genai.configure(api_key=GEMINI_API_KEY)

def extract_pdf_text(base64_data):
    pdf_bytes = base64.b64decode(base64_data)
    reader = PdfReader(io.BytesIO(pdf_bytes))
    text = ""
    for page in reader.pages:
        extracted = page.extract_text()
        if extracted:
            text += extracted + "\n"
    return text


@app.route("/generate-questions", methods=["POST"])
def generate_questions():
    payload = request.json

    num = payload.get("num_questions")
    pdf_data = payload.get("pdf_data")

    if not num or not pdf_data:
        return jsonify({"error": "Missing fields"}), 400

    text = extract_pdf_text(pdf_data)

    prompt = f"""
    You are an expert exam question generator.
    Generate exactly {num} high-quality exam questions WITH their answers.
    Based strictly on the text:

    {text}

    Return ONLY JSON array:
    [
      {{"question": "...", "answer": "..."}},
      ...
    ]
    """

    model = genai.GenerativeModel("gemini-1.5-flash")
    result = model.generate_content(prompt)

    return jsonify({"result": result.text})


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)
