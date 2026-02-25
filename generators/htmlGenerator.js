export function generateHTML(elements) {
  let html = "";

  const styleMap = new Map();
  let styleIndex = 1;

  elements.forEach((el) => {
    if (el.type !== "text" || !el.styles) return;

    const key = createStyleKey(el.styles);

    if (!styleMap.has(key)) {
      styleMap.set(key, `text-style-${styleIndex++}`);
    }
  });

  elements.forEach((el) => {
    const layoutClass = sanitizeClass(el.id);

    if (el.type === "text") {
      const styleClass = styleMap.get(createStyleKey(el.styles));

      html += `<div class="text-layer ${layoutClass} ${styleClass}">${escape(el.name)}</div>\n`;
    } else {
      html += `<div class="image-layer ${layoutClass}"></div>\n`;
    }
  });

  return html;
}

function createStyleKey(styles) {
  return JSON.stringify({
    fontSize: styles?.fontSize,
    lineHeight: styles?.lineHeight,
    letterSpacing: styles?.letterSpacing,
    fontFamily: styles?.fontFamily,
    fontWeight: styles?.fontWeight,
    color: styles?.color,
    textDecoration: styles?.textDecoration,
  });
}

function sanitizeClass(id) {
  return id.replace(/[^a-zA-Z0-9_-]/g, "_");
}

function escape(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
