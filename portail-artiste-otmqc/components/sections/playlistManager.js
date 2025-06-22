import { db } from "../../firebase.js";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getCurrentUser } from "../../auth.js";
export async function renderPlaylistManager(container, userId = "julz001") {
  const user = getCurrentUser();
  const isAdmin = user?.id === "admin";
  const targetUserId = isAdmin ? userId : user?.id;

  container.innerHTML = `
    <style>
      /* ... (identique à ton CSS précédent, garde-le tel quel) */
    </style>

    <h3 class="neon-section-title">Gestion des playlists Spotify 🎵</h3>
    ${isAdmin ? `
    <form id="addPlaylistForm" class="playlist-wrapper">
      <input type="url" id="playlistUrl" placeholder="Lien Spotify" required />
      <button type="submit">AJOUTER</button>
    </form>` : ''}
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

  urls.forEach((url, i) => {
    const embedUrl = convertToSpotifyEmbed(url);
    list.innerHTML += `
      <li>
        <iframe src="${embedUrl}" allow="encrypted-media"></iframe>
        ${getCurrentUser()?.id === "admin" ? `<button onclick="deletePlaylist('${userId}', '${url}')">❌</button>` : ""}
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
