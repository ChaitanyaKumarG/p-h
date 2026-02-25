function isInside(inner, outer) {
  return (
    inner.frame.x >= outer.frame.x &&
    inner.frame.y >= outer.frame.y &&
    inner.frame.x + inner.frame.width <= outer.frame.x + outer.frame.width &&
    inner.frame.y + inner.frame.height <= outer.frame.y + outer.frame.height
  );
}

function detectButtons(elements) {
  const buttons = [];
  const used = new Set();

  elements.forEach((shape) => {
    if (shape.type !== "image") return;

    elements.forEach((text) => {
      if (text.type !== "text") return;
      if (used.has(text.id)) return;

      if (isInside(text, shape)) {
        buttons.push({
          id: `btn_${shape.id}`,
          container: shape,
          label: text,
        });

        used.add(shape.id);
        used.add(text.id);
      }
    });
  });

  return { buttons, used };
}

export function normalizePsd(psd) {
  const elements = extractLayers(psd.children || []);

  const { buttons, used } = detectButtons(elements);

  return {
    document: {
      width: psd.width,
      height: psd.height,
    },
    elements,
    buttons,
    usedElements: [...used], // helpful later
  };
}

function extractLayers(layers, result = [], parent = null) {
  layers.forEach((layer, index) => {
    const left = layer.left ?? 0;
    const top = layer.top ?? 0;
    const right = layer.right ?? left;
    const bottom = layer.bottom ?? top;

    const element = {
      id: `${sanitize(layer.name)}_${index}`,
      name: layer.name,
      type: detectType(layer),

      frame: {
        x: left,
        y: top,
        width: right - left,
        height: bottom - top,
      },

      styles: extractStyles(layer),

      parent,
    };

    result.push(element);

    if (layer.children) {
      extractLayers(layer.children, result, element.id);
    }
  });

  return result;
}

function detectType(layer) {
  if (layer.text) return "text";

  /* Detect Vector Shapes */
  if (layer.vectorMask || layer.pathList || layer.fill || layer.stroke) {
    return "shape";
  }

  if (layer.children) return "group";

  return "image";
}

function extractStyles(layer) {
  if (layer.text) {
    return extractTextStyles(layer);
  }

  return {};
}

function extractTextStyles(layer) {
  const style = layer.text.style || {};
  const fill = style.fillColor;

  return {
    fontSize: style.fontSize ?? null,

    lineHeight: style.leading ?? null,

    letterSpacing: style.tracking ?? null,

    fontFamily: style.font?.name ?? null,

    fontWeight: deriveWeight(style.font?.style),

    color: fill ? `rgb(${fill.r}, ${fill.g}, ${fill.b})` : null,

    textDecoration: deriveDecoration(style),
  };
}

function deriveWeight(style) {
  if (!style) return 400;

  const s = style.toLowerCase();

  if (s.includes("bold")) return 700;
  if (s.includes("semibold")) return 600;
  if (s.includes("medium")) return 500;
  if (s.includes("light")) return 300;

  return 400;
}

function deriveDecoration(style) {
  if (!style) return "none";

  if (style.underline) return "underline";
  if (style.strikethrough) return "line-through";

  return "none";
}

function sanitize(name) {
  return name.replace(/\s+/g, "_").toLowerCase();
}
