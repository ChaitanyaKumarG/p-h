import { normalizePsd } from "../core/normalize.js";
import { parsePsd } from "../core/parsePsd.js";
import fs from "fs";
const filePath = process.argv[2];

if (!filePath) {
  console.error("❌ Please provide PSD file path");
  process.exit(1);
}

const psd = parsePsd(filePath);
const normalized = normalizePsd(psd);

fs.writeFileSync("./output/psd.json", JSON.stringify(normalized, null, 2));


// function printLayers(layers, depth = 0) {
//   if (!layers) return;

//   layers.forEach((layer) => {
//     const indent = " ".repeat(depth * 2);
//     const bounds = layer.bounds;

//     console.log(
//       `${indent}- ${layer.name} | ${bounds?.width}x${bounds?.height} @ (${bounds?.left}, ${bounds?.top})`
//     );

//     if (layer.children) {
//       printLayers(layer.children, depth + 1);
//     }
//   });
// }


function printLayers(layers, depth = 0) {
  if (!layers) return;

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
      `${indent}- ${layer.name} | ${width}x${height} @ (${left}, ${top})`
    );

    if (layer.children) {
      printLayers(layer.children, depth + 1);
    }
  });
}



console.log("\n✅ PSD loaded successfully\n");
printLayers(psd.children);
