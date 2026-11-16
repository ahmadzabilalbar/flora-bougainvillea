// Browser-only: find a square crop of a photo that leaves out any visible text or numbers
// (watermarks, labels, phone numbers…). Uses Tesseract OCR, loaded on first use.
import type { Worker } from "tesseract.js";

export type Rect = { x: number; y: number; w: number; h: number };
/** none = no text found · avoided = crop moved/zoomed to leave text out · partial = text couldn't be fully left out · unchecked = OCR failed */
export type TextResult = "none" | "avoided" | "partial" | "unchecked";

/** OCR runs on a copy this size (longest edge) — enough to read overlaid text, fast on phones. */
const OCR_EDGE = 1200;
/** May zoom in down to this share of the short edge to get away from text. */
const MIN_ZOOM = 0.6;
const MIN_CONFIDENCE = 60;

let workerPromise: Promise<Worker> | null = null;

function getWorker() {
  workerPromise ??= (async () => {
    const { createWorker } = await import("tesseract.js");
    const worker = await createWorker("eng");
    // "Sparse text": find as much scattered text as possible (photo watermarks, signs), not page layout.
    await worker.setParameters({ tessedit_pageseg_mode: "11" as never });
    return worker;
  })();
  workerPromise.catch(() => (workerPromise = null)); // allow a retry after a network failure
  return workerPromise;
}

/** Text boxes in the image's own pixel coordinates, padded a little so crops don't graze letters. */
async function findTextBoxes(img: HTMLImageElement): Promise<Rect[]> {
  const { naturalWidth: w, naturalHeight: h } = img;
  const scale = Math.min(1, OCR_EDGE / Math.max(w, h));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(h * scale);
  canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);

  const worker = await getWorker();
  const { data } = await worker.recognize(canvas, {}, { blocks: true });

  const boxes: Rect[] = [];
  for (const block of data.blocks ?? [])
    for (const para of block.paragraphs)
      for (const line of para.lines)
        for (const word of line.words) {
          const text = word.text.trim();
          // Skip OCR noise from leaves and flowers: low confidence, symbols only, or stray single letters.
          if (word.confidence < MIN_CONFIDENCE || !/[\p{L}\p{N}]/u.test(text)) continue;
          if (text.length < 2 && !/\d/.test(text)) continue;
          const { x0, y0, x1, y1 } = word.bbox;
          const pad = Math.max(4, (y1 - y0) * 0.3);
          boxes.push({
            x: (x0 - pad) / scale,
            y: (y0 - pad) / scale,
            w: (x1 - x0 + 2 * pad) / scale,
            h: (y1 - y0 + 2 * pad) / scale,
          });
        }
  return boxes;
}

const overlap = (a: Rect, b: Rect) =>
  Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) *
  Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));

/**
 * Largest square (preferring the centre) that contains no text. If text is everywhere,
 * returns the full-size square with the least text in it.
 */
export function pickSquare(w: number, h: number, boxes: Rect[]): { rect: Rect; text: TextResult } {
  const short = Math.min(w, h);
  const centred = (side: number): Rect => ({ x: (w - side) / 2, y: (h - side) / 2, w: side, h: side });
  if (!boxes.length) return { rect: centred(short), text: "none" };

  const step = Math.max(1, short / 48);
  const positions = (room: number) => {
    const out: number[] = [];
    for (let p = 0; p < room; p += step) out.push(p);
    out.push(room);
    return out;
  };
  const distance = (r: Rect) => Math.hypot(r.x + r.w / 2 - w / 2, r.y + r.h / 2 - h / 2);
  const textIn = (r: Rect) => boxes.reduce((sum, b) => sum + overlap(r, b), 0);

  let fallback: { rect: Rect; area: number } | null = null;
  for (let zoom = 1; zoom >= MIN_ZOOM - 1e-9; zoom -= 0.05) {
    const side = short * zoom;
    let best: Rect | null = null;
    for (const x of positions(w - side))
      for (const y of positions(h - side)) {
        const r = { x, y, w: side, h: side };
        const area = textIn(r);
        if (area === 0) {
          if (!best || distance(r) < distance(best)) best = r;
        } else if (zoom === 1 && (!fallback || area < fallback.area || (area === fallback.area && distance(r) < distance(fallback.rect)))) {
          fallback = { rect: r, area };
        }
      }
    if (best) {
      const moved = zoom < 1 || textIn(centred(short)) > 0;
      return { rect: best, text: moved ? "avoided" : "none" };
    }
  }
  return { rect: fallback?.rect ?? centred(short), text: "partial" };
}

/** Square crop of `img` that avoids text; falls back to a centre crop if OCR can't run. */
export async function textFreeSquare(img: HTMLImageElement): Promise<{ rect: Rect; text: TextResult }> {
  const { naturalWidth: w, naturalHeight: h } = img;
  try {
    return pickSquare(w, h, await findTextBoxes(img));
  } catch (e) {
    console.error("Text check failed; using a centre crop", e);
    const side = Math.min(w, h);
    return { rect: { x: (w - side) / 2, y: (h - side) / 2, w: side, h: side }, text: "unchecked" };
  }
}
