import { login } from "../auth.js";
import { route } from "../router.js";
import { renderHeader } from "../components/header.js";

export function renderLogin(container) {
  // Force fond noir total
  document.body.classList.add("login-mode");

  container.innerHTML = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&display=swap');

      .login-page {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: #000;
        color: #00f0ff;
        font-family: 'Orbitron', sans-serif;
        padding: 2rem;
        position: relative;
        overflow: hidden;
      }

      .login-page::before,
      .login-page::after {
        content: "";
        position: absolute;
        top: 50%;
        width: 120px;
        height: 300px;
        background: radial-gradient(ellipse at center, rgba(0,255,255,0.15) 0%, transparent 70%);
        transform: translateY(-50%) rotate(25deg);
        filter: blur(20px);
        z-index: 0;
        pointer-events: none;
        animation: pulseSides 6s ease-in-out infinite;
      }

      .login-page::after {
        right: -60px;
        transform: translateY(-50%) rotate(-25deg);
      }

      .login-page::before {
        left: -60px;
      }

      .login-content {
        background: rgba(10,10,10,0.9);
        border: 1px solid rgba(0, 255, 255, 0.2);
        padding: 2rem;
        border-radius: 18px;
        box-shadow: 0 0 25px rgba(0, 255, 255, 0.12);
        text-align: center;
        max-width: 420px;
        width: 100%;
        z-index: 1;
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
        font-size: 1.5rem;
      }

      .login-form input {
        background: #111;
        border: 1px solid #00f0ff55;
        border-radius: 12px;
        padding: 0.9rem 1rem;
        color: #fff;
        font-size: 0.95rem;
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
        z-index: 1;
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
        text-align: center;
      }

      .insta-button:hover {
        background: #00e0e0;
      }

      @keyframes pulseSides {
        0%, 100% {
          opacity: 0.4;
          transform: translateY(-50%) scale(1);
        }
        50% {
          opacity: 0.7;
          transform: translateY(-50%) scale(1.08);
        }
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
      document.body.classList.remove("login-mode");
      renderHeader();
      route();
    } else {
      document.getElementById("error").textContent = "Identifiants invalides.";
    }
  });
}

