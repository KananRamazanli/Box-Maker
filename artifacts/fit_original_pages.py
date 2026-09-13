#!/usr/bin/env python3
"""Place original pages onto 11.5x7.7 in with 0.75 cm side / 0.5 cm top-bottom empty.
No design changes — only size + margins."""

from reportlab.lib.units import inch, cm
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.colors import HexColor
from pypdf import PdfReader, PdfWriter, Transformation, PageObject
import io

PAGE_W = 11.5 * inch
PAGE_H = 7.7 * inch
MX = 0.75 * cm
MY = 0.5 * cm

PHOTO_PAGES = [
    "/tmp/orig_ppt-1.png",
    "/tmp/orig_ppt-2.png",
    "/tmp/orig_ppt-3.png",
    "/tmp/orig_ppt-4.png",
]
LIST_PAGES = [
    "/tmp/orig_list-1.png",
    "/tmp/orig_list-2.png",
    "/tmp/orig_list-3.png",
]

OUT_PHOTOS = "/home/workdir/artifacts/AHY-T0035_photos_same_size.pdf"
OUT_LISTS = "/home/workdir/artifacts/AHY-T0035_lists_same_size.pdf"
OUT_ALL = "/home/workdir/artifacts/AHY-T0035_all_pages_same_size.pdf"


def place(c, img_path):
    ir = ImageReader(img_path)
    iw, ih = ir.getSize()
    box_x, box_y = MX, MY
    box_w = PAGE_W - 2 * MX
    box_h = PAGE_H - 2 * MY
    scale = min(box_w / iw, box_h / ih)
    dw, dh = iw * scale, ih * scale
    dx = box_x + (box_w - dw) / 2.0
    dy = box_y + (box_h - dh) / 2.0
    c.drawImage(ir, dx, dy, width=dw, height=dh, preserveAspectRatio=True, mask="auto")


def write_pdf(paths, out):
    c = canvas.Canvas(out, pagesize=(PAGE_W, PAGE_H))
    c.setTitle("AHY-T0035 — same page size")
    for p in paths:
        place(c, p)
        c.showPage()
    c.save()
    print("wrote", out, "pages", len(paths))


def wrap_a4(src_pdf, out_pdf):
    src = PdfReader(src_pdf)
    a4w, a4h = landscape(A4)
    ox = (a4w - PAGE_W) / 2
    oy = (a4h - PAGE_H) / 2
    packet = io.BytesIO()
    oc = canvas.Canvas(packet, pagesize=(a4w, a4h))
    oc.setStrokeColor(HexColor("#444444"))
    oc.setLineWidth(0.35)
    mark = 4.2 * (72 / 25.4)
    gap = 1.2 * (72 / 25.4)
    # crop marks at card corners
    def marks(x, y, dx, dy):
        oc.line(x + dx * gap, y, x + dx * (gap + mark), y)
        oc.line(x, y + dy * gap, x, y + dy * (gap + mark))
    marks(ox, oy, -1, -1)
    marks(ox + PAGE_W, oy, 1, -1)
    marks(ox, oy + PAGE_H, -1, 1)
    marks(ox + PAGE_W, oy + PAGE_H, 1, 1)
    oc.setFillColor(HexColor("#666666"))
    oc.setFont("Helvetica", 6)
    oc.drawCentredString(a4w / 2, 3.5 * 72 / 25.4, "A4 landscape  |  print 100% actual size  |  cut on marks  |  11.5 x 7.7 in")
    oc.save()
    packet.seek(0)
    overlay = PdfReader(packet).pages[0]
    writer = PdfWriter()
    for p in src.pages:
        sheet = PageObject.create_blank_page(width=a4w, height=a4h)
        sheet.merge_transformed_page(p, Transformation().translate(ox, oy))
        sheet.merge_page(overlay)
        writer.add_page(sheet)
    with open(out_pdf, "wb") as f:
        writer.write(f)
    print("wrote", out_pdf)


if __name__ == "__main__":
    write_pdf(PHOTO_PAGES, OUT_PHOTOS)
    write_pdf(LIST_PAGES, OUT_LISTS)
    write_pdf(PHOTO_PAGES + LIST_PAGES, OUT_ALL)
    wrap_a4(OUT_PHOTOS, "/home/workdir/artifacts/AHY-T0035_photos_A4_print.pdf")
    wrap_a4(OUT_LISTS, "/home/workdir/artifacts/AHY-T0035_lists_A4_print.pdf")
    wrap_a4(OUT_ALL, "/home/workdir/artifacts/AHY-T0035_all_pages_A4_print.pdf")
