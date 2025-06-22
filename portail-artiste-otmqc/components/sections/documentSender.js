import { ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { storage, db } from "../../firebase.js";

export function renderDocumentSender(container) {
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

      .document-upload-wrapper {
        background: #0a0a0a;
        border: 1px solid rgba(0, 255, 255, 0.15);
        border-radius: 18px;
        padding: 1.5rem;
        max-width: 400px;
        width: 100%;
        margin: 0 auto;
        box-shadow: 0 0 25px rgba(0, 255, 255, 0.05);
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .document-upload-wrapper input[type="text"],
      .document-upload-wrapper input[type="file"] {
        background: #111;
        border: 1px solid #00f0ff55;
        border-radius: 12px;
        padding: 0.9rem 1rem;
        color: #fff;
        font-family: 'Orbitron', sans-serif;
        width: 100%;
        font-size: 0.9rem;
        box-shadow: inset 0 0 5px rgba(0,255,255,0.08);
      }

      .document-upload-wrapper input::placeholder {
        color: #888;
        font-size: 0.85rem;
      }

      .document-upload-wrapper button {
        width: 100%;
        padding: 0.9rem;
        background: #00f0ff;
        color: #000;
        font-weight: bold;
        border-radius: 14px;
        font-family: 'Orbitron', sans-serif;
        font-size: 1rem;
        transition: 0.3s ease;
        border: none;
        cursor: pointer;
      }

      .document-upload-wrapper button:hover {
        background: #00e0e0;
      }

      #uploadProgress {
        margin-top: 1rem;
        font-size: 0.9rem;
        font-family: 'Orbitron', sans-serif;
        text-align: center;
        color: #00f0ff;
      }
    </style>

    <h3 class="neon-section-title">Envoi de documents 📤</h3>

    <form id="documentForm" class="document-upload-wrapper">
      <input type="text" id="artistId" placeholder="ex: julz0201" required />
      <input type="file" id="fileInput" required />
      <button type="submit">TÉLÉVERSER</button>
      <div id="uploadProgress"></div>
    </form>
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
      uploadProgress.textContent = "⚠️ Veuillez remplir tous les champs.";
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
            🔗 <a href="${downloadURL}" target="_blank" style="color: #00f0ff; text-decoration: underline;">Voir le document</a>
          `;
        } catch (err) {
          console.error("Erreur Firestore:", err);
          uploadProgress.innerHTML = `<span style="color: red;">⚠️ Erreur Firestore.</span>`;
        }
      }
    );
  });
}
