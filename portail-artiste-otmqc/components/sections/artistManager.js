import { db } from "../../firebase.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export function renderArtistManager(container) {
  container.innerHTML = `
    <h3>Ajouter un nouvel artiste</h3>
    <form id="artistForm">
      <input type="text" id="nom" placeholder="Nom complet" required />
      <input type="text" id="id" placeholder="ID artiste (ex: julz001)" required />
      <input type="password" id="password" placeholder="Mot de passe" required />
      <button type="submit">Ajouter</button>
    </form>
    <p id="confirmation" style="color: limegreen; margin-top: 1rem;"></p>
  `;

  document.getElementById("artistForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nom = document.getElementById("nom").value.trim();
    const id = document.getElementById("id").value.trim().toLowerCase();
    const password = document.getElementById("password").value.trim();

    const data = {
      nom,
      id,
      password,
      createdAt: serverTimestamp()
    };

    try {
      await setDoc(doc(db, "artistes", id), data);
      document.getElementById("confirmation").innerHTML = `✅ Artiste <strong>${id}</strong> ajouté avec succès.`;
      e.target.reset();
    } catch (err) {
      document.getElementById("confirmation").innerHTML = `❌ Erreur : ${err.message}`;
    }
  });
}

