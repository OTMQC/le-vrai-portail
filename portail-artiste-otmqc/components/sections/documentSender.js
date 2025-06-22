import { ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { db } from "../../firebase.js";

export function renderDocumentSender(container) {
  container.innerHTML = `
    <h3>Envoi de documents 📤</h3>
    <form id="documentForm" class="fade-in">
      <label for="artistId">ID Artiste :</label>
      <input type="text" id="artistId" placeholder="ex: julz0201" required />

      <label for="fileInput">Fichier :</label>
      <input type="file" id="fileInput" required />

      <button type="submit">Téléverser</button>
    </form>
    <div id="uploadProgress" style="margin-top: 1rem; font-size: 0.95rem;"></div>
  `;

  const form = document.getElementById("documentForm");
  const fileInput = document.getElementById("fileInput");
  const artistInput = document.getElementById("artistId");
  const uploadProgress = document.getElementById("uploadProgress");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const file = fileInput.files[0];
    const artistId = artistInput.value.trim();

    if (!file || !artistId) {
      uploadProgress.textContent = "Veuillez remplir tous les champs.";
      return;
    }

    const timestamp = Date.now();
    const fileRef = ref(storage, `documents/${artistId}/${timestamp}_${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadProgress.textContent = "⏳ Téléversement en cours...";

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        uploadProgress.innerHTML = `📡 Progression : <strong>${progress.toFixed(1)}%</strong>`;
      },
      (error) => {
        console.error("Erreur:", error);
        uploadProgress.innerHTML = `<span style="color: red;">❌ Échec du téléversement</span>`;
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          await addDoc(collection(db, "documents"), {
            artistId,
            fileName: file.name,
            fileUrl: downloadURL,
            uploadedAt: serverTimestamp()
          });

          uploadProgress.innerHTML = `
            ✅ <strong>Fichier enregistré !</strong><br/>
            🔗 <a href="${downloadURL}" target="_blank" style="color: var(--accent); text-decoration: underline;">Voir</a>
          `;
        } catch (err) {
          console.error("Erreur Firestore:", err);
          uploadProgress.innerHTML = `<span style="color: red;">⚠️ Erreur Firestore.</span>`;
        }
      }
    );
  });
}

