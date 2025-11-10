class StoryAPI {
  static BASE_URL = "https://story-api.dicoding.dev/v1";

  static async login({ email, password }) {
    const response = await fetch(`${StoryAPI.BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const responseJson = await response.json();
    if (response.status >= 400) {
      throw new Error(responseJson.message || "Gagal login.");
    }

    if (!responseJson.loginResult || !responseJson.loginResult.token) {
      throw new Error("Token tidak ditemukan di respons server.");
    }
    return responseJson.loginResult.token;
  }

  static async register({ name, email, password }) {
    const response = await fetch(`${StoryAPI.BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const responseJson = await response.json();
    if (responseJson.error) throw new Error(responseJson.message);
    return responseJson;
  }

  static async getAllStoriesWithLocation(token) {
    const response = await fetch(`${StoryAPI.BASE_URL}/stories?location=1`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const responseJson = await response.json();
    if (responseJson.error) throw new Error(responseJson.message);
    return responseJson.listStory;
  }

  static async getStoryDetail(id, token) {
    const response = await fetch(`${StoryAPI.BASE_URL}/stories/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const responseJson = await response.json();
    if (response.status >= 400) {
      throw new Error(responseJson.message || "Gagal memuat detail.");
    }
    return responseJson.story;
  }

  static async addNewStory({ description, photo, lat, lon, token }) {
    const formData = new FormData();
    formData.append("description", description);
    formData.append("photo", photo);

    if (lat) formData.append("lat", lat);
    if (lon) formData.append("lon", lon);

    const response = await fetch(`${StoryAPI.BASE_URL}/stories`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const responseJson = await response.json();
    if (response.status >= 400) {
      throw new Error(responseJson.message || "Gagal mengunggah cerita.");
    }

    return responseJson;
  }
}

export default StoryAPI;
