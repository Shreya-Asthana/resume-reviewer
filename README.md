## 🧠 Resume Reviewer (React + Flask)

An intelligent web application that allows users to upload their resumes and a job description to get:

* **ATS Match Score** (How well your resume matches the job)
* **HR Feedback** (Professional insights)
* **Section-wise Resume Scoring**

> Powered by **React** (Frontend), **Flask** (Backend), and **Gemini API** (AI Model).


---

## 🚀 Features

* 📄 PDF Resume Upload
* 🧾 Job Description Input
* 🧠 AI-based Resume Evaluation using Gemini
* 📊 Section-wise Ratings (Education, Skills, Projects, etc.)
* 💡 Clean, responsive UI with pastel blue-purple theme

---

## 🛠️ Technologies Used

### 🔷 Frontend (React.js)

* `useState` for managing form state and result data
* `axios` for making HTTP POST requests to Flask
* Custom styles using inline CSS for responsive layout
* Conditional rendering (`!results`, `results &&`) to show different UI stages

### 🔶 Backend (Flask)

* `Flask` for handling upload and API endpoint
* `pdfplumber` to parse text from PDF resumes
* `dotenv` for secure API key management
* `google.generativeai` to call the Gemini model
* Compatibility scoring, ATS percentage, and HR feedback generation logic

---

## 🔄 Frontend–Backend Communication

1. **User uploads** a PDF and pastes a job description.
2. **React (axios)** sends a `POST` request with resume file and JD to `/upload` endpoint in Flask.
3. **Flask** processes the PDF and sends prompts to **Gemini** to generate:

   * Section-wise relevance scores (Experience, Education, etc.)
   * ATS Match Percentage
   * HR Feedback
4. **Flask returns** all responses as JSON to React.
5. **React displays** the scores, feedback, and ratings in styled cards and tables.

---

## 📁 Project Structure

```
resume-reviewer/
│
├── backend/                    # Flask app
│   ├── app.py                 # Main Flask API
│   └── .env                   # API keys (Gemini)
│
├── resume-reviewer-frontend/  # React app
│   ├── src/
│   │   └── App.js             # Main React component
│   ├── public/
│   ├── package.json
│
└── README.md
```

---

## ▶️ Getting Started

### 🔹 Backend Setup (Flask)

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
# Add your gemini key
python app.py
```

### 🔹 Frontend Setup (React)

```bash
cd resume-reviewer-frontend
npm install
npm start
```

---

## 📸 UI Preview (optional)
![image](https://github.com/user-attachments/assets/9d6c847d-ab20-4755-bfe2-6b2e956ff850)

![image](https://github.com/user-attachments/assets/5864c11f-2964-4635-a498-10216ba596e1)

---

## 📌 To-Do / Improvements

* Deploy frontend (Vercel) and backend (Render/Heroku)
* Add download report feature
* Support DOCX format


