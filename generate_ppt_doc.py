from docx import Document
from docx.shared import Pt, RGBColor, Inches, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.style import WD_STYLE_TYPE
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
import copy

doc = Document()

# ── Page margins ──────────────────────────────────────────────────────────────
section = doc.sections[0]
section.top_margin    = Inches(1.0)
section.bottom_margin = Inches(1.0)
section.left_margin   = Inches(1.15)
section.right_margin  = Inches(1.15)

# ── Colour palette ────────────────────────────────────────────────────────────
NAVY   = RGBColor(0x0A, 0x1F, 0x44)   # deep navy  – headings
BLUE   = RGBColor(0x1A, 0x6B, 0xD0)   # accent blue – subheads / bullets
GOLD   = RGBColor(0xD4, 0xA0, 0x17)   # gold        – slide titles
BLACK  = RGBColor(0x1A, 0x1A, 0x1A)   # near-black  – body text
GREY   = RGBColor(0x55, 0x55, 0x55)   # grey        – notes / captions
WHITE  = RGBColor(0xFF, 0xFF, 0xFF)


def set_cell_bg(cell, hex_color: str):
    tc   = cell._tc
    tcPr = tc.get_or_add_tcPr()
    shd  = OxmlElement("w:shd")
    shd.set(qn("w:val"),   "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"),  hex_color)
    tcPr.append(shd)


def add_hr(doc):
    p   = doc.add_paragraph()
    pPr = p._p.get_or_add_pPr()
    pb  = OxmlElement("w:pBdr")
    bot = OxmlElement("w:bottom")
    bot.set(qn("w:val"),   "single")
    bot.set(qn("w:sz"),    "6")
    bot.set(qn("w:space"), "1")
    bot.set(qn("w:color"), "1A6BD0")
    pb.append(bot)
    pPr.append(pb)
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after  = Pt(2)


def doc_title(doc, text):
    """Cover / section title."""
    p  = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(18)
    p.paragraph_format.space_after  = Pt(4)
    run = p.add_run(text)
    run.bold      = True
    run.font.size = Pt(26)
    run.font.color.rgb = NAVY


def doc_subtitle(doc, text):
    p  = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after  = Pt(6)
    run = p.add_run(text)
    run.font.size      = Pt(13)
    run.font.color.rgb = BLUE
    run.italic = True


def slide_label(doc, number: int, title: str):
    """Slide number banner + slide title."""
    # Banner paragraph
    p  = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(18)
    p.paragraph_format.space_after  = Pt(0)
    r  = p.add_run(f"  SLIDE {number}  ")
    r.bold            = True
    r.font.size       = Pt(10)
    r.font.color.rgb  = WHITE
    # Shade the paragraph background via XML shading on the paragraph itself
    pPr  = p._p.get_or_add_pPr()
    shd  = OxmlElement("w:shd")
    shd.set(qn("w:val"),   "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"),  "0A1F44")
    pPr.append(shd)

    # Title
    pt = doc.add_paragraph()
    pt.paragraph_format.space_before = Pt(4)
    pt.paragraph_format.space_after  = Pt(6)
    rt = pt.add_run(title)
    rt.bold           = True
    rt.font.size      = Pt(16)
    rt.font.color.rgb = GOLD
    add_hr(doc)


def section_heading(doc, text):
    p  = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after  = Pt(3)
    r  = p.add_run(text)
    r.bold           = True
    r.font.size      = Pt(12)
    r.font.color.rgb = BLUE


def body(doc, text, bold_parts=None):
    """Plain body paragraph. Pass bold_parts list of substrings to bold inline."""
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(1)
    p.paragraph_format.space_after  = Pt(3)
    p.paragraph_format.left_indent  = Inches(0)
    if not bold_parts:
        r = p.add_run(text)
        r.font.size      = Pt(11)
        r.font.color.rgb = BLACK
    else:
        # naive inline bold: split on bold_parts
        remaining = text
        for bp in bold_parts:
            idx = remaining.find(bp)
            if idx == -1:
                continue
            before = remaining[:idx]
            if before:
                rb = p.add_run(before)
                rb.font.size = Pt(11); rb.font.color.rgb = BLACK
            rb2 = p.add_run(bp)
            rb2.bold = True; rb2.font.size = Pt(11); rb2.font.color.rgb = NAVY
            remaining = remaining[idx + len(bp):]
        if remaining:
            rb3 = p.add_run(remaining)
            rb3.font.size = Pt(11); rb3.font.color.rgb = BLACK
    return p


