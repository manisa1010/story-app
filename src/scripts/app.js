import UrlParser from "./routes/url-parser";
import routes from "./routes/routes";

class App {
  constructor({ content }) {
    this._content = content;
  }

  async renderPage() {
    const url = UrlParser.parseActiveUrlWithCombiner();
    const page = routes[url];

    const shouldClearContent = url !== "/stories/:id";

    if (!page) {
      this._content.innerHTML = "<h1>404 Page Not Found</h1>";
      return;
    }

    const renderAndActivatePage = async () => {
      if (shouldClearContent) {
        this._content.innerHTML = "";
      }

      await page.render(this._content);

      if (page.afterRender) {
        await page.afterRender();
      }
    };

    if (document.startViewTransition) {
      document.startViewTransition(async () => {
        await renderAndActivatePage();
      });
    } else {
      await renderAndActivatePage();
    }

    this._updateActiveLink();
  }

  _updateActiveLink() {
    const links = document.querySelectorAll(".app-bar__navigation a");
    const currentHash = window.location.hash || "#/home";

    links.forEach((link) => {
      link.classList.remove("active");

      if (link.hash === currentHash) {
        link.classList.add("active");
      }
    });
  }
}

export default App;
