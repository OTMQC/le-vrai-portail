import { getCurrentUser } from "../auth.js";

export function renderDashboardArtiste(container) {
  const user = getCurrentUser();
  container.innerHTML = `
    <h2>Bienvenue ${user?.name || "Artiste"} 🎤</h2>
    <p>ID : ${user?.id}</p>
    <p>Date de signature : ${user?.signatureDate}</p>

    <button id="btnViewPlaylists">🎧 Voir les playlists</button>
    <div id="artistContent" style="margin-top: 2rem;"></div>
  `;

  document.getElementById("btnViewPlaylists").onclick = () => showPlaylists(document.getElementById("artistContent"));
}
