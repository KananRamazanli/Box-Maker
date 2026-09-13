import { a as loadImage, i as contain, o as pageGeom, s as trimSize } from "./utils-LpS4ac5U.mjs";
import { t as PptxGenJS } from "../_libs/pptxgenjs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pptx-C_F7jgmH.js
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
//#endregion
export { downloadPptx };
