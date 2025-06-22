import { db } from "../../firebase.js";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getCurrentUser } from "../../auth.js";

export async function renderPlaylistManager(container) {
  const user = getCurrentUser();
  const isAdmin = user?.id === "admin";
  const targetUserId = "global";

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

      .playlist-wrapper {
        background: #0a0a0a;
        border: 1px solid rgba(0, 255, 255, 0.15);
        border-radius: 18px;
        padding: 1.5rem;
        max-width: 400px;
        margin: 0 auto;
        box-shadow: 0 0 25px rgba(0, 255, 255, 0.05);
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .playlist-wrapper input[type="url"] {
        background: #111;
        border: 1px solid #00f0ff55;
        border-radius: 12px;
        padding: 0.9rem 1rem;
        color: #fff;
        font-family: 'Orbitron', sans-serif;
        font-size: 0.9rem;
      }

      .playlist-wrapper input::placeholder {
        color: #888;
        font-size: 0.85rem;
      }

      .playlist-wrapper button {
        width: 100%;
        padding: 0.9rem;
        background: #00f0ff;
        color: #000;
        font-weight: bold;
        border-radius: 14px;
        font-family: 'Orbitron', sans-serif;
        font-size: 1rem;
        border: none;
        cursor: pointer;
      }

      .playlist-wrapper button:hover {
        background: #00e0e0;
      }

      #playlistList {
        font-family: 'Orbitron', sans-serif;
        font-size: 0.9rem;
        color: #00f0ff;
        margin-top: 1rem;
        list-style: none;
        padding-left: 0;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      #playlistList li {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        background: #101010;
        border: 1px solid #00f0ff33;
        padding: 1rem;
        border-radius: 12px;
      }

      #playlistList iframe {
        border-radius: 10px;
        border: none;
        width: 100%;
        max-width: 320px;
        height: 80px;
        display: block;
        margin: auto;
      }

      #playlistList button {
        background: transparent;
        color: red;
        border: none;
        cursor: pointer;
        font-size: 1.2rem;
        position: absolute;
        top: 8px;
        right: 12px;
      }
    </style>

    <h3 class="neon-section-title">Gestion des playlists Spotify 🎵</h3>
    ${isAdmin ? `
      <form id="addPlaylistForm" class="playlist-wrapper">
        <input type="url" id="playlistUrl" placeholder="Lien Spotify" required />
        <button type="submit">AJOUTER</button>
      </form>
    ` : ''}
    <ul id="playlistList"></ul>
  `;

  await loadPlaylists(targetUserId);

  if (isAdmin) {
    document.getElementById("addPlaylistForm").onsubmit = (e) => addPlaylist(e, targetUserId);
  }
}

async function addPlaylist(e, userId) {
  e.preventDefault();
  const url = document.getElementById("playlistUrl").value;
  const docRef = doc(db, "playlists", userId);
  await setDoc(docRef, {
    urls: arrayUnion(url)
  }, { merge: true });

  await loadPlaylists(userId);
  e.target.reset();
}

async function loadPlaylists(userId) {
  const list = document.getElementById("playlistList");
  list.innerHTML = "";

  const docRef = doc(db, "playlists", userId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists() || !docSnap.data().urls?.length) {
    list.innerHTML = "<p style='text-align:center;color:#888;'>Aucune playlist ajoutée.</p>";
    return;
  }

  const urls = docSnap.data().urls;

  urls.forEach((url) => {
    const embedUrl = convertToSpotifyEmbed(url);
    list.innerHTML += `
      <li>
        <iframe src="${embedUrl}" allow="encrypted-media"></iframe>
        ${getCurrentUser()?.id === "admin" ? `<button onclick="deletePlaylist('${userId}', \`${url}\`)">❌</button>` : ""}
      </li>`;
  });
}

function convertToSpotifyEmbed(url) {
  if (!url.includes("spotify.com/playlist/")) return url;
  const id = url.split("/playlist/")[1]?.split("?")[0];
  return `https://open.spotify.com/embed/playlist/${id}?utm_source=generator&theme=0`;
}

window.deletePlaylist = async (userId, url) => {
  const docRef = doc(db, "playlists", userId);
  await updateDoc(docRef, {
    urls: arrayRemove(url)
  });
  await loadPlaylists(userId);
};
