import { getCurrentUser } from "../auth.js";
import { renderPlaylistManager } from "./sections/playlistManager.js";

export function renderDashboardArtiste(container) {
  const user = getCurrentUser();
  container.innerHTML = `
    <style>
      .dashboard-artiste {
        max-width: 600px;
        margin: 4rem auto 2rem;
        padding: 2rem;
        background: rgba(0, 240, 255, 0.03);
        border: 1px solid rgba(0, 240, 255, 0.15);
        border-radius: 12px;
        text-align: center;
        box-shadow: 0 0 20px rgba(0, 240, 255, 0.05);
        font-family: 'Orbitron', sans-serif;
        animation: fadeSlideIn 1s ease-out forwards;
        opacity: 0;
        transform: translateY(20px);
      }

      @keyframes fadeSlideIn {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .dashboard-artiste h2 {
        font-size: 1.7rem;
        color: #00f0ff;
        text-shadow: 0 0 8px #00f0ff;
        margin-bottom: 1rem;
      }

      .dashboard-artiste p {
        font-size: 1rem;
        color: #ffffffcc;
        margin: 0.4rem 0;
      }

      .dashboard-artiste button,
      .dashboard-artiste a.button-link {
        margin-top: 1.2rem;
        display: inline-block;
        padding: 0.75rem 1.5rem;
        background: #00f0ff22;
        border: 1px solid #00f0ff55;
        border-radius: 8px;
        color: #00f0ff;
        font-family: 'Orbitron', sans-serif;
        font-size: 0.95rem;
        cursor: pointer;
        text-decoration: none;
        transition: 0.3s ease;
        margin-left: 0.5rem;
        margin-right: 0.5rem;
      }

      .dashboard-artiste button:hover,
      .dashboard-artiste a.button-link:hover {
        background: #00f0ff44;
        transform: scale(1.05);
      }

      #artistContent {
        margin-top: 2rem;
      }

      .notif-box {
        margin-top: 3rem;
        padding: 1.2rem;
        border-radius: 10px;
        border: 1px dashed #00f0ff66;
        background: rgba(0, 240, 255, 0.04);
        color: #00f0ffbb;
        font-size: 0.9rem;
        line-height: 1.5;
        animation: fadeNotif 1.5s ease-in-out;
      }

      @keyframes fadeNotif {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }

      @media (max-width: 500px) {
        .dashboard-artiste button,
        .dashboard-artiste a.button-link {
          width: 100%;
          margin: 0.5rem 0;
        }
      }
    </style>

    <div class="dashboard-artiste">
      <h2>Bienvenue ${user?.name || "Artiste"} 🎤</h2>
      <p>ID : ${user?.id}</p>

      <button id="btnViewPlaylists">VOIR LES PLAYLISTS</button>

      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSeZpWUqmZrxXZUQzb-qzTaa7j22S3CmhrdUX7SBUrZgBp4nsA/viewform"
        target="_blank"
        class="button-link"
      >
        FORMULAIRE DE DISTRIBUTION
      </a>

      <a
        href="mailto:julien@onthemapqc.com"
        class="button-link"
      >
        CONTACTER LE SUPPORT
      </a>

      <div id="artistContent"></div>

      <div class="notif-box">
        🛎️ Info : N’oublie pas de remplir ton formulaire de distribution à temps pour apparaître dans la prochaine sortie hebdomadaire. <br />
        En cas de question, contacte-nous à tout moment.
      </div>
    </div>
  `;

  document.getElementById("btnViewPlaylists").onclick = () =>
  renderPlaylistManager(document.getElementById("artistContent"), user.id);
}
