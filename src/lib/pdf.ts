import { jsPDF } from "jspdf";
import type { BookState } from "./types";
import { A4_LANDSCAPE, contain, pageGeom } from "./geometry";
import { trimSize } from "./store";
import { loadImage } from "./utils";

type Doc = jsPDF;

function isPng(src: string) {
  return src.startsWith("data:image/png") || src.toLowerCase().endsWith(".png");
}

export async function buildPdf(book: BookState): Promise<jsPDF> {
  if (book.pages.length === 0) throw new Error("Add pages first");
  const trim = trimSize(book);
  const onA4 = book.printOnA4;
  const pageW = onA4 ? A4_LANDSCAPE.w : trim.w;
  const pageH = onA4 ? A4_LANDSCAPE.h : trim.h;
  const ox = onA4 ? (pageW - trim.w) / 2 : 0;
  const oy = onA4 ? (pageH - trim.h) / 2 : 0;
  const g = pageGeom(trim.w, trim.h, book.marginSide, book.marginTb);
  const doc = new jsPDF({
    orientation: pageW >= pageH ? "landscape" : "portrait",
    unit: "mm",
    format: [pageW, pageH],
    compress: true,
  });

  for (let i = 0; i < book.pages.length; i++) {
    if (i > 0) doc.addPage([pageW, pageH], pageW >= pageH ? "l" : "p");
    if (onA4) drawCropMarks(doc, ox, oy, trim.w, trim.h);
    if (book.holeGuide) drawHole(doc, ox, oy, trim.h, book.marginSide);
    await drawPage(doc, book.pages[i].src, g, ox, oy);
  }
  return doc;
}

async function drawPage(
  doc: Doc,
  src: string,
  g: ReturnType<typeof pageGeom>,
  ox: number,
  oy: number,
) {
  const img = await loadImage(src);
  const box = contain(img.width, img.height, g.contentW, g.contentH);
  const data = src.startsWith("data:") ? src : await toJpeg(src);
  doc.addImage(
    data,
    isPng(data) ? "PNG" : "JPEG",
    ox + g.contentX + box.x,
    oy + g.contentY + box.y,
    box.w,
    box.h,
  );
}

async function toJpeg(src: string): Promise<string> {
  const img = await loadImage(src);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL("image/jpeg", 0.9);
}

function drawCropMarks(doc: Doc, ox: number, oy: number, w: number, h: number) {
  doc.setDrawColor(80);
  doc.setLineWidth(0.15);
  const m = 4;
  const gap = 1.2;
  const corners: [number, number, number, number][] = [
    [ox, oy, -1, -1],
    [ox + w, oy, 1, -1],
    [ox, oy + h, -1, 1],
    [ox + w, oy + h, 1, 1],
  ];
  for (const [x, y, dx, dy] of corners) {
    doc.line(x + dx * gap, y, x + dx * (gap + m), y);
    doc.line(x, y + dy * gap, x, y + dy * (gap + m));
  }
}

function drawHole(doc: Doc, ox: number, oy: number, pageH: number, marginX: number) {
  const cx = ox + marginX / 2;
  const cy = oy + pageH / 2;
  doc.setDrawColor(180);
  doc.setLineWidth(0.2);
  doc.circle(cx, cy, 1.8, "S");
}
