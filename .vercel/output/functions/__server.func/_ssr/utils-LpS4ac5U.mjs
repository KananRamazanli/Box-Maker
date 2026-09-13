import { n as create, t as persist } from "../_libs/zustand.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-LpS4ac5U.js
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
//#endregion
export { loadImage as a, uid as c, contain as i, useBook as l, PRESETS as n, pageGeom as o, cn as r, trimSize as s, A4_LANDSCAPE as t };
