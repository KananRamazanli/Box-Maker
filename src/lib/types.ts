import type { SizePresetId } from "./geometry";

export type PackPage = {
  id: string;
  name: string;
  src: string;
};

export type BookState = {
  pages: PackPage[];
  sizePreset: SizePresetId;
  customW: number;
  customH: number;
  marginSide: number;
  marginTb: number;
  printOnA4: boolean;
  holeGuide: boolean;
};
