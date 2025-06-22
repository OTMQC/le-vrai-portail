import { renderArtistManager } from "./sections/artistManager.js";
import { renderDocumentSender } from "./sections/documentSender.js";
import { renderPlaylistManager } from "./sections/playlistManager.js";
import { db, storage } from "../firebase.js";
import { collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { ref, deleteObject } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

export function renderDashboardAdmin(container) {
  container.innerHTML = `
    <style>
      .dashboard-artiste {
        max-width: 720px;
        margin: 4rem auto 2rem;
        padding: 2rem;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        box-shadow: var(--glow);
        text-align: center;
        font-family: 'Orbitron', sans-serif;
        animation: fadeSlideIn 1s ease-out forwards;
        opacity: 0;
        transform: translateY(20px);
        backdrop-filter: var(--blur);
      }

      @keyframes fadeSlideIn {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .dashboard-artiste h2 {
        font-size: 1.9rem;
        color: var(--accent);
        text-shadow: 0 0 10px var(--accent);
        margin-bottom: 1rem;
      }

      .dashboard-artiste p {
        font-size: 1rem;
        color: var(--text-secondary);
        margin: 0.3rem 0;
      }

      .dashboard-artiste button,
      .dashboard-artiste a.button-link {
        margin-top: 1.2rem;
        display: inline-block;
        padding: 0.8rem 1.6rem;
        background: linear-gradient(145deg, rgba(0,255,255,0.05), rgba(0,255,255,0.08));
        border: 1px solid var(--border);
        border-radius: var(--radius);
        color: var(--accent);
        font-size: 0.95rem;
        font-family: 'Orbitron', sans-serif;
        cursor: pointer;
        text-decoration: none;
        box-shadow: 0 0 12px rgba(0,255,255,0.15);
        transition: all 0.3s ease;
        margin-left: 0.5rem;
        margin-right: 0.5rem;
        text-transform: uppercase;
      }

      .dashboard-artiste button:hover,
      .dashboard-artiste a.button-link:hover {
        background: var(--accent);
        color: #000;
        box-shadow: 0 0 25px rgba(0,255,255,0.5);
        transform: scale(1.05);
      }

      #artistContent {
        margin-top: 2rem;
      }

      .notif-box {
        margin-top: 3rem;
        padding: 1.2rem 1.5rem;
        border-radius: var(--radius);
        border: 1px dashed var(--accent);
        background: rgba(0,255,255,0.03);
        color: var(--accent);
        font-size: 0.9rem;
        line-height: 1.6;
        text-shadow: 0 0 5px rgba(0,255,255,0.3);
        box-shadow: inset 0 0 8px rgba(0,255,255,0.06);
      }

      #documentList {
        margin-top: 1.5rem;
        font-family: 'Orbitron', sans-serif;
        text-align: left;
        color: var(--accent);
      }

      #documentList a {
        display: block;
        color: #00f0ff;
        text-decoration: underline;
        margin-bottom: 0.7rem;
      }

      @media (max-width: 500px) {
        .dashboard-artiste button,
        .dashboard-artiste a.button-link {
          width: 100%;
          margin: 0.5rem 0;
        }

        .dashboard-artiste {
          padding: 1.2rem;
        }
      }
    </style>

    <div class="dashboard-artiste">
      <h2>Bienvenue ${user?.name || "Artiste"} 🎤</h2>
      <p>ID : ${user?.id}</p>

      <button id="btnViewPlaylists">VOIR LES PLAYLISTS</button>
      <button id="btnViewDocuments">MES DOCUMENTS</button>

      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSeZpWUqmZrxXZUQzb-qzTaa7j22S3CmhrdUX7SBUrZgBp4nsA/viewform"
        target="_blank"
        class="button-link"
      >
        FORMULAIRE DE DISTRIBUTION
      </a>

      <a href="mailto:julien@onthemapqc.com" class="button-link">
        CONTACTER LE SUPPORT
      </a>

      <div id="artistContent"></div>

      <div class="notif-box">
        🛎️ Info : N’oublie pas de remplir ton formulaire de distribution à temps pour apparaître plus rapidement sur les plateformes. <br />
        En cas de question, contacte-nous à tout moment.
      </div>
    </div>
  `;

  document.getElementById("btnViewPlaylists").onclick = () =>
    renderPlaylistManager(document.getElementById("artistContent"), user.id);

  document.getElementById("btnViewDocuments").onclick = () =>
    renderArtistDocuments(document.getElementById("artistContent"), user.id);
}

async function renderArtistDocuments(container, userId) {
  container.innerHTML = `<h3 class="neon-section-title">Mes Documents 🔐</h3><div id="documentList">Chargement...</div>`;
  const docList = document.getElementById("documentList");

  const q = query(collection(db, "documents"), where("artistId", "==", userId));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    docList.innerHTML = "<p style='color:#888;'>Aucun document disponible.</p>";
    return;
  }

  docList.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    const link = document.createElement("a");
    link.href = data.fileUrl;
    link.target = "_blank";
    link.textContent = `📄 ${data.fileName}`;
    docList.appendChild(link);
  });
}
