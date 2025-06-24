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
  paris:    { id: 2988507, label: "PARIS" },
  la:       { id: 5368361, label: "LOS ANGELES" }
};

export function renderDashboardAdmin(container) {
  container.innerHTML = `
    <style>
      :root {
        --neon: #00f0ff;
        --neon-soft: rgba(0, 240, 255, 0.06);
        --neon-border: rgba(0, 255, 255, 0.25);
      }
      .admin-wrapper { display:flex; min-height:100vh; }
      .sidebar {
        background:#0a0a0a; border-right:1px solid rgba(0,255,255,.2);
        padding:1rem; display:flex; flex-direction:column; gap:.9rem;
        min-width:220px; position:sticky; top:0; height:100vh; z-index:999;
        box-shadow:2px 0 15px rgba(0,255,255,.1);
      }
      .sidebar button {
        background:var(--neon-soft); border:1px solid var(--neon-border);
        color:var(--neon); font-family:'Orbitron',sans-serif;
        padding:.8rem 1rem; border-radius:10px; cursor:pointer; text-align:left;
        transition:.3s ease;
      }
      .sidebar button:hover { background:#00f0ff33; transform:scale(1.04); }
      .admin-main { flex:1; padding:2rem 1rem; display:flex; flex-direction:column; align-items:center; }
      h2.admin-title {
        font-size:2rem; color:var(--neon);
        text-shadow:0 0 14px var(--neon), 0 0 28px var(--neon);
        font-family:'Orbitron',sans-serif; margin-bottom:1.8rem; animation:fadeIn 1.2s ease-out;
        text-align:center;
      }
      .clock-section { display:flex; flex-wrap:wrap; justify-content:center; gap:2.2rem; margin-bottom:2rem; animation:fadeIn 1.6s ease-in; }
      .clock-box { text-align:center; min-width:110px; display:flex; flex-direction:column; align-items:center; gap:.4rem; }
      .clock-flag { width:50px; height:34px; border-radius:4px; box-shadow:0 0 12px var(--neon),0 0 4px #007d99; animation:tvGlitch 1.6s infinite alternate ease-in-out; }
      .clock-label { font-size:.80rem; color:#fffdd; letter-spacing:1.6px; font-family:'Orbitron',sans-serif; margin-top:3px; }
      .digital-clock {
        display:flex; align-items:center; justify-content:center;
        font-family:'DS-Digital','Orbitron',monospace;
        font-size:1.35rem; letter-spacing:2px; height:2.6ch; width:7.5ch;
        background:var(--neon-soft); border:1px solid var(--neon-border); border-radius:14px;
        color:var(--neon); text-shadow:0 0 9px var(--neon);
        box-shadow:inset 0 0 6px rgba(0,255,255,.18),0 0 14px rgba(0,255,255,.22);
        animation:pulseTime 4s ease-in-out infinite;
      }
      .weather { display:flex; flex-direction:column; align-items:center; gap:.2rem; margin-top:.4rem; }
      .weather-icon { width:46px; height:46px; filter:drop-shadow(0 0 4px var(--neon)); }
      .weather-temp { font-family:'Orbitron',sans-serif; font-size:.9rem; color:#ffffffee; }
      @keyframes tvGlitch { 0%{transform:scale(1)rotate(0)} 50%{transform:scale(1.02)rotate(-1deg)} 100%{transform:scale(.98)rotate(1deg)} }
      @keyframes pulseTime { 0%,100%{text-shadow:0 0 8px var(--neon),0 0 18px #007d99;} 50%{text-shadow:0 0 4px var(--neon),0 0 10px #007d99;} }
      @keyframes fadeIn { from{opacity:0;transform:translateY(18px);} to{opacity:1;transform:none;} }
      @media(max-width:768px){
        .admin-wrapper{flex-direction:column;}
        .sidebar{flex-direction:row; flex-wrap:wrap; justify-content:center; width:100%; height:auto; position:static; border-right:none; border-bottom:1px solid rgba(0,255,255,.2); box-shadow:0 2px 15px rgba(0,255,255,.1); padding:.5rem;}
        .sidebar button{flex:1 1 42%; text-align:center; font-size:.9rem; padding:.6rem;}
        .admin-main{padding:1rem .5rem;}
        .clock-section{gap:1.2rem;}
        .clock-box{width:32%; max-width:130px;}
        .clock-flag{width:36px; height:24px;}
        .digital-clock{font-size:1.1rem; width:100%;}
        .clock-label{font-size:.72rem;}
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
              <img class="clock-flag" src="${flagFor(key)}" alt="flag ${key}" />
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
      const [hh, mm, ss] = formatter.format(now).split(":");
      el.textContent = `${hh}:${mm}:${ss}`;
    });
  }
  updateClocks();
  setInterval(updateClocks, 1000);

  async function fetchWeather(cityId) {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${WEATHER_API_KEY}&units=metric&lang=fr`
    );
    if (!res.ok) throw new Error("Erreur météo");
    return res.json();
  }

  async function updateWeather() {
    for (const [key, { id }] of Object.entries(cities)) {
      try {
        const data = await fetchWeather(id);
        const temp = Math.round(data.main.temp);
        const iconCode = data.weather?.[0]?.icon || "";
        const tempEl = document.getElementById(`temp-${key}`);
        const iconEl = document.getElementById(`icon-${key}`);
        if (tempEl) tempEl.textContent = `${temp}°C`;
        if (iconEl) {
          iconEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
          iconEl.hidden = false;
        }
      } catch (err) {
        console.error(err);
      }
    }
  }
  updateWeather();
  setInterval(updateWeather, 10 * 60 * 1000);
}

function flagFor(key) {
  switch (key) {
    case "montreal":
      return "https://upload.wikimedia.org/wikipedia/commons/5/5f/Flag_of_Quebec.svg";
    case "paris":
      return "https://upload.wikimedia.org/wikipedia/en/c/c3/Flag_of_France.svg";
    case "la":
      return "https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg";
    default:
      return "";
  }
}
