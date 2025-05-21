import { StateStorage } from 'zustand/middleware';

// MyStateStorage can be extended in the future if we need more specialized methods
// beyond what StateStorage offers, while still being compatible with Zustand's persist.
export interface MyStateStorage extends StateStorage {
  // Example: clearAll?: () => void;
}

// LocalStorageService implements StateStorage (via MyStateStorage)
// It directly uses localStorage for string-based storage.
// JSON.parse and JSON.stringify will be handled by createJSONStorage in the store.
export class LocalStorageService implements MyStateStorage {
  getItem(key: string): string | null {
    // console.log(`LocalStorageService: getItem for key '${key}'`);
    const item = localStorage.getItem(key);
    // console.log(`LocalStorageService: retrieved item for key '${key}':`, item ? item.substring(0, 50) + '...' : null);
    return item;
  }

  setItem(key: string, value: string): void {
    // console.log(`LocalStorageService: setItem for key '${key}', value:`, value ? value.substring(0, 50) + '...' : null);
    localStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    // console.log(`LocalStorageService: removeItem for key '${key}'`);
    localStorage.removeItem(key);
  }
}
