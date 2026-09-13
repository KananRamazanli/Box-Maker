import { BookEditor } from "@/components/book-editor";
import { PageStrip } from "@/components/page-strip";
import { useBook } from "@/lib/store";
import { useEffect } from "react";

export function AppShell() {
  useEffect(() => {
    void Promise.resolve(useBook.persist.rehydrate());
  }, []);
  return (
    <main className="flex min-h-dvh flex-col bg-bg text-fg md:flex-row">
      <BookEditor />
      <PageStrip />
    </main>
  );
}
