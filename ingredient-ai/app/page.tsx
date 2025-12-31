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
        <h1>Ingredient Explainer</h1>

        <textarea 
          rows={6}
          placeholder="Paste ingredient list here..."
          value={ingredients}
          onChange={(e)=>setIngredients(e.target.value)}
        />

        <button onClick={handleAnalyze} disabled={loading}>
          {loading ? "Analyzing..." : "Analyze Ingredients"}
        </button>

        <pre style={{ marginTop: 20}}>{result}</pre>
    </main>
  );
}
