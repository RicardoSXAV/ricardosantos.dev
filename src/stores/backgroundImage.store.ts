import { create } from 'zustand';
import { loadBackgroundImage, deleteBackgroundImage } from '@/lib/indexeddb';

interface BackgroundImageStore {
  backgroundImageUrl: string | null;
  isLoading: boolean;
  loadBackgroundImage: () => Promise<void>;
  setBackgroundImageUrl: (url: string | null) => void;
  clearBackgroundImage: () => Promise<void>;
}

export const useBackgroundImageStore = create<BackgroundImageStore>((set) => ({
  backgroundImageUrl: null,
  isLoading: true,

  loadBackgroundImage: async () => {
    set({ isLoading: true });
    try {
      const imageUrl = await loadBackgroundImage();
      set({ backgroundImageUrl: imageUrl, isLoading: false });
    } catch (error) {
      console.error('Failed to load background image:', error);
      set({ isLoading: false });
    }
  },

  setBackgroundImageUrl: (url: string | null) => {
    // Revoke the old URL to free up memory
    set((state) => {
      if (state.backgroundImageUrl && state.backgroundImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(state.backgroundImageUrl);
      }
      return { backgroundImageUrl: url };
    });
  },

  clearBackgroundImage: async () => {
    try {
      await deleteBackgroundImage();
      set((state) => {
        if (state.backgroundImageUrl && state.backgroundImageUrl.startsWith('blob:')) {
          URL.revokeObjectURL(state.backgroundImageUrl);
        }
        return { backgroundImageUrl: null };
      });
    } catch (error) {
      console.error('Failed to clear background image:', error);
    }
  },
}));
