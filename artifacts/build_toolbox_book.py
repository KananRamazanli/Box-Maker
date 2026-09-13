#!/usr/bin/env python3
"""AHY-T0035 toolbox manual book — one consistent page size + laminate margins."""

from reportlab.lib.units import inch, cm, mm
from reportlab.lib.colors import Color, HexColor, white, black
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
from reportlab.platypus import Table, TableStyle, Paragraph, Frame
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER

pdfmetrics.registerFont(TTFont("Sans", "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"))
pdfmetrics.registerFont(TTFont("Sans-Bold", "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"))

# --- page geometry ---
PAGE_W = 11.5 * inch          # 828.0 pt
PAGE_H = 7.7 * inch           # 554.4 pt
MARGIN_X = 0.75 * cm          # sides
MARGIN_Y = 0.5 * cm           # top / bottom

NAVY = HexColor("#102F4A")
CYAN = HexColor("#00A9E0")
HEADER_ROW = HexColor("#D9E0E5")
GRID = HexColor("#AAB4BC")
ALT_ROW = HexColor("#F2F4F6")
FOOTER = HexColor("#6B7A86")
TEXT = HexColor("#1A2A36")

MEDIA = "/tmp/tbmedia"
OUT = "/home/workdir/artifacts/AHY-T0035_Toolbox_Book_11.5x7.7in.pdf"

PALLETS = {
    1: [
        ("STMD12", "1/4\" Drive 12-Point SAE 3/8\" Flank"),
        ("91ACP", "9\" ADJUSTABLE JOINT INTERLOCKING CHANNEL PLIERS"),
        ("70171035", "NYLON HAMMER Ø35MM"),
    ],
    2: [
        ("SCA-TL610", "Small Bore 4-way valve tool"),
        ("SCA-TL690", "Large valve core insertion tool"),
        ("03420042", "51a 13/16 12point Deep Socket 1/2\" Drive"),
        ("13030005", "514 ADAPTOR 1/2\" - 3/4\""),
        ("SCA-968RB-1", "COM-1524 Tire Deflator Large Bore"),
        ("40482828", "13a 7/16 COMBINATION SPANNER"),
        ("41561620", "25aN 1/4 x 5/16 RATCHET RING SPANNER"),
        ("11110020", "415QR 1/4\" RATCHET WITH QUICK RELEASE"),
        ("01530020", "40aD 5/16 SOCKET 1/4\""),
        ("01530028", "40aD 7/16 SOCKET 1/4\""),
        ("11010001", "405/2 EXTENSION BAR 1/4\""),
        ("SCA-968RB", "COM-4046 Aircraft Tire Deflator Small Bore"),
        ("67201140", "SIDE CUTTER 140mm"),
        ("65751220", "WIRE TWISTING PLIERS"),
        ("40485252", "13a 1 1/8 COMBINATION SPANNER"),
        ("N-1910-VG8-12", "SMALL AND LARGE BORE CORE REMOVAL TOOL"),
        ("13061018", "504/18 FLEXIBLE HANDLE 1/2\""),
    ],
    3: [
        ("J47549-S", "A320/21 NLG AXLE NUT WRENCH"),
        ("460007230-S", "A321/330/340 MLG AXLE NUT TORQUE ADAPTOR (SCA-SAS321-010)"),
        ("MG174-04S", "A320-21/330/340 BRAKE IMPELLER DISASSEMBLY TOOL"),
        ("J47548-S", "A320/21 NLG AXLE THREAD PROTECTOR"),
        ("Q47316-S", "A321CEO/A321NEO GUIDE CONE SHORT MLG"),
        ("460006430-S<br/>(Equivalent: 98D32403005001)", "A320 TORQUE ADAPTOR - BRAKE UNIT NUT"),
    ],
}

PHOTOS = {
    1: f"{MEDIA}/image1.png",
    2: f"{MEDIA}/image2.png",
    3: f"{MEDIA}/image3.png",
}


def content_box():
    x = MARGIN_X
    y = MARGIN_Y
    w = PAGE_W - 2 * MARGIN_X
    h = PAGE_H - 2 * MARGIN_Y
    return x, y, w, h


def draw_punch_guide(c):
    """Small hole-punch target centered in the left empty margin."""
    c.saveState()
    cx = MARGIN_X / 2.0
    cy = PAGE_H / 2.0
    r = 1.8 * mm
    c.setStrokeColor(HexColor("#C5CDD3"))
    c.setLineWidth(0.5)
    c.circle(cx, cy, r, stroke=1, fill=0)
    c.setLineWidth(0.25)
    c.line(cx - r - 1.2, cy, cx - r + 0.4, cy)
    c.line(cx + r - 0.4, cy, cx + r + 1.2, cy)
    c.line(cx, cy - r - 1.2, cx, cy - r + 0.4)
    c.line(cx, cy + r - 0.4, cx, cy + r + 1.2)
    c.restoreState()


def draw_header_bar(c, right_label):
    x, y, w, h = content_box()
    bar_h = 28
    bar_y = y + h - bar_h
    c.setFillColor(NAVY)
    c.rect(x, bar_y, w, bar_h, stroke=0, fill=1)
    c.setFillColor(white)
    c.setFont("Sans-Bold", 12)
    c.drawString(x + 10, bar_y + 9, "TOOLBOX SEARCH BOOK")
    c.setFillColor(CYAN)
    c.setFont("Sans-Bold", 8.5)
    c.drawRightString(x + w - 10, bar_y + 10, right_label)
    return bar_y, bar_h


