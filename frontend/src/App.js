import React, { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload a file first.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://workspace--5000.replit.app/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Server returned an error");
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while analyzing the file.");
    }

    setLoading(false);
  };

  return (
    <div className="App">
      <h1>AI Content Detector</h1>
      <p>Developed by Arfat Aalam</p>

      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </form>

      {result && (
        <div className="result">
          <h3>Result: {result.result}</h3>
          <p>Confidence: {result.confidence}</p>
          <p>Explanation: {result.explanation}</p>
        </div>
      )}
    </div>
  );
}

export default App;
