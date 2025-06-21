import { isAuthenticated, logout } from "../auth.js";

export function renderHeader() {
  let header = document.getElementById("main-header");

  if (!header) {
    header = document.createElement("header");
    header.id = "main-header";
    header.classList.add("futuristic-wave-header");
    document.body.insertBefore(header, document.getElementById("app"));
  }

  header.innerHTML = "";

  if (isAuthenticated()) {
    const logoutBtn = document.createElement("button");
    logoutBtn.textContent = "Déconnexion";
    logoutBtn.classList.add("logout-button");

    logoutBtn.addEventListener("click", () => {
      logout();
      location.reload();
    });

    header.appendChild(logoutBtn);
  }
}
