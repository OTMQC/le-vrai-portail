import { db } from "../firebase.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export function renderArtistCreator(container) {
  container.innerHTML = `
    <h3>Créer un nouvel artiste ✍️</h3>
    <form id="artistForm" class="fade-in">
      <input type="text" id="id" placeholder="Identifiant (ex: julz001)" required />
      <input type="password" id="password" placeholder="Mot de passe" required />
      <input type="text" id="nom" placeholder="Nom complet" required />
      <input type="text" id="pin" placeholder="PIN (ex: 0201)" required />
      <input type="date" id="dateNaissance" placeholder="Date de naissance" required />
      <input type="date" id="dateSignature" placeholder="Date de signature" required />
      <button type="submit">Ajouter l’artiste</button>
    </form>
    <p id="result" style="margin-top: 1rem;"></p>
  `;

  const form = document.getElementById("artistForm");
  const result = document.getElementById("result");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = form.id.value.trim().toLowerCase();
    const data = {
      id,
      password: form.password.value,
      nom: form.nom.value,
      pin: form.pin.value,
      dateNaissance: form.dateNaissance.value,
      dateSignature: form.dateSignature.value,
      createdAt: serverTimestamp()
    };

    try {
      await setDoc(doc(db, "artistes", id), data);
      result.innerHTML = `<span style="color: limegreen;">✅ Artiste <strong>${id}</strong> ajouté avec succès !</span>`;
      form.reset();
    } catch (error) {
      console.error(error);
      result.innerHTML = `<span style="color: red;">❌ Erreur : ${error.message}</span>`;
    }
  });
}

