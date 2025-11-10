import StoryAPI from "../../data/api";
import L from "leaflet";

const AddStoryPage = {
  async render(container) {
    container.innerHTML = `
    <section class="content-section">
  <form class="add-story-form">
    <h2>Tambah Cerita Baru</h2>

    <label for="description">Deskripsi Cerita *</label>
    <textarea id="description" name="description" placeholder="Tuliskan cerita Anda di sini..." required></textarea>

    <label for="photo">Unggah Foto (Max 1MB) *</label>
    <input type="file" id="photo" name="photo" accept="image/*" required />

    <label>Pilih Lokasi di Peta (Opsional)</label>
    <p style="font-size: 0.85rem; color: #666;">Klik di peta untuk mendapatkan koordinat Lat/Lon.</p>
    <div class="map-container" id="addStoryMap"></div>

    <label for="lat">Latitude (Lat)</label>
    <input type="text" id="lat" name="lat" readonly />

    <label for="lon">Longitude (Lon)</label>
    <input type="text" id="lon" name="lon" readonly />

    <button type="submit">Unggah Cerita</button>
  </form>
</section>
    `;

    this._initializeForm();
  },

  _initializeForm() {
    const form = document.getElementById("addStoryForm");
    const photoInput = document.getElementById("photo");
    const previewImage = document.getElementById("previewImage");
    const latInput = document.getElementById("lat");
    const lonInput = document.getElementById("lon");
    const messageArea = document.getElementById("formMessage");

    const map = L.map("addStoryMap").setView([-6.2, 106.816666], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    let marker;

    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      latInput.value = lat.toFixed(6);
      lonInput.value = lng.toFixed(6);

      if (marker) map.removeLayer(marker);
      marker = L.marker([lat, lng]).addTo(map);
      marker
        .bindPopup(`Lokasi terpilih: ${lat.toFixed(4)}, ${lng.toFixed(4)}`)
        .openPopup();
    });

    photoInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        previewImage.src = URL.createObjectURL(file);
        previewImage.style.display = "block";
      } else {
        previewImage.style.display = "none";
      }
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const token = localStorage.getItem("storyAppToken");
      if (!token) {
        messageArea.textContent = "Gagal mengunggah: Anda belum login.";
        messageArea.style.color = "red";
        return;
      }
      messageArea.textContent = "Mengirim data...";
      messageArea.style.color = "blue";

      const data = {
        description: document.getElementById("description").value,
        photo: photoInput.files[0],
        lat: latInput.value,
        lon: lonInput.value,
        token: token,
      };

      try {
        await StoryAPI.addNewStory(data);
        messageArea.textContent = "🎉 Cerita berhasil diunggah!";
        messageArea.style.color = "green";
        form.reset();
        previewImage.style.display = "none";
        if (marker) map.removeLayer(marker);

        setTimeout(() => {
          window.location.hash = "#/home";
        }, 1500);
      } catch (error) {
        messageArea.textContent = `Gagal mengunggah: ${error.message}`;
        messageArea.style.color = "red";
      }
    });
  },
};

export default AddStoryPage;
