import FavoriteStoryIdb from "../../data/favorite-story-idb";

const FavoritesPage = {
  async render(container) {
    container.innerHTML = `
      <section class="content-section">
        <h2>Daftar Cerita Favorit</h2>
        <div id="favorites-list" class="story-list"></div>
      </section>
    `;
  },

  async afterRender() {
    const favorites = await FavoriteStoryIdb.getAllStories();
    const listContainer = document.querySelector("#favorites-list");

    if (favorites.length === 0) {
      listContainer.innerHTML = "<p>Belum ada cerita favorit.</p>";
      return;
    }

    listContainer.innerHTML = favorites
      .map(
        (story) => `
        <div class="story-card" data-id="${story.id}">
  <img src="${story.photoUrl}" alt="Foto ${story.name}" class="story-image" />
  <div class="story-info">
    <h3>${story.name}</h3>
    <p>Dibuat: ${new Date(story.createdAt).toLocaleDateString()}</p>
    <p>${story.description}</p>
    ${story.lat ? `<p>Lokasi: (${story.lat}, ${story.lon})</p>` : ""}
    <a href="#/detail/${encodeURIComponent(
      story.id
    )}" class="detail-link">Lihat Detail</a>
  </div>
</div>
      `
      )
      .join("");
  },
};

export default FavoritesPage;
