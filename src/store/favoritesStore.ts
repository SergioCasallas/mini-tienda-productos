import { create } from 'zustand';
import { persist, StateStorage, createJSONStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';
import { Product } from '../types';

const storage = createMMKV({ id: 'favorites-storage' });

const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    return storage.remove(name);
  },
};

interface FavoritesState {
  favorites: Product[];
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: number) => void;
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: number) => boolean;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (product) => set((state) => ({ favorites: [...state.favorites, product] })),
      removeFavorite: (productId) =>
          set((state) => ({ favorites: state.favorites.filter((p) => p.id !== productId) })),
      toggleFavorite: (product) => {
        const { isFavorite, addFavorite, removeFavorite } = get();
        if (isFavorite(product.id)) {
          removeFavorite(product.id);
        } else {
          addFavorite(product);
        }
      },
      isFavorite: (productId) => get().favorites.some((p) => p.id === productId),
      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: 'favorites-store',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
