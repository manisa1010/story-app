// src/scripts/presenters/AboutPresenter.js
import AboutView from "../pages/about/about-page";

class AboutPresenter {
  constructor({ viewContainer }) {
    this._view = new AboutView(viewContainer);
    this._renderView();
  }

  _renderView() {
    this._view.renderStaticContent(); // Hanya merender template statis
  }
}
export default AboutPresenter;
