export function detectButtons(elements) {
  const buttons = [];
  const used = new Set();

  elements.forEach((shape) => {
    if (shape.type !== "shape") return;

    /* Ignore giant containers */
    if (isHuge(shape)) return;

    elements.forEach((text) => {
      if (text.type !== "text") return;
      if (used.has(text.id)) return;

      if (isInside(text.frame, shape.frame)) {
        buttons.push({
          container: shape,
          label: text,
        });

        used.add(text.id);
      }
    });
  });

  return { buttons, used };
}

/* ---------------- FILTER RULES ---------------- */

function isHuge(shape) {
  return (
    shape.frame.width > 600 || // tweakable threshold
    shape.frame.height > 200
  );
}

function isInside(inner, outer) {
  return (
    inner.x >= outer.x &&
    inner.y >= outer.y &&
    inner.x + inner.width <= outer.x + outer.width &&
    inner.y + inner.height <= outer.y + outer.height
  );
}
