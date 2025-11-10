// src/scripts/presenters/HomePresenter.js
import StoryModel from "../data/StoryModel"; // Asumsi sudah ada Model/API
import HomeView from "../pages/home/home-page";

class HomePresenter {
  constructor({ view, model, router }) {
    this._view = view;
    this._model = model;
    this._router = router;

    // Inisiasi tampilan dan panggil data saat Presenter dibuat
    this._renderStories();
    this._view._setupEventListeners();
  }

  async _renderStories() {
    // 1. Ambil data dari Model/API
    const stories = await this._model.getAllStories();

    // 2. Instruksikan View untuk menampilkan data
    this._view.renderStories(stories);
  }

  // Logika interaksi yang diteruskan dari View
  navigateToAddStory() {
    this._router.navigate("#/add-story"); // Menggunakan router untuk navigasi
  }
}
export default HomePresenter;
