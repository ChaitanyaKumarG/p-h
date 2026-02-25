export function generateCSS(elements) {
  let css = getBaseCSS();

  const styleMap = new Map();
  let styleIndex = 1;

  elements.forEach((el) => {
    if (el.type !== "text" || !el.styles) return;

    const key = createStyleKey(el.styles);

    if (!styleMap.has(key)) {
      styleMap.set(key, `text-style-${styleIndex++}`);
    }
  });

  /* Generate Utility Classes */
  styleMap.forEach((className, key) => {
    const styles = JSON.parse(key);

    css += `.${className} {\n`;
    css += generateTextStyles(styles);
    css += `}\n\n`;
  });

  /* Generate Layer Layout Classes */
  elements.forEach((el) => {
    const className = sanitizeClass(el.id);

    css += `.${className} {\n`;
    css += `  position: absolute;\n`;
    css += `  left: ${round(el.frame.x)}px;\n`;
    css += `  top: ${round(el.frame.y)}px;\n`;
    css += `  width: ${round(el.frame.width)}px;\n`;
    css += `  height: ${round(el.frame.height)}px;\n`;
    css += `}\n\n`;
  });

  return css;
}

/* ---------------- TEXT STYLE GENERATION ---------------- */

function generateTextStyles(s) {
  let css = "";

  if (s.fontSize) css += `  font-size: ${round(s.fontSize)}px;\n`;

  if (s.lineHeight) css += `  line-height: ${safeLineHeight(s)}px;\n`;

  if (s.letterSpacing !== undefined)
    css += `  letter-spacing: ${round(s.letterSpacing)}px;\n`;

  if (s.fontFamily) css += `  font-family: '${s.fontFamily}';\n`;

  if (s.fontWeight) css += `  font-weight: ${s.fontWeight};\n`;

  if (s.color) css += `  color: ${sanitizeColor(s.color)};\n`;

  if (s.textDecoration && s.textDecoration !== "none")
    css += `  text-decoration: ${s.textDecoration};\n`;

  return css;
}

function createStyleKey(styles) {
  return JSON.stringify({
    fontSize: styles.fontSize,
    lineHeight: styles.lineHeight,
    letterSpacing: styles.letterSpacing,
    fontFamily: styles.fontFamily,
    fontWeight: styles.fontWeight,
    color: styles.color,
    textDecoration: styles.textDecoration,
  });
}

/* ---------------- BASE ENGINE RULES ---------------- */

function getBaseCSS() {
  return `
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

/* ---------------- HELPERS ---------------- */

function round(value) {
  return Math.round(value || 0);
}

function sanitizeColor(color) {
  if (!color) return "black";

  return color.replace(/[\d\\.]+/g, (num) => Math.round(parseFloat(num)));
}

function safeLineHeight(styles) {
  if (!styles.lineHeight) return round(styles.fontSize);
  if (styles.lineHeight < styles.fontSize) return round(styles.fontSize);
  return round(styles.lineHeight);
}

function sanitizeClass(id) {
  return id.replace(/[^a-zA-Z0-9_-]/g, "_");
}
