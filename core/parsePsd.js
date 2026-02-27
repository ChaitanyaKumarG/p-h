import fs from "fs";
import { readPsd, initializeCanvas } from "ag-psd";
import { createCanvas, ImageData } from "canvas";

/* Proper Node Canvas wiring */
initializeCanvas(
  (width, height) => createCanvas(width, height),
  (width, height) => new ImageData(width, height),
);

export function parsePsd(filePath) {
  const buffer = fs.readFileSync(filePath);

  const psd = readPsd(buffer, {
    skipLayerImageData: false,
    skipCompositeImageData: true,
  });

  return psd;
}
