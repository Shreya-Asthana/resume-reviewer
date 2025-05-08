import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !jobDescription.trim()) return alert("Please upload a file and enter job description.");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_description", jobDescription);

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/upload", formData);
      setResults(response.data);
    } catch (error) {
      alert("Error uploading resume");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f4ff',
      minHeight: '100vh',
      padding: '40px 20px',
      textAlign: 'center'
    }}>
      <h1 style={{ color: '#6a5acd', marginBottom: '20px' }}>Resume Reviewer</h1>
      {!results && (
        <div style={{ maxWidth: '600px', margin: '0 auto', background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%' }}>
          <p style={{ fontSize: '18px', color: '#333' }}>
            Upload your resume and paste a job description to get instant ATS analysis and HR feedback.
          </p>
          <form onSubmit={handleSubmit}>
            <textarea
              placeholder="Paste job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={5}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '15px', resize: 'vertical' }}
            />
            <input type="file" accept="application/pdf" onChange={handleFileChange} style={{ margin: '15px 0', padding: '10px', width: '100%' }} />
            <br />
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#6a5acd',
                color: '#fff',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                width: '100%',
                maxWidth: '300px',
                transition: 'background 0.3s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#836fff'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#6a5acd'}
            >
              {loading ? "Processing..." : "Upload Resume"}
            </button>
          </form>
        </div>
      )}

      {results && (
        <div style={{ maxWidth: '800px', margin: '30px auto', width: '100%' }}>
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#6a5acd' }}>ATS Match Percentage</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{results.ATS_Match_Percentage}</p>
          </div>
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', textAlign: 'left' }}>
            <h3 style={{ color: '#6a5acd', textAlign: 'center' }}>HR Feedback</h3>
            <p style={{ fontSize: '16px' }}>{results.HR_Feedback}</p>
          </div>
          <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
            <h3 style={{ color: '#6a5acd' }}>Section-wise Rating</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
              <thead>
                <tr style={{ backgroundColor: '#dcdcff' }}>
                  <th style={{ padding: '10px', borderBottom: '2px solid #ccc', textAlign: 'left' }}>Section</th>
                  <th style={{ padding: '10px', borderBottom: '2px solid #ccc', textAlign: 'left' }}>Score (out of 10)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(results.Section_Scores).map(([section, score]) => (
                  <tr key={section} style={{ backgroundColor: '#f8f8ff' }}>
                    <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{section}</td>
                    <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
