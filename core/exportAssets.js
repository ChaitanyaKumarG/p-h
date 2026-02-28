import fs from "fs";
import path from "path";

export function exportAssets(psd, outputDir = "./output/assets") {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  walk(psd.children, outputDir);
}

function walk(layers, outputDir) {
  if (!layers) return;

  layers.forEach((layer) => {
if (
  layer.canvas &&
  layer.canvas.width > 5 &&
  layer.canvas.height > 5 &&
  !layer.text && // 🚫 Skip text layers
  !layer.adjustment && // 🚫 Skip adjustment layers
  !layer.children && // 🚫 Skip groups
  layer.visible !== false // 🚫 Skip hidden layers
) {
  const name = sanitize(layer.name);
  const filePath = path.join(outputDir, `${name}.png`);

  const buffer = layer.canvas.toBuffer("image/png");
  fs.writeFileSync(filePath, buffer);

  console.log("✔ Exported:", name);
}

    if (layer.children) {
      walk(layer.children, outputDir);
    }
  });
}

function sanitize(name) {
  return (name || "layer").replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase();
}
