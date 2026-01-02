"use client";
import { useRouter } from "next/navigation";

export default function Choose() {
    const router = useRouter();

    return (
        <main className="choose-page">
            <h1>How would you like to input your ingredient list to analyze?</h1>

            <div className="button-group">
                <button onClick={() => router.push("/paste")}>
                Paste Ingredient List
                </button>

                <button onClick={() => router.push("/scan")}>
                    Scan Ingredient Label
                </button>
            </div>
        </main>
    );
}