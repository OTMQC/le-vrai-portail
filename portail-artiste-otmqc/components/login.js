import { login } from "../auth.js";
import { route } from "../router.js";
import { renderHeader } from "../components/header.js";

export function renderLogin(container) {
  container.innerHTML = `
    <div class="login-page fade-in">
      <div class="login-content">
        <img src="./portail-artiste-otmqc/assets/logo.png" alt="Logo Connexion" class="logo-neon" />

        <form id="loginForm" class="login-form">
          <h2>Portail d'Artiste OTMQC</h2>
          <input type="text" placeholder="ID d'utilisateur" id="name" required />
          <div class="password-wrapper">
            <input type="password" placeholder="Mot de passe" id="code" required />
            <button type="button" id="togglePassword" class="toggle-password" aria-label="Afficher le mot de passe">
              <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="#00f0ff">
                <path d="M12 4.5C7 4.5 2.73 8.11 1 12c1.73 3.89 6 7.5 11 7.5s9.27-3.61 11-7.5c-1.73-3.89-6-7.5-11-7.5zm0 13c-3.03 0-5.5-2.47-5.5-5.5S8.97 6.5 12 6.5 17.5 8.97 17.5 12 15.03 17.5 12 17.5zm0-9c-1.93 0-3.5 1.57-3.5 3.5S10.07 15.5 12 15.5 15.5 13.93 15.5 12 13.93 8.5 12 8.5z"/>
              </svg>
            </button>
          </div>
          <button type="submit">Connexion</button>
          <p id="error" class="error-message"></p>
        </form>

        <div class="login-info">
          <button id="toggleAbout" class="about-toggle">À propos</button>
          <div id="aboutSection" class="about-content">
            <p>
              Bienvenue sur le Portail Artiste OTMQC, une plateforme sécurisée conçue et gérée par
              l’Agence OnTheMapQc. Accédez facilement à vos playlists, fichiers, informations personnelles
              et bien plus encore. Cet espace est exclusivement réservé aux artistes affiliés à l’équipe OTMQC.
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

  document.getElementById("togglePassword").addEventListener("click", () => {
    const pwd = document.getElementById("code");
    pwd.type = pwd.type === "password" ? "text" : "password";
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
