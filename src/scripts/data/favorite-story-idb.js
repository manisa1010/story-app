import { openDB } from "idb";

const DATABASE_NAME = "stories-db";
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = "favorites";

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(database) {
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
