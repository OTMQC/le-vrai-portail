import { renderArtistManager } from "./sections/artistManager.js";
import { renderDocumentSender } from "./sections/documentSender.js";
import { renderPlaylistManager } from "./sections/playlistManager.js";


export function renderDashboardAdmin(container) {
  container.innerHTML = `
    <style>
      .admin-wrapper {
        display: flex;
        flex-direction: row;
        min-height: 100vh;
      }

      .sidebar {
        background: #0a0a0a;
        border-right: 1px solid rgba(0, 255, 255, 0.2);
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        min-width: 220px;
        position: sticky;
        top: 0;
        height: 100vh;
        z-index: 999;
        box-shadow: 2px 0 15px rgba(0, 255, 255, 0.1);
      }

      .sidebar button {
        background: #00f0ff22;
        border: 1px solid #00f0ff55;
        color: #00f0ff;
        font-family: 'Orbitron', sans-serif;
        padding: 0.8rem 1rem;
        border-radius: 8px;
        cursor: pointer;
        text-align: left;
        transition: 0.3s ease;
      }

      .sidebar button:hover {
        background: #00f0ff44;
        transform: scale(1.03);
      }

      .admin-main {
        flex: 1;
        padding: 2rem 1rem;
      }

      h2.admin-title {
        font-size: 1.8rem;
        text-shadow: 0 0 10px var(--accent);
        text-align: center;
        color: #00f0ff;
        margin-bottom: 1.5rem;
      }

      .clock-section {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 2rem;
        margin-bottom: 2.5rem;
      }

      .clock-box {
        text-align: center;
        min-width: 110px;
      }

      .clock-label {
        font-size: 0.8rem;
        color: #ffffffdd;
        letter-spacing: 1.5px;
        font-family: 'Orbitron', sans-serif;
        margin-top: 5px;
      }

      .digital-clock {
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Orbitron', monospace;
        font-size: 1.3rem;
        width: 6.6ch;
        height: 2.5ch;
        background: rgba(0, 240, 255, 0.06);
        border: 1px solid rgba(0, 255, 255, 0.25);
        border-radius: 12px;
        color: #00f0ff;
        text-shadow: 0 0 8px #00f0ff;
        box-shadow:
          inset 0 0 5px rgba(0, 255, 255, 0.15),
          0 0 12px rgba(0, 255, 255, 0.2);
        animation: pulseTime 4s ease-in-out infinite;
      }

      @keyframes pulseTime {
        0%, 100% {
          text-shadow: 0 0 8px #00f0ff, 0 0 20px #007d99;
        }
        50% {
          text-shadow: 0 0 4px #00f0ff, 0 0 10px #007d99;
        }
      }

      .clock-flag {
        margin-bottom: 5px;
      }

      @media (max-width: 768px) {
        .admin-wrapper {
          flex-direction: column;
        }

        .sidebar {
          flex-direction: row;
          justify-content: space-around;
          position: sticky;
          top: 0;
          width: 100%;
          height: auto;
          box-shadow: 0 2px 15px rgba(0, 255, 255, 0.1);
          border-right: none;
          border-bottom: 1px solid rgba(0, 255, 255, 0.2);
        }

        .sidebar button {
          flex: 1;
          text-align: center;
        }
      }
    </style>

    <div class="admin-wrapper">
      <div class="sidebar">
        <button id="btnAddArtist">➕ Ajouter un artiste</button>
        <button id="btnSendDocs">📁 Documents</button>
        <button id="btnManagePlaylists">🎶 Playlists</button>
      </div>
      <div class="admin-main">
        <h2 class="admin-title">Console centrale d'administration OTMQC</h2>
        <div class="clock-section">
          <div class="clock-box">
            <img class="clock-flag" src="https://flagcdn.com/ca.svg" width="28" height="18" alt="CA" />
            <div class="clock-label">MONTRÉAL</div>
            <span id="clock-montreal" class="digital-clock">--:--:--</span>
          </div>
          <div class="clock-box">
            <img class="clock-flag" src="https://flagcdn.com/fr.svg" width="28" height="18" alt="FR" />
            <div class="clock-label">PARIS</div>
            <span id="clock-paris" class="digital-clock">--:--:--</span>
          </div>
          <div class="clock-box">
            <img class="clock-flag" src="https://flagcdn.com/us.svg" width="28" height="18" alt="US" />
            <div class="clock-label">LOS ANGELES</div>
            <span id="clock-la" class="digital-clock">--:--:--</span>
          </div>
          <div class="clock-box">
            <img class="clock-flag" src="https://flagcdn.com/gb.svg" width="28" height="18" alt="GB" />
            <div class="clock-label">LONDRES</div>
            <span id="clock-london" class="digital-clock">--:--:--</span>
          </div>
          <div class="clock-box">
            <img class="clock-flag" src="https://flagcdn.com/jp.svg" width="28" height="18" alt="JP" />
            <div class="clock-label">TOKYO</div>
            <span id="clock-tokyo" class="digital-clock">--:--:--</span>
          </div>
        </div>
        <div id="adminContent"></div>
      </div>
    </div>
  `;

  const content = document.getElementById("adminContent");

  document.getElementById("btnAddArtist").addEventListener("click", () => {
    renderArtistManager(content);
  });

  document.getElementById("btnSendDocs").addEventListener("click", () => {
    renderDocumentSender(content);
  });

  document.getElementById("btnManagePlaylists").addEventListener("click", () => {
    renderPlaylistManager(content);
  });

  function updateClocks() {
    const now = new Date();
    const timeZones = {
      montreal: 'America/Toronto',
      paris: 'Europe/Paris',
      la: 'America/Los_Angeles',
      london: 'Europe/London',
      tokyo: 'Asia/Tokyo',
    };

    Object.entries(timeZones).forEach(([id, zone]) => {
      const el = document.getElementById(`clock-${id}`);
      if (el) {
        const formatter = new Intl.DateTimeFormat('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: zone,
        });

        const timeParts = formatter.formatToParts(now);
        const hh = timeParts.find(p => p.type === 'hour')?.value || '--';
        const mm = timeParts.find(p => p.type === 'minute')?.value || '--';
        const ss = timeParts.find(p => p.type === 'second')?.value || '--';

        el.innerHTML = `${hh}<span>:</span>${mm}<span>:</span>${ss}`;
      }
    });
  }

  updateClocks();
  setInterval(updateClocks, 1000);
}
