import { renderHeader } from "./components/header.js";
import { renderFooter } from "./components/footer.js";
import { renderPlaylistManager } from "./components/sections/playlistManager.js";
import { route } from "./router.js";

document.addEventListener("DOMContentLoaded", () => {
  document.body.innerHTML = `
    <div id="app"></div>
    <div id="footer"></div>
  `;

  renderHeader();
  renderFooter();
  route();
});
