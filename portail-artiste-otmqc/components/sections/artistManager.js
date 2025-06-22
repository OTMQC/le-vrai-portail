import { db } from "../../firebase.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export function renderArtistManager(container) {
  container.innerHTML = `
    <style>
      .neon-section-title {
        font-family: 'Orbitron', sans-serif;
        color: #00f0ff;
        text-align: center;
        font-size: 1.3rem;
        text-shadow: 0 0 6px #00f0ff, 0 0 12px #00f0ff;
        margin-bottom: 1.5rem;
      }

      .artist-form-wrapper {
        background: #0a0a0a;
        border: 1px solid rgba(0, 255, 255, 0.15);
        border-radius: 18px;
        padding: 1.5rem;
        max-width: 400px;
        margin: 0 auto;
        box-shadow: 0 0 25px rgba(0, 255, 255, 0.05);
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .artist-form-wrapper input {
        background: #111;
        border: 1px solid #00f0ff55;
        border-radius: 12px;
        padding: 0.9rem 1rem;
        color: #fff;
        font-family: 'Orbitron', sans-serif;
        font-size: 0.9rem;
      }

      .artist-form-wrapper input::placeholder {
        color: #888;
        font-size: 0.85rem;
      }

      .artist-form-wrapper button {
        width: 100%;
        padding: 0.9rem;
        background: #00f0ff;
        color: #000;
        font-weight: bold;
        border-radius: 14px;
        font-family: 'Orbitron', sans-serif;
        font-size: 1rem;
        border: none;
        cursor: pointer;
      }

      .artist-form-wrapper button:hover {
        background: #00e0e0;
      }

      #confirmation {
        font-family: 'Orbitron', sans-serif;
        text-align: center;
        margin-top: 1rem;
      }
    </style>

    <h3 class="neon-section-title">Ajouter un nouvel artiste</h3>
    <form id="artistForm" class="artist-form-wrapper">
      <input type="text" id="name" placeholder="Nom complet" required />
      <input type="text" id="id" placeholder="ID artiste (ex: julz001)" required />
      <input type="password" id="password" placeholder="Mot de passe" required />
      <button type="submit">AJOUTER</button>
      <p id="confirmation"></p>
    </form>
  `;

  document.getElementById("artistForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const artist = {
      name: document.getElementById("name").value.trim(),
      id: document.getElementById("id").value.trim().toLowerCase(),
      password: document.getElementById("password").value.trim(),
      createdAt: serverTimestamp(),
    };

    try {
      await setDoc(doc(db, "artistes", artist.id), artist);
      document.getElementById("artistForm").reset();
      document.getElementById("confirmation").textContent = `✅ Artiste ${artist.id} enregistré !`;
    } catch (error) {
      console.error("Erreur:", error);
      document.getElementById("confirmation").textContent = `❌ Erreur : ${error.message}`;
    }
  });
}
