export const A4_LANDSCAPE = { w: 297, h: 210 } as const;

export const PRESETS = {
  "a4-minus-1cm": {
    id: "a4-minus-1cm" as const,
    label: "A4 minus 1 cm each edge",
    hint: "277 × 190 mm — print on A4, cut 1 cm in",
    w: 277,
    h: 190,
  },
  "11.5x7.7": {
    id: "11.5x7.7" as const,
    label: "11.5 × 7.7 in",
    hint: "292.1 × 195.6 mm — same as the search-book file",
    w: 11.5 * 25.4,
    h: 7.7 * 25.4,
  },
  custom: {
    id: "custom" as const,
    label: "Custom millimetres",
    hint: "Set width and height",
    w: 277,
    h: 190,
  },
};

export type SizePresetId = keyof typeof PRESETS;

export type PageGeom = {
  pageW: number;
  pageH: number;
  marginX: number;
  marginY: number;
  contentX: number;
  contentY: number;
  contentW: number;
  contentH: number;
  headerH: number;
  footerH: number;
};

export function pageGeom(
  pageW: number,
  pageH: number,
  marginX: number,
  marginY: number,
): PageGeom {
  const contentX = marginX;
  const contentY = marginY;
  const contentW = Math.max(10, pageW - marginX * 2);
  const contentH = Math.max(10, pageH - marginY * 2);
  return {
    pageW,
    pageH,
    marginX,
    marginY,
    contentX,
    contentY,
    contentW,
    contentH,
    headerH: 12,
    footerH: 7,
  };
}

export function contain(
  iw: number,
  ih: number,
  boxW: number,
  boxH: number,
): { x: number; y: number; w: number; h: number } {
  const s = Math.min(boxW / iw, boxH / ih);
  const w = iw * s;
  const h = ih * s;
  return { x: (boxW - w) / 2, y: (boxH - h) / 2, w, h };
}