def bullet(doc, text, level=0, bold_lead=None):
    """Bullet point with optional bold lead phrase."""
    p = doc.add_paragraph(style="List Bullet")
    p.paragraph_format.space_before = Pt(1)
    p.paragraph_format.space_after  = Pt(2)
    p.paragraph_format.left_indent = Inches(0.3 + 0.2 * level)

    if bold_lead and text.startswith(bold_lead):
        rb = p.add_run(bold_lead)
        rb.bold = True; rb.font.size = Pt(11); rb.font.color.rgb = NAVY
        rest = p.add_run(text[len(bold_lead):])
        rest.font.size = Pt(11); rest.font.color.rgb = BLACK
    else:
        r = p.add_run(text)
        r.font.size      = Pt(11)
        r.font.color.rgb = BLACK


def code_block(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after  = Pt(4)
    p.paragraph_format.left_indent  = Inches(0.3)
    r = p.add_run(text)
    r.font.name       = "Courier New"
    r.font.size       = Pt(9)
    r.font.color.rgb  = RGBColor(0x10, 0x60, 0x20)
    # light grey shading
    pPr = p._p.get_or_add_pPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"),   "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"),  "F0F4F8")
    pPr.append(shd)


def punchline(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after  = Pt(8)
    p.paragraph_format.left_indent  = Inches(0.3)
    pPr = p._p.get_or_add_pPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"),   "clear")
    shd.set(qn("w:color"), "auto")
    shd.set(qn("w:fill"),  "EBF3FB")
    pPr.append(shd)
    r = p.add_run(text)
    r.bold           = True
    r.italic         = True
    r.font.size      = Pt(11)
    r.font.color.rgb = NAVY


def note(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after  = Pt(2)
    r = p.add_run(text)
    r.italic         = True
    r.font.size      = Pt(10)
    r.font.color.rgb = GREY


def add_table(doc, headers, rows, col_widths=None):
    t = doc.add_table(rows=1 + len(rows), cols=len(headers))
    t.style = "Table Grid"
    # header row
    hrow = t.rows[0]
    for i, h in enumerate(headers):
        cell = hrow.cells[i]
        set_cell_bg(cell, "0A1F44")
        p  = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r  = p.add_run(h)
        r.bold           = True
        r.font.size      = Pt(10)
        r.font.color.rgb = WHITE
    # data rows
    for ri, row_data in enumerate(rows):
        row = t.rows[ri + 1]
        bg  = "F7FAFD" if ri % 2 == 0 else "FFFFFF"
        for ci, cell_text in enumerate(row_data):
            cell = row.cells[ci]
            set_cell_bg(cell, bg)
            p = cell.paragraphs[0]
            # bold the first column entry
            r = p.add_run(cell_text)
            r.font.size = Pt(10)
            if ci == 0:
                r.bold           = True
                r.font.color.rgb = NAVY
            else:
                r.font.color.rgb = BLACK
    # column widths
    if col_widths:
        for i, w in enumerate(col_widths):
            for row in t.rows:
                row.cells[i].width = w
    doc.add_paragraph()   # spacer


# ══════════════════════════════════════════════════════════════════════════════
#  COVER PAGE
# ══════════════════════════════════════════════════════════════════════════════
doc_title(doc, "DHRUVA CDM")
doc_subtitle(doc, "Autonomous Constellation Management & Conjunction Decision Support Platform")
doc_subtitle(doc, "Hackathon Presentation — Slide Content Document")
add_hr(doc)
note(doc, "Stack: Python · FastAPI · React · Next.js · WebSocket · physics.py")
note(doc, "Repository: github.com/jeevankumar-m/project-dhruva")
note(doc, "Demo Video: https://youtu.be/fs9eEaVNgIA")
note(doc, "Version 1.0.0  |  © 2026 Dhruva CDM Project")
doc.add_page_break()

# ══════════════════════════════════════════════════════════════════════════════
