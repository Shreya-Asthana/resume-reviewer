from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os
import pdfplumber
import pandas as pd
import google.generativeai as genai
import re
from dotenv import load_dotenv

# Load API key
load_dotenv()
genai.configure(api_key="AIzaSyBvSMzCVBOzkFsXDzlhqStStcuiBEVr2go")

app = Flask(__name__)
CORS(app)

model = genai.GenerativeModel('gemini-1.5-flash')
FIXED_HEADINGS = ["Experience", "Education", "Skills", "Projects"]

def clean_text(text):
    return re.sub(r"[\#\*\_]+", "", text).strip()

def extract_sections_from_pdf(uploaded_file):
    sections = {}
    current_section = None
    with pdfplumber.open(uploaded_file) as pdf:
        for page in pdf.pages:
            words = page.extract_words(extra_attrs=["size", "fontname"])
            for word in words:
                text, size = word["text"].strip(), word["size"]
                if text in FIXED_HEADINGS or size > 10:
                    current_section = text
                    sections[current_section] = []
                elif current_section:
                    sections[current_section].append(text)
    for section in sections:
        sections[section] = " ".join(sections[section])
    return sections

def get_compatibility_score(section_name, section_content, job_description):
    if not section_content:
        return 0
    prompt = f"""
    You are an ATS evaluating a resume section against a job description.
    Score the '{section_name}' section from 0-10 based on relevance.

    Job Description: {job_description}
    Resume {section_name} Section: {section_content}

    Return only the integer score.
    """
    response = model.generate_content(prompt)
    try:
        return min(max(int(response.text.strip()), 0), 10)
    except ValueError:
        return 0

def get_gemini_feedback(input, resume_text, prompt):
    response = model.generate_content([input, resume_text, prompt])
    return clean_text(response.text)

@app.route("/upload", methods=["POST"])
def upload_resume():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    resume_sections = extract_sections_from_pdf(file)

    job_description = request.form.get("job_description", "")


    ats_prompt = "You are an ATS scanner evaluating resume. Return only the percentage match according to the job description."
    hr_prompt = "Give a 250-word HR evaluation of resume. With areas to focus on"

    ats_score = get_gemini_feedback(ats_prompt, str(resume_sections), job_description)
    hr_feedback = get_gemini_feedback(hr_prompt, str(resume_sections), job_description)
    scores = {section: get_compatibility_score(section, resume_sections.get(section, ""), job_description) for section in FIXED_HEADINGS}

    return jsonify({
        "ATS_Match_Percentage": ats_score,
        "HR_Feedback": hr_feedback,
        "Section_Scores": scores
    })

if __name__ == "__main__":
    app.run(debug=True)
