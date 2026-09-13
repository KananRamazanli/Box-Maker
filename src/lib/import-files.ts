import { uid } from "./utils";
import type { PackPage } from "./types";

export async function filesToPages(files: File[]): Promise<PackPage[]> {
  const out: PackPage[] = [];
  for (const file of files) {
    const type = file.type || "";
    const name = file.name.toLowerCase();
    if (type === "application/pdf" || name.endsWith(".pdf")) {
      out.push(...(await pdfToPages(file)));
    } else if (type.startsWith("image/") || /\.(png|jpe?g|webp|gif|bmp)$/i.test(name)) {
      out.push({
        id: uid(),
        name: file.name,
        src: await blobToJpeg(file),
      });
    }
  }
  return out;
}

async function blobToJpeg(file: Blob, maxEdge = 2000): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await load(url);
    const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    return canvas.toDataURL("image/jpeg", 0.9);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function load(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not read image"));
    img.src = src;
  });
}

async function pdfToPages(file: File): Promise<PackPage[]> {
  const pdfjs = await import("pdfjs-dist");
  const worker = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
  const data = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({
    data,
    wasmUrl: "/wasm/",
    useSystemFonts: true,
    disableAutoFetch: true,
    disableStream: true,
    disableRange: true,
  }).promise;
  const pages: PackPage[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const base = page.getViewport({ scale: 1 });
    const scale = Math.min(2.2, 2000 / Math.max(base.width, base.height));
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) continue;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport, canvas }).promise;
    pages.push({
      id: uid(),
      name: `${file.name} · p${i}`,
      src: canvas.toDataURL("image/jpeg", 0.9),
    });
  }
  return pages;
}
