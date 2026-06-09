const DB_NAME = "intentctrl-store";
const DB_VERSION = 1;
const STORE_NAME = "app";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getItem(key: string): Promise<string | null> {
  if (typeof indexedDB === "undefined") return Promise.resolve(null);

  return new Promise((resolve, reject) => {
    openDB().then((db) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(key);
      request.onsuccess = () => {
        resolve((request.result as string) ?? null);
        db.close();
      };
      request.onerror = () => {
        reject(request.error);
        db.close();
      };
    });
  });
}

function setItem(key: string, value: string): Promise<void> {
  if (typeof indexedDB === "undefined") return Promise.resolve();

  return new Promise((resolve, reject) => {
    openDB().then((db) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const request = store.put(value, key);
      request.onsuccess = () => {
        resolve();
        db.close();
      };
      request.onerror = () => {
        reject(request.error);
        db.close();
      };
    });
  });
}

function removeItem(key: string): Promise<void> {
  if (typeof indexedDB === "undefined") return Promise.resolve();

  return new Promise((resolve, reject) => {
    openDB().then((db) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(key);
      request.onsuccess = () => {
        resolve();
        db.close();
      };
      request.onerror = () => {
        reject(request.error);
        db.close();
      };
    });
  });
}

export { getItem, setItem, removeItem };
