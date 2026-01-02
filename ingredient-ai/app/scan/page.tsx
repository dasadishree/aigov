"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Scan() {
    const router = useRouter();
    const [image, setImage] = useState<File | null>(null);

    async function handleUpload() {
        if(!image) return;

        const formData = new FormData();
        formData.append("image", image);

        await fetch("http://127.0.0.1:5000/scan", {
            method: "POST",
            body: formData,
        });
    }
    return(
        <main>
            <h1>Scan </h1>
            <input 
                type="file"
                accept="image/*"
                onChange={(e) => {
                    setImage(e.target.files?.[0] || null);
                }}
            />
            {image && <p>Image selected: {image.name}</p>}

            <button onClick={handleUpload} disabled={!image}>
                Upload Image
            </button>
        </main>
    );
}