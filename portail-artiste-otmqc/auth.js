import { db } from "./firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export async function login(id, code) {
  if (id === "admin" && code === "Carotte24$") {
    localStorage.setItem("auth", "true");
    localStorage.setItem("role", "admin");
    localStorage.setItem("currentUserId", "admin");
    localStorage.setItem("currentUserName", "Administrateur");
    return true;
  }

  const docRef = doc(db, "artistes", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const user = docSnap.data();
    if (user.password === code) {
      localStorage.setItem("auth", "true");
      localStorage.setItem("role", "artiste");
      localStorage.setItem("currentUserId", user.id);
      localStorage.setItem("currentUserName", user.name);
      return true;
    }
  }

  return false;
}

export function logout() {
  localStorage.clear();
  location.reload();
}

export function isAuthenticated() {
  return localStorage.getItem("auth") === "true";
}

export function getRole() {
  return localStorage.getItem("role");
}

export function getCurrentUser() {
  return {
    id: localStorage.getItem("currentUserId"),
    name: localStorage.getItem("currentUserName"),
    role: localStorage.getItem("role")
  };
}
