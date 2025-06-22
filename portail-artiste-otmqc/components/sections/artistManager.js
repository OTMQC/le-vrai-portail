  import { db } from "../../firebase.js";
  import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

  export function renderArtistManager(container) {
    container.innerHTML = `
      <h3>Ajouter un nouvel artiste</h3>
      <form id="artistForm">
        <input type="text" id="name" placeholder="Nom complet" required />
        <input type="text" id="id" placeholder="ID artiste (ex: julz001)" required />
        <input type="password" id="password" placeholder="Mot de passe" required />
        <button type="submit">AJOUTER</button>
      </form>
      <p id="confirmation" style="color: lime; margin-top: 1rem;"></p>
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

