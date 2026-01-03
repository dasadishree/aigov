"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Paste() {
    const router = useRouter();
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

    return(
        <main className="paste-page">
            <div className="grid-pattern"></div>
            
            <button className="back-button" onClick={() => router.push("/choose")}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>

            {/* input area */}
            <div className="paste-content">
                <h2>Paste Your Ingredient List</h2>
                
                <div className={`input-results-wrapper ${result ? 'has-results' : ''}`}>
                    <div className="paste-container">
                        <textarea 
                            className="ingredient-textarea"
                            rows={8} 
                            placeholder="Paste ingredient list here..."
                            value={ingredients}
                            onChange={(e)=>setIngredients(e.target.value)}
                        />

                        <button 
                            className="analyze-button" 
                            onClick={handleAnalyze} 
                            disabled={loading || !ingredients.trim()}
                        >
                            {loading ? "Analyzing..." : "Analyze Ingredients"}
                        </button>
                    </div>
                    
                    {/* results */}
                    {result && (
                        <div className="result-container">
                            <h3>Analysis Results</h3>

                            <div className="result-content">
                                {result.split(/\n(?=\d+\.\s)/).map((block, index) => {
                                    const lines = block.split("\n").filter(Boolean);
                                    const title = lines[0].replace(/^\d+\.\s*/, "");
                                    const bullets = lines.slice(1);

                                    return (
                                        <div key={index} className="ingredient-section">
                                            <h4 className="ingredient-name"> 
                                                {index+1}. {title}
                                            </h4>
                                        
                                        <ul className="ingredient-bullets">
                                            {bullets.map((b,i) => (
                                                <li key={i}>{b.replace(/^-s*/, "")}</li>
                                            ))}
                                        </ul>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}