import StoryAPI from "../../data/api";
import L from "leaflet";

const HomePage = {
  async render(container) {
    container.innerHTML = `
      <section class="content-section">
        <h2 view-transition-name="page-title">Stories Around You</h2>
        <div class="map-container">
          <div id="storyMap" style="height: 400px; width: 100%;"></div> 
        </div>
        <div class="story-list" id="storyList">
          <p>Memuat cerita...</p>
        </div>
      </section>
    `;
  },

  async afterRender() {
    const listContainer = document.getElementById("storyList");
    const token = localStorage.getItem("storyAppToken");

    if (!token) {
      listContainer.innerHTML = `<p class="error-message message-area" style="background-color: #f8d7da; color: #721c24;">Anda harus login untuk melihat cerita. Mengalihkan ke Login...</p>`;
      setTimeout(() => {
        window.location.hash = "#/login";
      }, 1500);
      return;
    }

    try {
      const stories = await StoryAPI.getAllStoriesWithLocation(token);

      // ✅ Cek apakah response fallback dari Service Worker
      if (stories.error === "offline") {
        listContainer.innerHTML = `
      <p class="message-area" style="background-color: #fff3cd; color: #856404;">
        📴 Kamu sedang offline. Cerita tidak bisa dimuat.
      </p>
    `;
        this._renderMap([]); // render map kosong
        return;
      }

      console.log("List of stories:", stories);
      this._renderMap(stories);
      this._renderStoryList(stories);
    } catch (error) {
      listContainer.innerHTML = `
    <p class="error-message message-area" style="background-color: #f8d7da; color: #721c24;">
      Error loading stories: ${error.message}. Silakan <a href="#/login">Login</a> ulang.
    </p>
  `;
      console.error("API Error:", error.message);
    }
  },

  _renderMap(stories) {
    const mapElement = document.getElementById("storyMap");
    if (!mapElement || mapElement._leaflet_id) return;

    const map = L.map("storyMap").setView([0, 0], 2);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    stories.forEach((story) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(map);
        marker.bindPopup(`
          <div>
            <strong>${story.name}</strong>
            <img src="${story.photoUrl}" alt="Foto dari cerita ${
          story.name
        }" style="width:100px; height:auto; display:block; margin-top:5px;">
            <p>${story.description.substring(0, 50)}...</p>
          </div>
        `);
      }
    });

    const validStories = stories.filter((s) => s.lat && s.lon);
    if (validStories.length > 0) {
      const bounds = new L.LatLngBounds(
        validStories.map((s) => [s.lat, s.lon])
      );
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    } else {
      map.setView([-2.5, 118.5], 4);
    }
  },

  _renderStoryList(stories) {
    const listContainer = document.getElementById("storyList");

    if (stories.length === 0) {
      listContainer.innerHTML = `<p class="message-area">Belum ada cerita yang tersedia. Ayo bagikan cerita pertama Anda!</p>`;
      return;
    }

    listContainer.innerHTML = stories
      .map((story) => {
        return `
          <a href="#/detail/${story.id.replace(
            /^story-/,
            ""
          )}" class="story-link" view-transition-name="story-transition-${
          story.id
        }">
            <article class="story-card">
              <img src="${
                story.photoUrl
              }" alt="Foto cerita yang diunggah oleh ${
          story.name
        }" class="story-image" view-transition-name="image-${story.id}"> 
              <div class="story-info">
                <h3 view-transition-name="title-${story.id}">${story.name}</h3>
                <p class="story-date">Dibuat: ${new Date(
                  story.createdAt
                ).toLocaleDateString()}</p>
                <p class="story-description">${story.description.substring(
                  0,
                  150
                )}...</p> 
                ${
                  story.lat
                    ? `<p class="story-location">Lokasi: (${story.lat}, ${story.lon})</p>`
                    : ""
                }
              </div>
            </article>
          </a>
        `;
      })
      .join("");
  },
};

export default HomePage;
