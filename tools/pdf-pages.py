"""
Render every page of a PDF to a web-sized JPG — used for the brand-guideline
viewers on the UISS case study, which show paged images instead of linking a
downloadable PDF.

Not wired into `npm run covers` (that tool only ever needs page 1). Run it by
hand through the same venv that command already set up:

    tools/.venv/Scripts/python.exe tools/pdf-pages.py <pdf> <out-dir> <prefix>

e.g.
    tools/.venv/Scripts/python.exe tools/pdf-pages.py ^
        "path/to/deck.pdf" public/img/work/<id>/guidelines-1 page

writes <out-dir>/<prefix>-01.jpg, -02.jpg, ...
"""

import sys
import pathlib
import fitz  # PyMuPDF

WIDTH = 1600
QUALITY = 82


def render(pdf_path: str, out_dir: str, prefix: str) -> None:
    doc = fitz.open(pdf_path)
    out = pathlib.Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)
    print(f"{pdf_path}: {doc.page_count} pages")
    for i, page in enumerate(doc, start=1):
        rect = page.rect
        zoom = WIDTH / rect.width
        pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=False)
        out_file = out / f"{prefix}-{i:02d}.jpg"
        out_file.write_bytes(pix.tobytes("jpeg", jpg_quality=QUALITY))
        print(f"  -> {out_file} ({pix.width}x{pix.height}, {out_file.stat().st_size / 1024:.0f} KB)")
    doc.close()


if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("usage: pdf-pages.py <pdf> <out-dir> <prefix>")
        raise SystemExit(1)
    render(sys.argv[1], sys.argv[2], sys.argv[3])
