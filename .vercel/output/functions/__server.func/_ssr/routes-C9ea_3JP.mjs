import { o as __toESM } from "../_runtime.mjs";
import { L as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as ChevronDown, i as ChevronUp, n as Trash2, r as Download } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as require_jspdf_node_min } from "../_libs/jspdf.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { t as PptxGenJS } from "../_libs/pptxgenjs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C9ea_3JP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_jspdf_node_min = require_jspdf_node_min();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function uid() {
	return crypto.randomUUID();
}
function loadImage(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.onload = () => resolve(img);
		img.onerror = () => reject(/* @__PURE__ */ new Error("Could not load image"));
		img.src = src;
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] text-sm font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70", {
	variants: {
		variant: {
			default: "bg-primary text-primary-fg hover:bg-primary/90",
			secondary: "bg-elevated text-fg border border-border hover:bg-surface",
			ghost: "text-muted hover:text-fg hover:bg-elevated",
			danger: "bg-danger text-fg hover:bg-danger/90"
		},
		size: {
			default: "h-10 px-4",
			sm: "h-8 px-3 text-xs",
			lg: "h-11 px-5",
			icon: "size-10"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("block text-[11px] font-medium uppercase tracking-[0.14em] text-muted", className),
		...props
	});
}
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-10 w-full rounded-[var(--radius-sm)] border border-border bg-bg px-3 text-sm text-fg placeholder:text-subtle outline-none focus:ring-2 focus:ring-primary/50", className),
		...props
	});
}
var A4_LANDSCAPE = {
	w: 297,
	h: 210
};
var PRESETS = {
	"a4-minus-1cm": {
		id: "a4-minus-1cm",
		label: "A4 minus 1 cm each edge",
		hint: "277 × 190 mm — print on A4, cut 1 cm in",
		w: 277,
		h: 190
	},
	"11.5x7.7": {
		id: "11.5x7.7",
		label: "11.5 × 7.7 in",
		hint: "292.1 × 195.6 mm — same as the search-book file",
		w: 11.5 * 25.4,
		h: 7.7 * 25.4
	},
	custom: {
		id: "custom",
		label: "Custom millimetres",
		hint: "Set width and height",
		w: 277,
		h: 190
	}
};
function pageGeom(pageW, pageH, marginX, marginY) {
	return {
		pageW,
		pageH,
		marginX,
		marginY,
		contentX: marginX,
		contentY: marginY,
		contentW: Math.max(10, pageW - marginX * 2),
		contentH: Math.max(10, pageH - marginY * 2),
		headerH: 12,
		footerH: 7
	};
}
function contain(iw, ih, boxW, boxH) {
	const s = Math.min(boxW / iw, boxH / ih);
	const w = iw * s;
	const h = ih * s;
	return {
		x: (boxW - w) / 2,
		y: (boxH - h) / 2,
		w,
		h
	};
}
async function filesToPages(files) {
	const out = [];
	for (const file of files) {
		const type = file.type || "";
		const name = file.name.toLowerCase();
		if (type === "application/pdf" || name.endsWith(".pdf")) out.push(...await pdfToPages(file));
		else if (type.startsWith("image/") || /\.(png|jpe?g|webp|gif|bmp)$/i.test(name)) out.push({
			id: uid(),
			name: file.name,
			src: await blobToJpeg(file)
		});
	}
	return out;
}
async function blobToJpeg(file, maxEdge = 2e3) {
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
		return canvas.toDataURL("image/jpeg", .9);
	} finally {
		URL.revokeObjectURL(url);
	}
}
function load(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = () => reject(/* @__PURE__ */ new Error("Could not read image"));
		img.src = src;
	});
}
async function pdfToPages(file) {
	const pdfjs = await import("../_libs/pdfjs-dist.mjs").then((n) => n.t);
	pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
	const data = await file.arrayBuffer();
	const doc = await pdfjs.getDocument({ data }).promise;
	const pages = [];
	for (let i = 1; i <= doc.numPages; i++) {
		const page = await doc.getPage(i);
		const base = page.getViewport({ scale: 1 });
		const scale = Math.min(2.2, 2e3 / Math.max(base.width, base.height));
		const viewport = page.getViewport({ scale });
		const canvas = document.createElement("canvas");
		canvas.width = Math.ceil(viewport.width);
		canvas.height = Math.ceil(viewport.height);
		const ctx = canvas.getContext("2d");
		if (!ctx) continue;
		ctx.fillStyle = "#fff";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		await page.render({
			canvasContext: ctx,
			viewport,
			canvas
		}).promise;
		pages.push({
			id: uid(),
			name: `${file.name} · p${i}`,
			src: canvas.toDataURL("image/jpeg", .9)
		});
	}
	return pages;
}
var defaults = {
	pages: [],
	sizePreset: "a4-minus-1cm",
	customW: 277,
	customH: 190,
	marginSide: 7.5,
	marginTb: 5,
	printOnA4: true,
	holeGuide: true
};
var useBook = create()(persist((set, get) => ({
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
	}
}), {
	name: "traybook-v2",
	skipHydration: true,
	partialize: (s) => ({
		sizePreset: s.sizePreset,
		customW: s.customW,
		customH: s.customH,
		marginSide: s.marginSide,
		marginTb: s.marginTb,
		printOnA4: s.printOnA4,
		holeGuide: s.holeGuide
	}),
	merge: (persisted, current) => ({
		...current,
		...typeof persisted === "object" && persisted ? persisted : {},
		pages: current.pages ?? []
	})
}));
function trimSize(s) {
	if (s.sizePreset === "custom") return {
		w: s.customW,
		h: s.customH
	};
	const p = PRESETS[s.sizePreset];
	return {
		w: p.w,
		h: p.h
	};
}
function isPng(src) {
	return src.startsWith("data:image/png") || src.toLowerCase().endsWith(".png");
}
async function buildPdf(book) {
	if (book.pages.length === 0) throw new Error("Add pages first");
	const trim = trimSize(book);
	const onA4 = book.printOnA4;
	const pageW = onA4 ? A4_LANDSCAPE.w : trim.w;
	const pageH = onA4 ? A4_LANDSCAPE.h : trim.h;
	const ox = onA4 ? (pageW - trim.w) / 2 : 0;
	const oy = onA4 ? (pageH - trim.h) / 2 : 0;
	const g = pageGeom(trim.w, trim.h, book.marginSide, book.marginTb);
	const doc = new import_jspdf_node_min.jsPDF({
		orientation: pageW >= pageH ? "landscape" : "portrait",
		unit: "mm",
		format: [pageW, pageH],
		compress: true
	});
	for (let i = 0; i < book.pages.length; i++) {
		if (i > 0) doc.addPage([pageW, pageH], pageW >= pageH ? "l" : "p");
		if (onA4) drawCropMarks(doc, ox, oy, trim.w, trim.h);
		if (book.holeGuide) drawHole(doc, ox, oy, trim.h, book.marginSide);
		await drawPage(doc, book.pages[i].src, g, ox, oy);
	}
	return doc;
}
async function drawPage(doc, src, g, ox, oy) {
	const img = await loadImage(src);
	const box = contain(img.width, img.height, g.contentW, g.contentH);
	const data = src.startsWith("data:") ? src : await toJpeg(src);
	doc.addImage(data, isPng(data) ? "PNG" : "JPEG", ox + g.contentX + box.x, oy + g.contentY + box.y, box.w, box.h);
}
async function toJpeg(src) {
	const img = await loadImage(src);
	const canvas = document.createElement("canvas");
	canvas.width = img.width;
	canvas.height = img.height;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("canvas");
	ctx.fillStyle = "#fff";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(img, 0, 0);
	return canvas.toDataURL("image/jpeg", .9);
}
function drawCropMarks(doc, ox, oy, w, h) {
	doc.setDrawColor(80);
	doc.setLineWidth(.15);
	const gap = 1.2;
	const corners = [
		[
			ox,
			oy,
			-1,
			-1
		],
		[
			ox + w,
			oy,
			1,
			-1
		],
		[
			ox,
			oy + h,
			-1,
			1
		],
		[
			ox + w,
			oy + h,
			1,
			1
		]
	];
	for (const [x, y, dx, dy] of corners) {
		doc.line(x + dx * gap, y, x + dx * 5.2, y);
		doc.line(x, y + dy * gap, x, y + dy * 5.2);
	}
}
function drawHole(doc, ox, oy, pageH, marginX) {
	const cx = ox + marginX / 2;
	const cy = oy + pageH / 2;
	doc.setDrawColor(180);
	doc.setLineWidth(.2);
	doc.circle(cx, cy, 1.8, "S");
}
function mmToIn(mm) {
	return mm / 25.4;
}
async function asDataUrl(src) {
	if (src.startsWith("data:")) return src;
	const img = await loadImage(src);
	const canvas = document.createElement("canvas");
	canvas.width = img.width;
	canvas.height = img.height;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("canvas");
	ctx.fillStyle = "#fff";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(img, 0, 0);
	return canvas.toDataURL("image/jpeg", .9);
}
async function downloadPptx(book) {
	if (book.pages.length === 0) throw new Error("Add pages first");
	const trim = trimSize(book);
	const wIn = mmToIn(trim.w);
	const hIn = mmToIn(trim.h);
	const pptx = new PptxGenJS();
	pptx.defineLayout({
		name: "BOOK",
		width: wIn,
		height: hIn
	});
	pptx.layout = "BOOK";
	pptx.title = "Toolbox book";
	const g = pageGeom(wIn, hIn, mmToIn(book.marginSide), mmToIn(book.marginTb));
	for (const page of book.pages) {
		const slide = pptx.addSlide();
		slide.background = { color: "FFFFFF" };
		const img = await loadImage(page.src);
		const box = contain(img.width, img.height, g.contentW, g.contentH);
		const data = await asDataUrl(page.src);
		slide.addImage({
			data,
			x: g.contentX + box.x,
			y: g.contentY + box.y,
			w: box.w,
			h: box.h
		});
		if (book.holeGuide) {
			const d = .14;
			slide.addShape("ellipse", {
				x: g.marginX / 2 - d / 2,
				y: hIn / 2 - d / 2,
				w: d,
				h: d,
				line: {
					color: "B4B4B4",
					width: .75
				},
				fill: { type: "none" }
			});
		}
	}
	await pptx.writeFile({ fileName: "toolbox-book.pptx" });
}
function BookEditor() {
	const book = useBook();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [err, setErr] = (0, import_react.useState)(null);
	const [drag, setDrag] = (0, import_react.useState)(false);
	const pages = book.pages ?? [];
	const trim = trimSize(book);
	async function addFiles(list) {
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
			(await buildPdf(book)).save("toolbox-book.pdf");
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "flex w-full shrink-0 flex-col gap-6 overflow-auto border-border bg-surface md:w-[380px] md:border-r",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "border-b border-border px-5 py-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-medium uppercase tracking-[0.2em] text-primary",
						children: "Print pack"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 text-2xl font-semibold tracking-tight",
						children: "TrayBook"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: "Combine the cover, photos and manual you already have. Same print size. Nothing is redesigned."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "px-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					onDragOver: (e) => {
						e.preventDefault();
						setDrag(true);
					},
					onDragLeave: () => setDrag(false),
					onDrop: (e) => {
						e.preventDefault();
						setDrag(false);
						if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
					},
					className: `flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed px-4 py-6 text-center text-sm transition-colors ${drag ? "border-primary bg-elevated text-fg" : "border-border bg-bg text-muted"}`,
					children: [
						busy ? "Reading files…" : "Drop cover / photos / manual PDF",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 text-xs text-subtle",
							children: "or click to choose · images and PDF"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							accept: "image/*,.pdf,application/pdf",
							multiple: true,
							className: "hidden",
							onChange: (e) => {
								if (e.target.files?.length) addFiles(e.target.files);
								e.target.value = "";
							}
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-2 px-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "mb-0",
						children: "Pages in order"
					}), pages.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: book.clearPages,
						children: "Clear"
					}) : null]
				}), pages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-subtle",
					children: "Cover first, then photos, then list pages — or any order you print."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "flex flex-col gap-1",
					children: pages.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-2 rounded-[var(--radius-sm)] border border-border bg-elevated px-2 py-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: p.src,
								alt: "",
								className: "h-9 w-12 shrink-0 rounded-sm bg-bg object-contain"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1 truncate text-xs",
								children: [
									i + 1,
									". ",
									p.name
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "size-8",
								onClick: () => book.movePage(p.id, -1),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "size-8",
								onClick: () => book.movePage(p.id, 1),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "size-8",
								onClick: () => book.removePage(p.id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
							})
						]
					}, p.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-3 px-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Print size" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-2",
						children: Object.keys(PRESETS).map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => book.patch({ sizePreset: id }),
							className: `rounded-[var(--radius-md)] border px-3 py-3 text-left transition-colors ${book.sizePreset === id ? "border-primary bg-elevated" : "border-border bg-bg hover:border-muted"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium",
								children: PRESETS[id].label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted",
								children: PRESETS[id].hint
							})]
						}, id))
					}),
					book.sizePreset === "custom" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Width mm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-1",
							type: "number",
							min: 80,
							value: book.customW,
							onChange: (e) => book.patch({ customW: Number(e.target.value) })
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Height mm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-1",
							type: "number",
							min: 80,
							value: book.customH,
							onChange: (e) => book.patch({ customH: Number(e.target.value) })
						})] })]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Side empty mm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-1",
							type: "number",
							step: .5,
							min: 0,
							value: book.marginSide,
							onChange: (e) => book.patch({ marginSide: Number(e.target.value) })
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Top / bottom empty mm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-1",
							type: "number",
							step: .5,
							min: 0,
							value: book.marginTb,
							onChange: (e) => book.patch({ marginTb: Number(e.target.value) })
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: book.printOnA4,
							onChange: (e) => book.patch({ printOnA4: e.target.checked })
						}), "Place on A4 with cut marks"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: book.holeGuide,
							onChange: (e) => book.patch({ holeGuide: e.target.checked })
						}), "Hole-punch guide on left"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-subtle",
						children: [
							"Trim ",
							trim.w.toFixed(1),
							" × ",
							trim.h.toFixed(1),
							" mm. Print 100%, cut, laminate, punch."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sticky bottom-0 mt-auto flex flex-col gap-2 border-t border-border bg-surface/95 px-5 py-4",
				children: [
					err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-danger",
						children: err
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "lg",
							onClick: exportPdf,
							disabled: busy || !pages.length,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), busy ? "…" : "PDF"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "lg",
							variant: "secondary",
							onClick: exportPptx,
							disabled: busy || !pages.length,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), busy ? "…" : "PPTX"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						disabled: busy,
						onClick: async () => {
							setErr(null);
							setBusy(true);
							try {
								const urls = [
									["/samples/pallet1.png", "PALET 1.jpg"],
									["/samples/pallet2.png", "PALET 2.jpg"],
									["/samples/pallet3.png", "PALET 3.jpg"],
									["/samples/manual.pdf", "search-book.pdf"]
								];
								const files = [];
								for (const [url, name] of urls) {
									const blob = await (await fetch(url)).blob();
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
						},
						children: "Load AHY-T0035 photos + manual"
					})
				]
			})
		]
	});
}
function SheetPage({ book, page }) {
	const trim = trimSize(book);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "print-page",
		style: {
			width: `${trim.w}mm`,
			height: `${trim.h}mm`,
			padding: `${book.marginTb}mm ${book.marginSide}mm`,
			boxSizing: "border-box",
			background: "#fff"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: page.src,
			alt: "",
			className: "h-full w-full object-contain"
		})
	});
}
function PageStrip() {
	const book = useBook();
	const trim = trimSize(book);
	const pages = book.pages ?? [];
	const host = (0, import_react.useRef)(null);
	const [scale, setScale] = (0, import_react.useState)(.35);
	(0, import_react.useEffect)(() => {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: host,
		className: "flex min-h-0 flex-1 flex-col gap-4 overflow-auto p-4 md:p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-baseline justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.16em] text-muted",
				children: pages.length ? `${pages.length} pages · ${trim.w.toFixed(1)} × ${trim.h.toFixed(1)} mm` : "No pages yet"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-subtle",
				children: [
					"Empty ",
					book.marginSide,
					" mm sides · ",
					book.marginTb,
					" mm top/bottom"
				]
			})]
		}), pages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-1 items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-border px-8 py-16 text-center text-sm text-muted",
			children: "Drop your cover, photos and manual here. They stay as-is — only the print size is matched."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col items-center gap-8 pb-16",
			children: pages.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
				className: "flex flex-col items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						width: trim.w * 3.779527559 * scale,
						height: trim.h * 3.779527559 * scale
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							width: `${trim.w}mm`,
							height: `${trim.h}mm`,
							transform: `scale(${scale})`,
							transformOrigin: "top left"
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetPage, {
							book,
							page: p
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
					className: "max-w-full truncate font-mono text-[11px] text-muted",
					children: [
						String(i + 1).padStart(2, "0"),
						" · ",
						p.name
					]
				})]
			}, p.id))
		})]
	});
}
function Home() {
	(0, import_react.useEffect)(() => {
		Promise.resolve(useBook.persist.rehydrate());
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-dvh flex-col bg-bg text-fg md:flex-row",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookEditor, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageStrip, {})]
	});
}
//#endregion
export { Home as component };
