import { getCurrentUser } from "../auth.js";

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

      .dashboard-artiste button {
        margin-top: 1.5rem;
        padding: 0.75rem 1.5rem;
        background: #00f0ff22;
        border: 1px solid #00f0ff55;
        border-radius: 8px;
        color: #00f0ff;
        font-family: 'Orbitron', sans-serif;
        cursor: pointer;
        transition: 0.3s ease;
      }

      .dashboard-artiste button:hover {
        background: #00f0ff44;
        transform: scale(1.05);
      }

      #artistContent {
        margin-top: 2rem;
      }
    </style>

    <div class="dashboard-artiste">
      <h2>Bienvenue ${user?.name || "Artiste"} 🎤</h2>
      <p>ID : ${user?.id}</p>
      <p>Date de signature : ${user?.signatureDate}</p>
      <button id="btnViewPlaylists">🎧 Voir les playlists</button>
      <div id="artistContent"></div>
    </div>
  `;

  document.getElementById("btnViewPlaylists").onclick = () =>
    showPlaylists(document.getElementById("artistContent"));
}

