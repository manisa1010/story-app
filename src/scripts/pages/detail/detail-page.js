import UrlParser from "../../routes/url-parser";
import StoryAPI from "../../data/api";
import FavoriteStoryIdb from "../../data/favorite-story-idb";

const _removeOverlay = () => {
  const overlay = document.querySelector("#detail-overlay");
  if (overlay) overlay.remove();
};

const DetailPage = {
  async render(container) {
    container.innerHTML = `<p>Memuat detail cerita...</p>`;

    const url = UrlParser.parseActiveUrlWithoutCombiner();
    let rawId = decodeURIComponent(url.id);
    const storyId = rawId.startsWith("story-") ? rawId : "story-" + rawId;
    const token = localStorage.getItem("storyAppToken");

    if (!token || !storyId) {
      alert("Anda harus login atau ID cerita tidak valid.");
      window.location.hash = "#/home";
      return;
    }

    try {
      const story = await StoryAPI.getStoryDetail(storyId, token);
      const isFavorite = await FavoriteStoryIdb.getStory(story.id);

      _removeOverlay();

      document.body.insertAdjacentHTML(
        "beforeend",
        `
        <div id="detail-overlay" class="detail-overlay active">
          <div class="detail-modal" view-transition-name="detail-modal-${storyId}">
            <button id="closeDetailButton" class="close-button">X</button>

            <button id="bookmarkButton"
                    class="bookmark-button"
                    data-story-id="${story.id}"
                    data-is-favorite="${!!isFavorite}">
              ${!!isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </button>

            <div class="detail-content">
              <img src="${story.photoUrl}" alt="Foto ${story.name}"
                   class="detail-image" view-transition-name="image-${storyId}">
              <h2 view-transition-name="title-${storyId}">👤${story.name}</h2>
              <p>📅Dibuat: ${new Date(story.createdAt).toLocaleDateString()}</p>
              <p class="detail-description">${story.description}</p>
              ${
                story.lat ? `<p>📍Lokasi: (${story.lat}, ${story.lon})</p>` : ""
              }
            </div>
          </div>
        </div>
        `
      );

      this._setupCloseListener();
      this._setupBookmarkListener(story);
    } catch (error) {
      _removeOverlay();

      container.innerHTML = `
        <div class="error-message">
          Cerita tidak ditemukan atau sudah dihapus.
        </div>
      `;
    }
  },

  async afterRender() {},

  _setupCloseListener() {
    const closeButton = document.querySelector("#closeDetailButton");
    if (closeButton) {
      closeButton.addEventListener("click", () => {
        _removeOverlay();
        window.history.back();
      });
    }
  },

  _setupBookmarkListener(storyData) {
    const bookmarkButton = document.querySelector("#bookmarkButton");
    if (!bookmarkButton) return;

    bookmarkButton.addEventListener("click", async () => {
      const isFavorite = bookmarkButton.dataset.isFavorite === "true";

      const storyToSave = {
        id: storyData.id,
        name: storyData.name,
        description: storyData.description,
        createdAt: storyData.createdAt,
        photoUrl: storyData.photoUrl,
        lat: storyData.lat || null,
        lon: storyData.lon || null,
      };

      if (isFavorite) {
        await FavoriteStoryIdb.deleteStory(storyData.id);
        alert("Cerita dihapus dari favorit!");
      } else {
        await FavoriteStoryIdb.putStory(storyToSave);
        alert("Cerita ditambahkan ke favorit!");
      }

      bookmarkButton.dataset.isFavorite = (!isFavorite).toString();
      bookmarkButton.textContent = !isFavorite
        ? "Remove from Favorites"
        : "Add to Favorites";
    });
  },
};

export default DetailPage;
