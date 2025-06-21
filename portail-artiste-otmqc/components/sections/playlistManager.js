export function renderPlaylistManager(container, userId = "julz001") {
  container.innerHTML = `
    <h3>Gestion des playlists Spotify 🎵</h3>
    <form id="addPlaylistForm">
      <input type="url" id="playlistUrl" placeholder="Lien Spotify" required />
      <button type="submit">Ajouter</button>
    </form>
    <ul id="playlistList"></ul>
  `;

  loadPlaylists(userId);

  document.getElementById("addPlaylistForm").onsubmit = (e) => addPlaylist(e, userId);
}

function getPlaylists() {
  return JSON.parse(localStorage.getItem("playlists") || "{}");
}

function savePlaylists(p) {
  localStorage.setItem("playlists", JSON.stringify(p));
}

function addPlaylist(e, userId) {
  e.preventDefault();
  const url = document.getElementById("playlistUrl").value;
  const playlists = getPlaylists();
  playlists[userId] = playlists[userId] || [];
  playlists[userId].push(url);
  savePlaylists(playlists);
  loadPlaylists(userId);
  e.target.reset();
}

function loadPlaylists(userId) {
  const list = document.getElementById("playlistList");
  list.innerHTML = "";
  const userPlaylists = getPlaylists()[userId] || [];

  if (userPlaylists.length === 0) {
    list.innerHTML = "<p>Aucune playlist ajoutée.</p>";
    return;
  }

  userPlaylists.forEach((url, i) => {
    list.innerHTML += `<li>${url} <button onclick="deletePlaylist('${userId}', ${i})">❌</button></li>`;
  });
}

window.deletePlaylist = (userId, index) => {
  const playlists = getPlaylists();
  playlists[userId].splice(index, 1);
  savePlaylists(playlists);
  loadPlaylists(userId);
};
