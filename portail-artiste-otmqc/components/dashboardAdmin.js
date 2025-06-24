import { renderArtistManager } from "./sections/artistManager.js";
import { renderDocumentSender } from "./sections/documentSender.js";
import { renderPlaylistManager } from "./sections/playlistManager.js";
import { db } from "../firebase.js";
import { getCurrentUser } from "../auth.js";
import {
  collection,
  getDocs,
  query,
  deleteDoc,
  doc,
  where
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  ref,
  deleteObject
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const WEATHER_API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";
const cities = {
  montreal: { id: 6167865, label: "MONTRÉAL" },
  paris: { id: 2988507, label: "PARIS" },
  la: { id: 5368361, label: "LOS ANGELES" }
};

export function renderDashboardAdmin(container) {
  container.innerHTML = `
    <style>
      .admin-wrapper{display:flex;min-height:100vh}
      .sidebar{
        background:var(--surface);
        border-right:1px solid var(--border);
        padding:1rem;
        display:flex;
        flex-direction:column;
        gap:1rem;
        min-width:220px;
        position:sticky;
        top:0;
        height:100vh;
        z-index:999;
        box-shadow:2px 0 15px rgba(0,0,0,.25)
      }
      .sidebar button{
        background:rgba(255,255,255,.03);
        border:1px solid var(--border);
        color:var(--accent);
        font-family:var(--font);
        padding:.9rem 1rem;
        border-radius:var(--radius);
        cursor:pointer;
        text-align:left;
        transition:.3s ease
      }
      .sidebar button:hover{
        background:rgba(40,248,255,.12);
        transform:scale(1.04)
      }
      .admin-main{
        flex:1;
        padding:2rem 1rem;
        display:flex;
        flex-direction:column;
        align-items:center
      }
      h2.admin-title{
        font-size:2rem;
        color:var(--accent);
        text-shadow:0 0 10px var(--accent);
        font-family:var(--font);
        margin-bottom:2rem;
        animation:fadeIn .9s ease-out
      }
      .clock-section{
        display:flex;
        flex-wrap:wrap;
        justify-content:center;
        gap:2rem;
        margin-bottom:2rem;
        animation:fadeIn 1.1s ease-in
      }
      .clock-box{
        text-align:center;
        min-width:110px;
        display:flex;
        flex-direction:column;
        align-items:center;
        gap:.4rem
      }
      .clock-flag{
        width:50px;
        height:34px;
        border-radius:4px;
        box-shadow:0 0 12px var(--accent);
        animation:tvGlitch 1.8s infinite alternate
      }
      .clock-label{
        font-size:.82rem;
        color:var(--text-primary);
        letter-spacing:1.4px;
        font-family:var(--font)
      }
      .digital-clock{
        display:flex;
        align-items:center;
        justify-content:center;
        font-family:var(--font);
        font-size:1.35rem;
        letter-spacing:2px;
        height:2.6ch;
        width:7.5ch;
        background:rgba(40,248,255,.07);
        border:1px solid var(--border);
        border-radius:var(--radius);
        color:var(--accent);
        text-shadow:0 0 8px var(--accent);
        box-shadow:inset 0 0 6px rgba(40,248,255,.18),0 0 13px rgba(40,248,255,.24);
        animation:pulseTime 4s ease-in-out infinite
      }
      .weather{
        display:flex;
        flex-direction:column;
        align-items:center;
        gap:.3rem;
        margin-top:.4rem
      }
      .weather-icon{
        width:46px;
        height:46px;
        filter:drop-shadow(0 0 4px var(--accent))
      }
      .weather-temp{
        font-family:var(--font);
        font-size:.9rem;
        color:var(--text-primary)
      }
      @keyframes tvGlitch{
        0%{transform:scale(1)rotate(0deg)}
        50%{transform:scale(1.02)rotate(-1deg)}
        100%{transform:scale(.98)rotate(1deg)}
      }
      @keyframes pulseTime{
        0%,100%{text-shadow:0 0 8px var(--accent),0 0 18px #0099a6}
        50%{text-shadow:0 0 4px var(--accent),0 0 10px #0099a6}
      }
      @keyframes fadeIn{
        from{opacity:0;transform:translateY(20px)}
        to{opacity:1;transform:translateY(0)}
      }
      @media(max-width:768px){
        .admin-wrapper{flex-direction:column}
        .sidebar{
          flex-direction:row;
          flex-wrap:wrap;
          justify-content:center;
          width:100%;
          height:auto;
          position:static;
          border-right:none;
          border-bottom:1px solid var(--border);
          box-shadow:0 2px 15px rgba(0,0,0,.25);
          padding:.5rem
        }
        .sidebar button{
          flex:1 1 45%;
          text-align:center;
          font-size:.9rem;
          padding:.7rem
        }
        .admin-main{padding:1rem .5rem}
        .clock-section{gap:1.2rem}
        .clock-box{width:32%;max-width:130px}
        .clock-flag{width:36px;height:24px}
        .digital-clock{font-size:1.1rem;width:100%}
        .clock-label{font-size:.74rem}
      }
    </style>

    <div class="admin-wrapper">
      <div class="sidebar">
        <button id="btnAddArtist">AJOUTER UN ARTISTE</button>
        <button id="btnSendDocs">GESTION DES DOCUMENTS</button>
        <button id="btnManagePlaylists">PLAYLISTS</button>
      </div>
      <div class="admin-main">
        <h2 class="admin-title">Nœud Central d’Opérations — OTMQC</h2>
        <div class="clock-section">
          ${Object.keys(cities)
            .map(
              key => `
            <div class="clock-box" id="box-${key}">
              <img class="clock-flag" src="${flagFor(key)}" alt="" />
              <div class="clock-label">${cities[key].label}</div>
              <span id="clock-${key}" class="digital-clock">--:--:--</span>
              <div class="weather">
                <img id="icon-${key}" class="weather-icon" src="" alt="" hidden />
                <div id="temp-${key}" class="weather-temp">--</div>
              </div>
            </div>`
            )
            .join("")}
        </div>
        <div id="adminContent"></div>
      </div>
    </div>
  `;

  const content = document.getElementById("adminContent");
  document.getElementById("btnAddArtist").addEventListener("click", () => renderArtistManager(content));
  document.getElementById("btnSendDocs").addEventListener("click", () => renderDocumentSender(content));
  document.getElementById("btnManagePlaylists").addEventListener("click", () => renderPlaylistManager(content));

  function updateClocks() {
    const now = new Date();
    const zones = { montreal: "America/Toronto", paris: "Europe/Paris", la: "America/Los_Angeles" };
    Object.entries(zones).forEach(([key, zone]) => {
      const el = document.getElementById(`clock-${key}`);
      if (!el) return;
      const formatter = new Intl.DateTimeFormat("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: zone
      });
      el.textContent = formatter.format(now).replace(/:/g, ":");
    });
  }
  updateClocks();
  setInterval(updateClocks, 1000);

  async function fetchWeather(cityId) {
    const res = await fetch(
      \`https://api.openweathermap.org/data/2.5/weather?id=\${cityId}&appid=\${WEATHER_API_KEY}&units=metric&lang=fr\`
    );
    if (!res.ok) throw new Error("weather");
    return res.json();
  }

  async function updateWeather() {
    for (const [key, { id }] of Object.entries(cities)) {
      try {
        const data = await fetchWeather(id);
        const temp = Math.round(data.main.temp);
        const iconCode = data.weather?.[0]?.icon || "";
        const tempEl = document.getElementById(\`temp-\${key}\`);
        const iconEl = document.getElementById(\`icon-\${key}\`);
        if (tempEl) tempEl.textContent = \`\${temp}°C\`;
        if (iconEl) {
          iconEl.src = \`https://openweathermap.org/img/wn/\${iconCode}@2x.png\`;
          iconEl.hidden = false;
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
  updateWeather();
  setInterval(updateWeather, 600000);
}

function flagFor(key) {
  if (key === "montreal") return "https://upload.wikimedia.org/wikipedia/commons/5/5f/Flag_of_Quebec.svg";
  if (key === "paris") return "https://upload.wikimedia.org/wikipedia/en/c/c3/Flag_of_France.svg";
  if (key === "la") return "https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg";
  return "";
}
