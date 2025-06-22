import { login } from "../auth.js";
import { route } from "../router.js";
import { renderHeader } from "../components/header.js";

export function renderLogin(container) {
  container.innerHTML = `
    <div class="login-page fade-in">
      <div class="login-content">
        <img src="./portail-artiste-otmqc/assets/logo.png" alt="Logo Connexion" class="neon-logo" />
        <form id="loginForm" class="login-form">
          <h2>Portail d'Artiste OTMQC</h2>
          <input type="text" placeholder="ID artiste" id="name" required />
          <input type="password" placeholder="Mot de passe" id="code" required />
          <button type="submit">Connexion</button>
          <p id="error" class="error-message"></p>
        </form>
        <div class="login-info">
          <button id="toggleAbout" class="about-toggle">À propos</button>
          <div id="aboutSection" class="about-content">
            <p>
              Bienvenue sur le Portail Artiste OTMQC, une plateforme sécurisée conçue et gérée par
              l’Agence OnTheMapQc. Accédez à vos playlists, fichiers, et plus encore.
            </p>
          </div>
          <a href="https://www.instagram.com/onthemapqc/" target="_blank" class="insta-button">
            INSTAGRAM
          </a>
        </div>
      </div>
    </div>
  `;

  document.getElementById("toggleAbout").addEventListener("click", () => {
    const about = document.getElementById("aboutSection");
    about.classList.toggle("show");
  });

  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim().toLowerCase();
    const code = document.getElementById("code").value;
    const success = await login(name, code);
    if (success) {
      renderHeader();
      route();
    } else {
      document.getElementById("error").textContent = "Identifiants invalides.";
    }
  });
}
