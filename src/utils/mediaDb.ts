/**
 * IndexedDB storage for large media files (videos, gifs, high-res photos)
 * Bypasses the 5MB localStorage limit so videos never get lost.
 */

const DB_NAME = 'AlexandreFontineleMediaDB';
const DB_VERSION = 1;
const STORE_NAME = 'media_store';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveMediaItem(key: string, data: any): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(data, key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error('Error saving to IndexedDB:', err);
    // fallback to localStorage if possible
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn('LocalStorage quota exceeded as well');
    }
  }
}

export async function getMediaItem<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () => {
        if (request.result !== undefined && request.result !== null) {
          resolve(request.result as T);
        } else {
          // Check localStorage as fallback
          try {
            const ls = localStorage.getItem(key);
            if (ls) {
              resolve(JSON.parse(ls));
              return;
            }
          } catch {
            // ignore
          }
          resolve(defaultValue);
        }
      };

      request.onerror = () => {
        // Fallback to localStorage
        try {
          const ls = localStorage.getItem(key);
          if (ls) {
            resolve(JSON.parse(ls));
            return;
          }
        } catch {
          // ignore
        }
        resolve(defaultValue);
      };
    });
  } catch (err) {
    try {
      const ls = localStorage.getItem(key);
      if (ls) return JSON.parse(ls);
    } catch {
      // ignore
    }
    return defaultValue;
  }
}
