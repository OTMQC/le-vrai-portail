export function renderPlaylistManager(container) {
  container.innerHTML = `
    <h3>Gestion des playlists Spotify 🎵</h3>
    <form id="addPlaylistForm">
      <input type="url" id="playlistUrl" placeholder="Lien Spotify" required />
      <button type="submit">Ajouter</button>
    </form>
    <ul id="playlistList"></ul>
  `;
  loadPlaylists();
  document.getElementById("addPlaylistForm").onsubmit = addPlaylist;
}
function getPlaylists() {
  return JSON.parse(localStorage.getItem("playlists") || "{}");
}
function savePlaylists(p) {
  localStorage.setItem("playlists", JSON.stringify(p));
}
function addPlaylist(e) {
  e.preventDefault();
  const url = playlistUrl.value;
  const playlists = getPlaylists();
  const id = "julz001";
  playlists[id] = playlists[id] || [];
  playlists[id].push(url);
  savePlaylists(playlists);
  loadPlaylists();
  e.target.reset();
}
function loadPlaylists() {
  const list = document.getElementById("playlistList");
  list.innerHTML = "";
  const id = "julz001";
  (getPlaylists()[id] || []).forEach((url, i) => {
    list.innerHTML += `<li>${url} <button onclick="deletePlaylist(${i})">❌</button></li>`;
  });
}
window.deletePlaylist = (index) => {
  const id = "julz001";
  const playlists = getPlaylists();
  playlists[id].splice(index, 1);
  savePlaylists(playlists);
  loadPlaylists();
};
