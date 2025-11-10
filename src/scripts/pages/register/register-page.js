import StoryAPI from "../../data/api";

const RegisterPage = {
  async render(container) {
    container.innerHTML = `
      <section class="content-section">
        <div class="register-section">
          <h2>Daftar Akun Baru</h2>

          <form id="registerForm">
            <label for="nameInput">Nama Lengkap</label>
            <input type="text" id="nameInput" name="name" required />

            <label for="emailInput">Email address</label>
            <input type="email" id="emailInput" name="email" required />

            <label for="passwordInput">Password <span style="font-size: 0.85rem; color: #666;">Minimal 8 karakter.</span></label>
            <input type="password" id="passwordInput" name="password" minlength="8" required />

            <button type="submit">Daftar</button>

            <p class="login-link">
              Sudah punya akun? <a href="#/login">Login di sini</a>
            </p>
          </form>
        </div>
      </section>
    `;
  },

  async afterRender() {
    const registerForm = document.querySelector("#registerForm");

    if (!registerForm) return;

    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const name = document.querySelector("#nameInput").value.trim();
      const email = document.querySelector("#emailInput").value.trim();
      const password = document.querySelector("#passwordInput").value.trim();

      const submitButton = registerForm.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.textContent = "Mendaftar...";

      try {
        await StoryAPI.register({ name, email, password });
        alert("Pendaftaran berhasil! Silakan login.");
        window.location.hash = "#/login";
      } catch (error) {
        alert(`Pendaftaran gagal: ${error.message}`);
        console.error("Register Error:", error);
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Daftar";
      }
    });
  },
};

export default RegisterPage;
