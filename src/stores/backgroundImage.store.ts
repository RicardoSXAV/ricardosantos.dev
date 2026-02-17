import { create } from 'zustand';
import { loadBackgroundImage, deleteBackgroundImage } from '@/lib/indexeddb';
import deepGradient from '@/assets/backgrounds/deep-gradient.svg';
import starryNight from '@/assets/backgrounds/starry-night.svg';
import liquidAura from '@/assets/backgrounds/liquid-aura.png';
import arcticPeaks from '@/assets/backgrounds/arctic-peaks.svg';

const SYSTEM_BACKGROUND_KEY = 'systemBackgroundId';
const DEFAULT_SYSTEM_BACKGROUND_ID = 'deep-gradient';

const SYSTEM_BACKGROUND_URLS: Record<string, string> = {
  'deep-gradient': deepGradient.src,
  'starry-night': starryNight.src,
  'liquid-aura': liquidAura.src,
  'arctic-peaks': arcticPeaks.src,
};

interface BackgroundImageStore {
  backgroundImageUrl: string | null;
  isLoading: boolean;
  systemBackgroundId: string | null;
  loadBackgroundImage: () => Promise<void>;
  setBackgroundImageUrl: (url: string | null) => void;
  setSystemBackgroundId: (id: string | null) => void;
  clearBackgroundImage: () => Promise<void>;
}

export const useBackgroundImageStore = create<BackgroundImageStore>((set) => ({
  backgroundImageUrl: null,
  isLoading: true,
  systemBackgroundId: DEFAULT_SYSTEM_BACKGROUND_ID,

  loadBackgroundImage: async () => {
    set({ isLoading: true });
    try {
      const imageUrl = await loadBackgroundImage();
      if (imageUrl) {
        set({ backgroundImageUrl: imageUrl, isLoading: false });
        return;
      }

      const storedId =
        typeof window !== 'undefined'
          ? window.localStorage.getItem(SYSTEM_BACKGROUND_KEY)
          : null;
      const resolvedId =
        storedId && SYSTEM_BACKGROUND_URLS[storedId]
          ? storedId
          : DEFAULT_SYSTEM_BACKGROUND_ID;
      const systemUrl = SYSTEM_BACKGROUND_URLS[resolvedId] ?? null;

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(SYSTEM_BACKGROUND_KEY, resolvedId);
      }

      set({
        backgroundImageUrl: systemUrl,
        systemBackgroundId: resolvedId,
        isLoading: false,
      });
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

  setSystemBackgroundId: (id: string | null) => {
    if (typeof window !== 'undefined') {
      if (id) {
        window.localStorage.setItem(SYSTEM_BACKGROUND_KEY, id);
      } else {
        window.localStorage.removeItem(SYSTEM_BACKGROUND_KEY);
      }
    }
    set({ systemBackgroundId: id });
  },

  clearBackgroundImage: async () => {
    try {
      await deleteBackgroundImage();
      const storedId =
        typeof window !== 'undefined'
          ? window.localStorage.getItem(SYSTEM_BACKGROUND_KEY)
          : null;
      const resolvedId =
        storedId && SYSTEM_BACKGROUND_URLS[storedId]
          ? storedId
          : DEFAULT_SYSTEM_BACKGROUND_ID;
      const systemUrl = SYSTEM_BACKGROUND_URLS[resolvedId] ?? null;

      set((state) => {
        if (state.backgroundImageUrl && state.backgroundImageUrl.startsWith('blob:')) {
          URL.revokeObjectURL(state.backgroundImageUrl);
        }
        return {
          backgroundImageUrl: systemUrl,
          systemBackgroundId: resolvedId,
        };
      });
    } catch (error) {
      console.error('Failed to clear background image:', error);
    }
  },
}));
