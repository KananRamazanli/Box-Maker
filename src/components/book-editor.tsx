import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";
import { PRESETS } from "@/lib/geometry";
import { filesToPages } from "@/lib/import-files";
import { buildPdf } from "@/lib/pdf";
import { downloadPptx } from "@/lib/pptx";
import { trimSize, useBook } from "@/lib/store";
import { ChevronDown, ChevronUp, Download, Trash2 } from "lucide-react";
import { useState } from "react";

export function BookEditor() {
  const book = useBook();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const pages = book.pages ?? [];
  const trim = trimSize(book);

  async function addFiles(list: FileList | File[]) {
    setErr(null);
    setBusy(true);
    try {
      const incoming = await filesToPages([...list]);
      if (!incoming.length) throw new Error("Use images or PDF files");
      book.addPages(incoming);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not read files");
    } finally {
      setBusy(false);
    }
  }

  async function exportPdf() {
    setErr(null);
    setBusy(true);
    try {
      const doc = await buildPdf(book);
      doc.save("toolbox-book.pdf");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "PDF export failed");
    } finally {
      setBusy(false);
    }
  }

  async function exportPptx() {
    setErr(null);
    setBusy(true);
    try {
      await downloadPptx(book);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "PPTX export failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <aside className="flex w-full shrink-0 flex-col gap-6 overflow-auto border-border bg-surface md:w-[380px] md:border-r">
      <header className="border-b border-border px-5 py-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-primary">Print pack</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">TrayBook</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Combine the cover, photos and manual you already have. Same print size. Nothing is redesigned.
        </p>
      </header>

      <section className="px-5">
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            if (e.dataTransfer.files.length) void addFiles(e.dataTransfer.files);
          }}
          className={`flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed px-4 py-6 text-center text-sm transition-colors ${
            drag ? "border-primary bg-elevated text-fg" : "border-border bg-bg text-muted"
          }`}
        >
          {busy ? "Reading files…" : "Drop cover / photos / manual PDF"}
          <span className="mt-1 text-xs text-subtle">or click to choose · images and PDF</span>
          <input
            type="file"
            accept="image/*,.pdf,application/pdf"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) void addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
      </section>

      <section className="flex flex-col gap-2 px-5">
        <div className="flex items-center justify-between">
          <Label className="mb-0">Pages in order</Label>
          {pages.length ? (
            <Button variant="ghost" size="sm" onClick={book.clearPages}>
              Clear
            </Button>
          ) : null}
        </div>
        {pages.length === 0 ? (
          <p className="text-xs text-subtle">Cover first, then photos, then list pages — or any order you print.</p>
        ) : (
          <ol className="flex flex-col gap-1">
            {pages.map((p, i) => (
              <li
                key={p.id}
                className="flex items-center gap-2 rounded-[var(--radius-sm)] border border-border bg-elevated px-2 py-1.5"
              >
                <img src={p.src} alt="" className="h-9 w-12 shrink-0 rounded-sm bg-bg object-contain" />
                <span className="min-w-0 flex-1 truncate text-xs">
                  {i + 1}. {p.name}
                </span>
                <Button variant="ghost" size="icon" className="size-8" onClick={() => book.movePage(p.id, -1)}>
                  <ChevronUp className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" className="size-8" onClick={() => book.movePage(p.id, 1)}>
                  <ChevronDown className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" className="size-8" onClick={() => book.removePage(p.id)}>
                  <Trash2 className="size-4" />
                </Button>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="flex flex-col gap-3 px-5">
        <Label>Print size</Label>
        <div className="grid gap-2">
          {(Object.keys(PRESETS) as Array<keyof typeof PRESETS>).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => book.patch({ sizePreset: id })}
              className={`rounded-[var(--radius-md)] border px-3 py-3 text-left transition-colors ${
                book.sizePreset === id
                  ? "border-primary bg-elevated"
                  : "border-border bg-bg hover:border-muted"
              }`}
            >
              <div className="text-sm font-medium">{PRESETS[id].label}</div>
              <div className="text-xs text-muted">{PRESETS[id].hint}</div>
            </button>
          ))}
        </div>
        {book.sizePreset === "custom" ? (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Width mm</Label>
              <Input
                className="mt-1"
                type="number"
                min={80}
                value={book.customW}
                onChange={(e) => book.patch({ customW: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label>Height mm</Label>
              <Input
                className="mt-1"
                type="number"
                min={80}
                value={book.customH}
                onChange={(e) => book.patch({ customH: Number(e.target.value) })}
              />
            </div>
          </div>
        ) : null}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Side empty mm</Label>
            <Input
              className="mt-1"
              type="number"
              step={0.5}
              min={0}
              value={book.marginSide}
              onChange={(e) => book.patch({ marginSide: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label>Top / bottom empty mm</Label>
            <Input
              className="mt-1"
              type="number"
              step={0.5}
              min={0}
              value={book.marginTb}
              onChange={(e) => book.patch({ marginTb: Number(e.target.value) })}
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={book.printOnA4}
            onChange={(e) => book.patch({ printOnA4: e.target.checked })}
          />
          Place on A4 with cut marks
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={book.holeGuide}
            onChange={(e) => book.patch({ holeGuide: e.target.checked })}
          />
          Hole-punch guide on left
        </label>
        <p className="text-xs text-subtle">
          Trim {trim.w.toFixed(1)} × {trim.h.toFixed(1)} mm. Print 100%, cut, laminate, punch.
        </p>
      </section>

      <div className="sticky bottom-0 mt-auto flex flex-col gap-2 border-t border-border bg-surface/95 px-5 py-4">
        {err ? <p className="text-xs text-danger">{err}</p> : null}
        <div className="grid grid-cols-2 gap-2">
          <Button size="lg" onClick={exportPdf} disabled={busy || !pages.length}>
            <Download className="size-4" />
            {busy ? "…" : "PDF"}
          </Button>
          <Button size="lg" variant="secondary" onClick={exportPptx} disabled={busy || !pages.length}>
            <Download className="size-4" />
            {busy ? "…" : "PPTX"}
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          disabled={busy}
          onClick={async () => {
            setErr(null);
            setBusy(true);
            try {
              const urls = [
                ["/samples/pallet1.png", "PALET 1.jpg"],
                ["/samples/pallet2.png", "PALET 2.jpg"],
                ["/samples/pallet3.png", "PALET 3.jpg"],
                ["/samples/manual.pdf", "search-book.pdf"],
              ] as const;
              const files: File[] = [];
              for (const [url, name] of urls) {
                const res = await fetch(url);
                const blob = await res.blob();
                files.push(new File([blob], name, { type: blob.type || "application/octet-stream" }));
              }
              const pages = await filesToPages(files);
              book.clearPages();
              book.addPages(pages);
            } catch (e) {
              setErr(e instanceof Error ? e.message : "Could not load kit files");
            } finally {
              setBusy(false);
            }
          }}
        >
          Load AHY-T0035 photos + manual
        </Button>
      </div>
    </aside>
  );
}
