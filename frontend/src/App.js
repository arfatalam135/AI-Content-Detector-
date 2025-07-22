import React, { useState } from "react";

export default function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setConfidence(null);
    setExplanation(null);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("media", file);

    try {
      const response = await fetch("https://workspace--5000.replit.app/analyze", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResult(data.result);
      setConfidence(data.confidence);
      setExplanation(data.explanation);
    } catch (error) {
      alert("Error while analyzing image");
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>AI Content Detector</h1>
      <p style={{ fontSize: 14, color: "#666" }}>Developed by Arfat Aalam</p>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleSubmit} disabled={!file} style={{ marginTop: 10 }}>
        Analyze
      </button>
      {loading && <p>Analyzing...</p>}
      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>Result: {result}</h3>
          <p>Confidence: {(confidence * 100).toFixed(2)}%</p>
          <p>{explanation}</p>
        </div>
      )}
    </div>
  );
  }
