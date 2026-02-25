export function generateCSS(elements) {
  let css = getBaseCSS();

  elements.forEach((el) => {
    const className = sanitizeClass(el.id);

    css += `.${className} {\n`;

    css += `  left: ${round(el.frame.x)}px;\n`;
    css += `  top: ${round(el.frame.y)}px;\n`;
    css += `  width: ${round(el.frame.width)}px;\n`;
    css += `  height: ${round(el.frame.height)}px;\n`;

    if (el.type === "text" && el.styles) {
      const s = el.styles;

      if (s.fontSize) css += `  font-size: ${round(s.fontSize)}px;\n`;

      if (s.lineHeight) css += `  line-height: ${safeLineHeight(s)}px;\n`;

      if (s.letterSpacing !== undefined)
        css += `  letter-spacing: ${round(s.letterSpacing)}px;\n`;

      if (s.fontFamily) css += `  font-family: '${s.fontFamily}';\n`;

      if (s.fontWeight) css += `  font-weight: ${s.fontWeight};\n`;

      if (s.color) css += `  color: ${sanitizeColor(s.color)};\n`;

      if (s.textDecoration && s.textDecoration !== "none")
        css += `  text-decoration: ${s.textDecoration};\n`;
    }

    css += `}\n\n`;
  });

  return css;
}

/* ---------------- BASE ENGINE RULES ---------------- */

function getBaseCSS() {
  return `
/* ===== PSD Rendering Engine Base Rules ===== */

.text-layer {
  position: absolute;
  white-space: pre;
  margin: 0;
  padding: 0;
}

.image-layer {
  position: absolute;
}

`;
}

/* ---------------- SAFETY HELPERS ---------------- */

function round(value) {
  return Math.round(value || 0);
}

function sanitizeColor(color) {
  if (!color) return "black";

  /* Convert float RGB → integer RGB */
  return color.replace(/[\d\\.]+/g, (num) => Math.round(parseFloat(num)));
}

/* Prevent invalid line-height values */
function safeLineHeight(styles) {
  if (!styles.lineHeight) return round(styles.fontSize);

  if (styles.lineHeight < styles.fontSize) return round(styles.fontSize);

  return round(styles.lineHeight);
}

/* Ensure valid CSS class names */
function sanitizeClass(id) {
  return id.replace(/[^a-zA-Z0-9_-]/g, "_").replace(/^_+/, "");
}
