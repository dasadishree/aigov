"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import React from "react";

export default function Scan() {
    const router = useRouter();
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [ocrText, setOcrText] = useState("");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [mode, setMode] = useState<"upload" | "camera">("upload");
    const [stream, setStream] = useState<MediaStream | null>(null);
    const videoRef = React.useRef<HTMLVideoElement>(null);

    React.useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] || null;
        setImage(file);
        
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview("");
        }
        setOcrText("");
        setResult("");
    }

    async function startCamera() {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (error) {
            console.error("Error accessing camera:", error);
            alert("Unable to access camera. Please check permissions or try upload mode.");
        }
    }

    function stopCamera() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    }

    function capturePhoto() {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(videoRef.current, 0, 0);
                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
                        setImage(file);
                        setImagePreview(URL.createObjectURL(blob));
                        stopCamera();
                        setOcrText("");
                        setResult("");
                    }
                }, 'image/jpeg');
            }
        }
    }

    async function handleScan() {
        if (!image) return;

        setScanning(true);
        try {
            const formData = new FormData();
            formData.append("image", image);

            const res = await fetch("http://127.0.0.1:5000/scan", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            setOcrText(data.text);
        } catch (error) {
            console.error("Error scanning image:", error);
            alert("Error scanning image. Please try again.");
        } finally {
            setScanning(false);
        }
    }

    async function handleAnalyze() {
        if (!ocrText.trim()) return;

        setLoading(true);
        try {
            const res = await fetch("http://127.0.0.1:5000/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ingredients: ocrText }),
            });

            const data = await res.json();
            setResult(data.analysis);
        } catch (error) {
            console.error("Error analyzing ingredients:", error);
            alert("Error analyzing ingredients. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return(
        <main className="scan-page">
            <div className="grid-pattern"></div>
            
            <button className="back-button" onClick={() => router.push("/choose")}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>

            <div className="scan-content">
                <h2>Scan Your Ingredient Label</h2>
                
                <div className={`scan-wrapper ${result ? 'has-results' : ''}`}>
                    <div className="scan-container">
                        <div className="scan-mode-toggle">
                            <button 
                                className={mode === "upload" ? "active" : ""}
                                onClick={() => {
                                    setMode("upload");
                                    setImage(null);
                                    setImagePreview("");
                                    setOcrText("");
                                    setResult("");
                                }}
                            >
                                Upload Image
                            </button>

                            <button 
                                className={mode==="camera" ? "active" : ""}
                                onClick={() => {
                                    if (mode === "camera") {
                                        stopCamera();
                                        setMode("upload");
                                    } else {
                                        setMode("camera");
                                        setImage(null);
                                        setImagePreview("");
                                        setOcrText("");
                                        setResult("");
                                        startCamera();
                                    }
                                }}
                            >
                                {mode === "camera" ? "Switch to Upload" : "Take Photo"}
                            </button>
                        </div>

                        {mode === "upload" ? (
                            <div className="image-upload-area">
                                <input 
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="file-input"
                                    id="image-input"
                                />
                                <label htmlFor="image-input" className="upload-label">
                                    {imagePreview ? (
                                        <div className="image-preview-wrapper">
                                            <img src={imagePreview} alt="Preview" className="image-preview" />
                                            <div className="image-overlay">
                                                <p>Click to change image</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="upload-placeholder">
                                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V5C1 4.46957 1.21071 3.96086 1.58579 3.58579C1.96086 3.21071 2.46957 3 3 3H9L11 5H21C21.5304 5 22.0391 5.21071 22.4142 5.58579C22.7893 5.96086 23 6.46957 23 7V19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            <p>Click to upload image</p>
                                            <p className="upload-hint">or drag and drop</p>
                                        </div>
                                    )}
                                </label>
                            </div>
                        ) : (
                            <div className="camera-container">
                                {stream ? (
                                    <>
                                        <video 
                                            ref={videoRef}
                                            autoPlay
                                            playsInline
                                            className="camera-video"
                                        />
                                        <div className="camera-controls">
                                            <button 
                                                className="capture-button"
                                                onClick={capturePhoto}
                                            >
                                                <div className="capture-button-inner"></div>
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="camera-placeholder">
                                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V5C1 4.46957 1.21071 3.96086 1.58579 3.58579C1.96086 3.21071 2.46957 3 3 3H9L11 5H21C21.5304 5 22.0391 5.21071 22.4142 5.58579C22.7893 5.96086 23 6.46957 23 7V19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        <p>Camera starting...</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {imagePreview && (
                            <>
                                <button 
                                    className="scan-button" 
                                    onClick={handleScan} 
                                    disabled={scanning}
                                >
                                    {scanning ? "Scanning..." : "Scan Image"}
                                </button>

                                {ocrText && (
                                    <div className="ocr-text-container">
                                        <h4>Scanned Text:</h4>
                                        <textarea 
                                            className="ocr-textarea"
                                            value={ocrText}
                                            onChange={(e) => setOcrText(e.target.value)}
                                            rows={6}
                                            placeholder="Scanned text will appear here..."
                                        />
                                        <button 
                                            className="analyze-button" 
                                            onClick={handleAnalyze} 
                                            disabled={loading || !ocrText.trim()}
                                        >
                                            {loading ? "Analyzing..." : "Analyze Ingredients"}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    
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