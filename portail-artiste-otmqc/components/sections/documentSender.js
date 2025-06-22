import { ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { storage, db } from "../../firebase.js";

export function renderDocumentSender(container) {
  container.innerHTML = `
    <style>
      .document-upload-wrapper {
        background: #0a0a0a;
        border: 1px solid rgba(0, 255, 255, 0.15);
        border-radius: 18px;
        padding: 1.2rem;
        margin-top: 2rem;
        max-width: 450px;
        width: 100%;
        box-shadow: 0 0 20px rgba(0, 255, 255, 0.05);
        animation: fadeIn 1.2s ease-in-out;
      }

      .document-upload-wrapper label {
        display: block;
        margin-bottom: 0.4rem;
        color: #00f0ff;
        font-family: 'Orbitron', sans-serif;
        font-size: 0.85rem;
      }

      .document-upload-wrapper input[type="text"],
      .document-upload-wrapper input[type="file"] {
        background: #111;
        border: 1px solid #00f0ff55;
        border-radius: 12px;
        padding: 0.8rem 1rem;
        color: #fff;
        font-family: 'Orbitron', sans-serif;
        width: 100%;
        margin-bottom: 1rem;
        box-shadow: inset 0 0 5px rgba(0,255,255,0.1);
      }

      .document-upload-wrapper input[type="file"] {
        padding: 0.6rem 0.5rem;
        font-size: 0.9rem;
        background: #1a1a1a;
        color: #00f0ff;
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
        font-size: 0.95rem;
        font-family: 'Orbitron', sans-serif;
        color: #00f0ff;
        text-align: center;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    </style>

    <div class="document-upload-wrapper">
      <form id="documentForm">
        <label for="artistId">ID Artiste :</label>
        <input type="text" id="artistId" placeholder="ex: julz0201" required />

        <label for="fileInput">Fichier :</label>
        <input type="file" id="fileInput" required />

        <button type="submit">TÉLÉVERSER</button>
      </form>
      <div id="uploadProgress"></div>
    </div>
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
