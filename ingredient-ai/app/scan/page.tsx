"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Scan() {
    const router = useRouter();
    const [image, setImage] = useState<File | null>(null);

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

            <button disabled={!image}>
                Upload Image

                async fun
            </button>
        </main>
    );
}