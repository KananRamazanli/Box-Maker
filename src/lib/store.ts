import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BookState, PackPage } from "./types";
import type { SizePresetId } from "./geometry";
import { PRESETS } from "./geometry";

const defaults: BookState = {
  pages: [],
  sizePreset: "a4-minus-1cm",
  customW: 277,
  customH: 190,
  marginSide: 7.5,
  marginTb: 5,
  printOnA4: true,
  holeGuide: true,
};

type Actions = {
  patch: (p: Partial<BookState>) => void;
  addPages: (pages: PackPage[]) => void;
  removePage: (id: string) => void;
  movePage: (id: string, dir: -1 | 1) => void;
  clearPages: () => void;
};

export const useBook = create<BookState & Actions>()(
  persist(
    (set, get) => ({
      ...defaults,
      patch: (p) => set(p),
      addPages: (pages) => set({ pages: [...get().pages, ...pages] }),
      removePage: (id) => set({ pages: get().pages.filter((p) => p.id !== id) }),
      clearPages: () => set({ pages: [] }),
      movePage: (id, dir) => {
        const list = [...get().pages];
        const i = list.findIndex((p) => p.id === id);
        const j = i + dir;
        if (i < 0 || j < 0 || j >= list.length) return;
        [list[i], list[j]] = [list[j], list[i]];
        set({ pages: list });
      },
    }),
    {
      name: "traybook-v2",
      skipHydration: true,
      partialize: (s) => ({
        sizePreset: s.sizePreset,
        customW: s.customW,
        customH: s.customH,
        marginSide: s.marginSide,
        marginTb: s.marginTb,
        printOnA4: s.printOnA4,
        holeGuide: s.holeGuide,
      }),
      merge: (persisted, current) => ({
        ...current,
        ...(typeof persisted === "object" && persisted ? persisted : {}),
        pages: current.pages ?? [],
      }),
    },
  ),
);

export function trimSize(s: Pick<BookState, "sizePreset" | "customW" | "customH">): {
  w: number;
  h: number;
} {
  if (s.sizePreset === "custom") return { w: s.customW, h: s.customH };
  const p = PRESETS[s.sizePreset as SizePresetId];
  return { w: p.w, h: p.h };
}
