"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  
  return (
    <main>
      <div className="grid-pattern"></div>
      <div id="centered-content">
        <h1>beyond the box:</h1>
        <h2>eat informed</h2>
        <button id="start-button"
          onClick={() => router.push("/choose")}>
            START NOW
          </button>
      </div>

      <div id="did-you-know">
        <h3>DID YOU KNOW?</h3>
        <p>Natural flavor can mean hundreds of different compounds, and companies don't have to list them individually.</p>
      </div>
      <img src="/labelpile.png" alt="Label pile image for decoration." id="labelPile1" />
      <img src="/labelpile2.webp" alt="Label pile image for decoration." id="labelPile2" />
    </main>
  );
}
