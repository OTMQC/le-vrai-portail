import { login } from "../auth.js";
import { route } from "../router.js";
import { renderHeader } from "../components/header.js";

export function renderLogin(container) {
  container.innerHTML = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&display=swap');

      .login-page {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: linear-gradient(145deg, #000, #060d12);
        color: #00f0ff;
        font-family: 'Orbitron', sans-serif;
        padding: 2rem;
      }

      .login-content {
        text-align: center;
        max-width: 400px;
        width: 100%;
        margin: 0 auto;
      }

      .neon-logo {
        width: 140px;
        margin-bottom: 1rem;
        filter: drop-shadow(0 0 6px #00f0ff) drop-shadow(0 0 12px #00f0ff);
      }

      .login-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 1rem;
      }

      .login-form h2 {
        margin-bottom: 0.5rem;
        color: #00f0ff;
        text-shadow: 0 0 6px #00f0ff;
        font-size: 1.4rem;
      }

      .login-form input {
        background: #111;
        border: 1px solid #00f0ff55;
        border-radius: 12px;
        padding: 0.9rem 1rem;
        color: #fff;
        font-size: 0.9rem;
        box-shadow: inset 0 0 6px rgba(0, 255, 255, 0.1);
      }

      .login-form input::placeholder {
        color: #888;
      }

      .login-form button {
        padding: 0.9rem;
        background: #00f0ff;
        color: #000;
        font-weight: bold;
        border-radius: 14px;
        border: none;
        cursor: pointer;
        font-size: 1rem;
        transition: 0.3s;
      }

      .login-form button:hover {
        background: #00e0e0;
      }

      .error-message {
        color: red;
        font-size: 0.85rem;
      }

      .login-info {
        margin-top: 2rem;
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
      }

      .about-toggle {
        background: none;
        border: 1px solid #00f0ff88;
        color: #00f0ff;
        padding: 0.6rem;
        border-radius: 12px;
        font-size: 0.85rem;
        cursor: pointer;
        font-family: 'Orbitron', sans-serif;
        transition: background 0.3s;
      }

      .about-toggle:hover {
        background: rgba(0, 255, 255, 0.1);
      }

      .about-content {
        display: none;
        font-size: 0.85rem;
        color: #ccc;
        padding: 0.5rem;
        border-top: 1px solid rgba(0,255,255,0.1);
      }

      .about-content.show {
        display: block;
      }

      .insta-button {
        text-decoration: none;
        color: #000;
        background: #00f0ff;
        border-radius: 14px;
        padding: 0.7rem;
        font-weight: bold;
        font-size: 0.9rem;
        transition: 0.3s;
      }

      .insta-button:hover {
        background: #00e0e0;
      }
    </style>

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

