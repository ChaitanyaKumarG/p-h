import fs from "fs";
import { normalizePsd } from "../core/normalize.js";
import { parsePsd } from "../core/parsePsd.js";
import { generateCSS } from "../generators/cssGenerator.js";
import { generateHTML } from "../generators/htmlGenerator.js";

const filePath = process.argv[2];

if (!filePath) {
  console.error("\n❌ Missing PSD file path");
  console.error("Usage:");
  console.error("node src/index.js input/test.psd\n");
  process.exit(1);
}

const psd = parsePsd(filePath);

if (!psd) {
  console.error("❌ Failed to parse PSD");
  process.exit(1);
}

const normalized = normalizePsd(psd);
const css = generateCSS(normalized.elements);
const html = generateHTML(normalized.elements);

fs.writeFileSync("./output/psd.json", JSON.stringify(normalized, null, 2));

console.log("\n✅ PSD parsed successfully");
console.log("✅ JSON generated → output/psd.json\n");

fs.writeFileSync("./output/styles.css", css);
fs.writeFileSync("./output/index.html", html);

console.log("✅ HTML & CSS generated");


const layers = psd.children || [];

printLayers(layers);

function printLayers(layers, depth = 0) {
  if (!layers || !layers.length) return;

  layers.forEach((layer) => {
    const indent = " ".repeat(depth * 2);

    const left = layer.left;
    const top = layer.top;
    const right = layer.right;
    const bottom = layer.bottom;

    const width =
      left !== undefined && right !== undefined ? right - left : "N/A";

    const height =
      top !== undefined && bottom !== undefined ? bottom - top : "N/A";

    console.log(
      `${indent}- ${layer.name} | ${width}x${height} @ (${left}, ${top})`,
    );

    if (layer.children) {
      printLayers(layer.children, depth + 1);
    }
  });
}
