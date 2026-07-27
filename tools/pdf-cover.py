"""
Render page 1 of every PDF in tools/pdf-inbox/ to a web-sized JPG cover,
and print a ready-to-paste `doc` gallery entry for src/data/site.js.

Run it via `npm run covers` — that wrapper installs the one dependency
(PyMuPDF) into a local venv the first time, so there's nothing to set up.

Drop a PDF straight in the inbox           -> public/img/covers/
Drop it in a  <project-slug>/  subfolder   -> public/img/work/<project-slug>/
"""

import re
import sys
import pathlib
import urllib.parse

import fitz  # PyMuPDF

# The snippet contains '·'. Without this, a non-UTF-8 Windows console mangles
# it and you paste a broken character into site.js.
for stream in (sys.stdout, sys.stderr):
    try:
        stream.reconfigure(encoding="utf-8", errors="replace")
    except AttributeError:
        pass

ROOT = pathlib.Path(__file__).resolve().parent.parent
INBOX = ROOT / "tools" / "pdf-inbox"
WIDTH = 1200        # rendered px — ~2x the widest the tile is ever displayed
QUALITY = 80
A4 = 210 / 297

force = "--force" in sys.argv


def slugify(text: str) -> str:
    """lowercase-with-dashes, ASCII only — the convention in DEPLOY.md."""
    return re.sub(r"^-+|-+$", "", re.sub(r"[^a-z0-9]+", "-", text.lower()))


def human_size(num_bytes: int) -> str:
    mb = num_bytes / 1_048_576
    return f"{mb:.1f} MB" if mb >= 1 else f"{num_bytes / 1024:.0f} KB"


def render(pdf_path: pathlib.Path, snippets: list) -> None:
    # A PDF sitting in a subfolder is taken to belong to that project.
    rel_parent = pdf_path.parent.relative_to(INBOX)
    if rel_parent.parts:
        project = rel_parent.parts[0]
        out_dir = ROOT / "public" / "img" / "work" / project
        web_dir = f"/img/work/{project}"
    else:
        out_dir = ROOT / "public" / "img" / "covers"
        web_dir = "/img/covers"

    slug = slugify(pdf_path.stem)
    out_file = out_dir / f"{slug}-cover.jpg"

    if out_file.exists() and not force:
        print(f"  skip   {out_file.relative_to(ROOT)} (exists — use --force to redo)")
        return

    doc = fitz.open(pdf_path)
    if doc.page_count == 0:
        print(f"  SKIP   {pdf_path.name}: no pages")
        return
    page = doc[0]
    rect = page.rect
    zoom = WIDTH / rect.width
    pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=False)

    out_dir.mkdir(parents=True, exist_ok=True)
    out_file.write_bytes(pix.tobytes("jpeg", jpg_quality=QUALITY))

    ratio = rect.width / rect.height
    shape = "A4" if abs(ratio - A4) < 0.01 else f"ratio {ratio:.3f}"
    print(f"\n  {pdf_path.name}")
    print(f"    -> {out_file.relative_to(ROOT)}  "
          f"({pix.width}x{pix.height}, {human_size(out_file.stat().st_size)}, {shape})")

    if pdf_path.name != f"{slug}.pdf":
        print(f"    note: upload to R2 as '{slug}.pdf' to avoid %20 escaping")

    encoded = urllib.parse.quote(pdf_path.name)
    snippet = (
        "{\n"
        "  type: 'doc',\n"
        f"  src: `${{R2}}/{encoded}`,\n"
        f"  label: '{pdf_path.stem}',\n"
        f"  meta: 'PDF · {doc.page_count} pages · {human_size(pdf_path.stat().st_size)}',\n"
        f"  cover: '{web_dir}/{slug}-cover.jpg',\n"
        "},"
    )
    snippets.append(snippet)
    print("\n    paste into the project's gallery[] in src/data/site.js:\n")
    print("\n".join("      " + line for line in snippet.splitlines()))
    doc.close()


def main() -> int:
    INBOX.mkdir(parents=True, exist_ok=True)
    pdfs = sorted(p for p in INBOX.rglob("*.pdf") if p.is_file())
    if not pdfs:
        print(f"No PDFs found. Drop one in: {INBOX.relative_to(ROOT)}")
        print("  (a <project-slug>/ subfolder routes the cover to that project)")
        return 0

    print(f"Found {len(pdfs)} PDF(s) in {INBOX.relative_to(ROOT)}")
    snippets: list = []
    for pdf in pdfs:
        try:
            render(pdf, snippets)
        except Exception as exc:  # keep going through the rest of the batch
            print(f"  FAILED {pdf.name}: {exc}")

    # Also write the snippets to a UTF-8 file: copying from a terminal can
    # mangle characters, and opening this in VS Code never will.
    if snippets:
        paste_file = INBOX / "paste-into-site.txt"
        paste_file.write_text("\n\n".join(snippets) + "\n", encoding="utf-8")
        print(f"\nSnippets also written to {paste_file.relative_to(ROOT)}")
    print("Done. PDFs in the inbox are git-ignored — upload them to R2 yourself.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
