const AboutPage = {
  async render(container) {
    container.innerHTML = `
      <section class="container">
        <h1>About Page</h1>
        <p>Aplikasi ini dibuat untuk membagikan cerita dan lokasi terbaik di sekitar Anda.</p>
      </section>
    `;
  },

  async afterRender() {},
};

export default AboutPage;
