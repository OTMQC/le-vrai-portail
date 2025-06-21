import { renderLogin } from "./components/login.js";
import { renderDashboardArtiste } from "./components/dashboardArtiste.js";
import { renderDashboardAdmin } from "./components/dashboardAdmin.js";
import { isAuthenticated, getRole } from "./auth.js";

export function route() {
  const app = document.getElementById("app");

  if (!isAuthenticated()) {
    renderLogin(app);
  } else {
    const role = getRole();
    role === "admin"
      ? renderDashboardAdmin(app)
      : renderDashboardArtiste(app);
  }
}
