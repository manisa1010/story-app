// src/scripts/data/favorite-story-idb.js

import { openDB } from "idb";

const DATABASE_NAME = "stories-db";
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = "favorites";

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(database) {
    // Membuat object store jika belum ada
    if (!database.objectStoreNames.contains(OBJECT_STORE_NAME)) {
      database.createObjectStore(OBJECT_STORE_NAME, { keyPath: "id" });
    }
  },
});

const FavoriteStoryIdb = {
  async getStory(id) {
    return (await dbPromise).get(OBJECT_STORE_NAME, id);
  },

  async getAllStories() {
    return (await dbPromise).getAll(OBJECT_STORE_NAME);
  },

  async putStory(story) {
    // Memastikan objek memiliki properti 'id' karena kita menggunakannya sebagai keyPath
    // Kita hanya perlu menyimpan data yang relevan untuk list dan detail
    const storyToSave = {
      id: story.id,
      name: story.name,
      description: story.description,
      photoUrl: story.photoUrl,
      createdAt: story.createdAt,
      lat: story.lat,
      lon: story.lon,
    };
    return (await dbPromise).put(OBJECT_STORE_NAME, storyToSave);
  },

  async deleteStory(id) {
    return (await dbPromise).delete(OBJECT_STORE_NAME, id);
  },
};

export default FavoriteStoryIdb;
