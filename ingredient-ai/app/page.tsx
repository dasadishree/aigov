"use client";
import { useState } from "react";
import labelImg from "./label.png";
import labelPile1Img from "./labelpile.png";
import labelPile2Img from "./labelpile2.webp";

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
      <div className="grid-pattern"></div>
      <div id="centered-content">
        <h1>beyond the box:</h1>
        <h2>eat informed</h2>
        <button id="start-button">START NOW</button>
      </div>

      <div id="did-you-know">
        <h3>DID YOU KNOW?</h3>
        <p>Natural flavor can mean hundreds of different compounds, and companies don't have to list them individually.</p>
      </div>
      <img src={labelPile1Img.src} alt="Label pile image for decoration." id="labelPile1" />
      <img src={labelPile2Img.src} alt="Label pile image for decoration." id="labelPile2" />
        
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
