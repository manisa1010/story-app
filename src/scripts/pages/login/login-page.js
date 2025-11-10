import StoryAPI from "../../data/api";

const LoginPage = {
  async render(container) {
    container.innerHTML = `
      <section class="content-section">
        <div class="login-section">
          <h2>Login ke Story App</h2>

          <form id="loginForm">
            <label for="emailInput">Email address</label>
            <input type="email" id="emailInput" name="email" required />

            <label for="passwordInput">Password</label>
            <input type="password" id="passwordInput" name="password" required />

            <button type="submit">Login</button>

            <p class="register-link">
              Belum punya akun? <a href="#/register">Daftar di sini</a>
            </p>
          </form>
        </div>
      </section>
    `;
  },

  async afterRender() {
    const loginForm = document.querySelector("#loginForm");

    if (!loginForm) return;

    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const email = document.querySelector("#emailInput").value.trim();
      const password = document.querySelector("#passwordInput").value.trim();

      const submitButton = loginForm.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      submitButton.textContent = "Logging In...";

      try {
        const token = await StoryAPI.login({ email, password });
        localStorage.setItem("storyAppToken", token);

        alert("Login Berhasil! Selamat datang.");
        window.location.hash = "#/home";
      } catch (error) {
        alert(`Login Gagal: ${error.message}`);
        console.error("Login Error:", error);
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Login";
      }
    });
  },
};

export default LoginPage;
