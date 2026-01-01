"use client";
import { useState } from "react";

export default function Home() {
  const [ingredients, setIngredients] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    setLoading(true);

    const res = await fetch("http://127.0.0.1:5000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients }),
    });

    const data = await res.json();
    setResult(data.analysis);

    setLoading(false);
  }
  
  return (
    <main>
      <div id="background-elements">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="grid-pattern"></div>
      </div>
      <div id="main-container">
        <div id="main-text">
          <h1>beyond the box:</h1>
          <h2>eat informed</h2>
        </div>
      </div>
        <button id="start-button">START NOW</button>
        {/* <textarea 
          rows={6}
          placeholder="Paste ingredient list here..."
          value={ingredients}
          onChange={(e)=>setIngredients(e.target.value)}
        />

        <button onClick={handleAnalyze} disabled={loading}>
          {loading ? "Analyzing..." : "Analyze Ingredients"}
        </button> */}

        <pre style={{ marginTop: 20}}>{result}</pre>
    </main>
  );
}
