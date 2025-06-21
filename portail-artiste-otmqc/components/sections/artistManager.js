export function renderArtistManager(container) {
  container.innerHTML = `
    <h3>Ajouter un nouvel artiste</h3>
    <form id="artistForm">
      <input type="text" id="name" placeholder="Nom complet" required />
      <input type="text" id="id" placeholder="ID unique (ex: julz001)" required />
      <input type="text" id="pin" placeholder="PIN" required />
      <input type="password" id="password" placeholder="Mot de passe" required />
      <input type="date" id="dob" required />
      <input type="date" id="signatureDate" required />
      <button type="submit">Ajouter</button>
    </form>
    <p id="confirmation" style="color: green; margin-top: 1rem;"></p>
  `;

  document.getElementById("artistForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const artist = {
      name: document.getElementById("name").value.trim(),
      id: document.getElementById("id").value.trim().toLowerCase(),
      pin: document.getElementById("pin").value.trim(),
      password: document.getElementById("password").value.trim(),
      dob: document.getElementById("dob").value,
      signatureDate: document.getElementById("signatureDate").value,
    };

    localStorage.setItem(`user_${artist.id}`, JSON.stringify(artist));
    document.getElementById("artistForm").reset();
    document.getElementById("confirmation").textContent = `Utilisateur ${artist.id} enregistré.`;
  });
}
