import { SheetPage } from "./print-pages";
import { trimSize, useBook } from "@/lib/store";
import { useEffect, useRef, useState } from "react";

export function PageStrip() {
  const book = useBook();
  const trim = trimSize(book);
  const pages = book.pages ?? [];
  const host = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.35);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const fit = () => {
      const availW = Math.max(180, el.clientWidth - 32);
      setScale(availW / (trim.w * 3.779527559));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [trim.w]);

  return (
    <div ref={host} className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto p-4 md:p-6">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.16em] text-muted">
          {pages.length
            ? `${pages.length} pages · ${trim.w.toFixed(1)} × ${trim.h.toFixed(1)} mm`
            : "No pages yet"}
        </p>
        <p className="text-xs text-subtle">
          Empty {book.marginSide} mm sides · {book.marginTb} mm top/bottom
        </p>
      </div>
      {pages.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-border px-8 py-16 text-center text-sm text-muted">
          Drop your cover, photos and manual here. They stay as-is — only the print size is matched.
        </div>
      ) : (
        <div className="flex flex-col items-center gap-8 pb-16">
          {pages.map((p, i) => (
            <figure key={p.id} className="flex flex-col items-center gap-2">
              <div
                style={{
                  width: trim.w * 3.779527559 * scale,
                  height: trim.h * 3.779527559 * scale,
                }}
              >
                <div
                  style={{
                    width: `${trim.w}mm`,
                    height: `${trim.h}mm`,
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                  }}
                >
                  <SheetPage book={book} page={p} />
                </div>
              </div>
              <figcaption className="max-w-full truncate font-mono text-[11px] text-muted">
                {String(i + 1).padStart(2, "0")} · {p.name}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