def draw_footer(c, page_no, total):
    x, y, w, h = content_box()
    c.setFillColor(FOOTER)
    c.setFont("Sans", 7)
    c.drawString(x + 8, y + 5, "SCANAEROTECH  SCA-SAS321-010")
    c.drawRightString(x + w - 8, y + 5, f"AHY-T0035  |  {page_no}")


def draw_list_page(c, pallet, page_no):
    x, y, w, h = content_box()
    bar_y, bar_h = draw_header_bar(
        c, f"SCANAEROTECH  SCA-SAS321-010    AHY-T0035    PALET {pallet}"
    )
    draw_footer(c, page_no, 7)
    draw_punch_guide(c)

    items = PALLETS[pallet]
    cell = ParagraphStyle(
        "cell",
        fontName="Sans",
        fontSize=8,
        leading=11,
        textColor=TEXT,
    )
    cell_b = ParagraphStyle(
        "cellb",
        fontName="Sans-Bold",
        fontSize=7.5,
        leading=10,
        textColor=NAVY,
    )
    header_style = ParagraphStyle(
        "th",
        fontName="Sans-Bold",
        fontSize=7.5,
        leading=10,
        textColor=NAVY,
    )

    data = [[
        Paragraph("NO", header_style),
        Paragraph("PART NUMBER (TOOL NUMBER)", header_style),
        Paragraph("DESCRIPTION", header_style),
    ]]
    for i, (pn, desc) in enumerate(items, 1):
        data.append([
            Paragraph(str(i), cell),
            Paragraph(pn, cell),
            Paragraph(desc, cell),
        ])

    col_w = [28, 195, w - 28 - 195 - 16]
    table = Table(data, colWidths=col_w, repeatRows=1)
    style_cmds = [
        ("BACKGROUND", (0, 0), (-1, 0), HEADER_ROW),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 4.5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4.5),
        ("ALIGN", (0, 0), (0, -1), "CENTER"),
        ("GRID", (0, 0), (-1, -1), 0.4, GRID),
        ("BOX", (0, 0), (-1, -1), 0.6, HexColor("#8A99A4")),
    ]
    for r in range(1, len(data)):
        if r % 2 == 0:
            style_cmds.append(("BACKGROUND", (0, r), (-1, r), ALT_ROW))
        else:
            style_cmds.append(("BACKGROUND", (0, r), (-1, r), white))
    table.setStyle(TableStyle(style_cmds))

    tw, th = table.wrap(w - 16, h)
    table_y = bar_y - 12 - th
    table.drawOn(c, x + 8, table_y)


def draw_photo_page(c, pallet, page_no):
    x, y, w, h = content_box()
    bar_y, bar_h = draw_header_bar(
        c, f"SCANAEROTECH  SCA-SAS321-010    AHY-T0035    PALET {pallet}  PHOTO"
    )
    draw_footer(c, page_no, 7)
    draw_punch_guide(c)

    footer_h = 16
    gap = 8
    avail_x = x + 8
    avail_y = y + footer_h
    avail_w = w - 16
    avail_h = (bar_y - gap) - avail_y

    img_path = PHOTOS[pallet]
    ir = ImageReader(img_path)
    iw, ih = ir.getSize()
    scale = min(avail_w / iw, avail_h / ih)
    dw, dh = iw * scale, ih * scale
    dx = avail_x + (avail_w - dw) / 2
    dy = avail_y + (avail_h - dh) / 2

    # photo frame
    c.setStrokeColor(GRID)
    c.setLineWidth(0.8)
    c.setFillColor(HexColor("#F7F8F9"))
    c.rect(avail_x, avail_y, avail_w, avail_h, stroke=1, fill=1)
    c.drawImage(ir, dx, dy, width=dw, height=dh, mask="auto", preserveAspectRatio=True, anchor="c")


def draw_cover(c):
    x, y, w, h = content_box()
    # Use the original branded cover, fitted into the content box (margins stay empty)
    cover = ImageReader("/tmp/cover_hi-4.png")
    iw, ih = cover.getSize()
    scale = min(w / iw, h / ih)
    dw, dh = iw * scale, ih * scale
    dx = x + (w - dw) / 2
    dy = y + (h - dh) / 2
    c.drawImage(cover, dx, dy, width=dw, height=dh, preserveAspectRatio=True, mask="auto")
    draw_punch_guide(c)


def main():
    c = canvas.Canvas(OUT, pagesize=(PAGE_W, PAGE_H))
    c.setTitle("AHY-T0035 Toolbox Search Book — A321 Wheel Change Kit")
    c.setAuthor("AZAL Maintenance & Engineering")
    c.setSubject("SCANAEROTECH SCA-SAS321-010")

    # 1 cover
    draw_cover(c)
    c.showPage()

    page = 2
    for palet in (1, 2, 3):
        draw_photo_page(c, palet, page)
        c.showPage()
        page += 1
        draw_list_page(c, palet, page)
        c.showPage()
        page += 1

    c.save()
    print("Wrote", OUT)
    print(f"Page size: {PAGE_W/inch:.2f} x {PAGE_H/inch:.2f} in")
    print(f"Side margin: {MARGIN_X/cm:.2f} cm   Top/bottom margin: {MARGIN_Y/cm:.2f} cm")


if __name__ == "__main__":
    main()
