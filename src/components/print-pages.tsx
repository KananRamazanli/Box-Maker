import type { BookState, PackPage } from "@/lib/types";
import { trimSize } from "@/lib/store";

export function SheetPage({ book, page }: { book: BookState; page: PackPage }) {
  const trim = trimSize(book);
  return (
    <div
      className="print-page"
      style={{
        width: `${trim.w}mm`,
        height: `${trim.h}mm`,
        padding: `${book.marginTb}mm ${book.marginSide}mm`,
        boxSizing: "border-box",
        background: "#fff",
      }}
    >
      <img src={page.src} alt="" className="h-full w-full object-contain" />
    </div>
  );
}
