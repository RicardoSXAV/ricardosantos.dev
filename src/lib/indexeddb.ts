/**
 * IndexedDB utility for storing background images without compression
 * Provides unlimited storage compared to localStorage
 */

const DB_NAME = "desktopPreferences";
const STORE_NAME = "backgroundImages";
const IMAGE_KEY = "current";

interface BackgroundImageData {
  id: string;
  blob: Blob;
  timestamp: number;
  mimeType: string;
}

/**
 * Initialize the IndexedDB database
 */
function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

/**
 * Save background image to IndexedDB
 */
export async function saveBackgroundImage(file: File): Promise<void> {
  const db = await getDB();
  const transaction = db.transaction(STORE_NAME, "readwrite");
  const store = transaction.objectStore(STORE_NAME);

  const data: BackgroundImageData = {
    id: IMAGE_KEY,
    blob: file,
    timestamp: Date.now(),
    mimeType: file.type,
  };

  return new Promise((resolve, reject) => {
    const request = store.put(data, IMAGE_KEY);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

/**
 * Load background image from IndexedDB
 * Returns an object URL that can be used as background-image
 */
export async function loadBackgroundImage(): Promise<string | null> {
  try {
    const db = await getDB();
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.get(IMAGE_KEY);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        if (request.result) {
          const blob = request.result.blob as Blob;
          const objectUrl = URL.createObjectURL(blob);
          resolve(objectUrl);
        } else {
          resolve(null);
        }
      };
    });
  } catch (error) {
    console.error("Failed to load background image from IndexedDB:", error);
    return null;
  }
}

/**
 * Delete background image from IndexedDB
 */
export async function deleteBackgroundImage(): Promise<void> {
  const db = await getDB();
  const transaction = db.transaction(STORE_NAME, "readwrite");
  const store = transaction.objectStore(STORE_NAME);

  return new Promise((resolve, reject) => {
    const request = store.delete(IMAGE_KEY);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

/**
 * Check if a background image exists in IndexedDB
 */
export async function backgroundImageExists(): Promise<boolean> {
  try {
    const db = await getDB();
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.get(IMAGE_KEY);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        resolve(!!request.result);
      };
    });
  } catch (error) {
    console.error("Failed to check background image existence:", error);
    return false;
  }
}
