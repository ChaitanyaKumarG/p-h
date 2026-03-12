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

  /* Generate Text Utility Classes */

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
    css += `  left: ${round(el.frame?.x)}px;\n`;
    css += `  top: ${round(el.frame?.y)}px;\n`;
    css += `  width: ${round(el.frame?.width)}px;\n`;
    css += `  height: ${round(el.frame?.height)}px;\n`;

    if (el.type === "image") {
      css += `  background-image: url('./assets/${className}.png');\n`;
      css += `  background-size: cover;\n`;
      css += `  background-position: center;\n`;
    }

    css += `}\n\n`;
  });

  return css;
}

/* ---------------- TEXT STYLE GENERATION ---------------- */

function generateTextStyles(s) {
  let css = "";

  const fontSize = round(s.fontSize);
  const lineHeight = normalizeLineHeight(fontSize, s.lineHeight);
  const letterSpacing = normalizeLetterSpacing(s.letterSpacing);
  const fontWeight = detectFontWeight(s.fontFamily || "", s.fontWeight);

  if (fontSize) css += `  font-size: ${fontSize}px;\n`;

  css += `  line-height: ${round(lineHeight)}px;\n`;

  if (letterSpacing !== undefined)
    css += `  letter-spacing: ${round(letterSpacing)}px;\n`;

  if (s.fontFamily) css += `  font-family: '${s.fontFamily}';\n`;

  css += `  font-weight: ${fontWeight};\n`;

  if (s.color) css += `  color: ${sanitizeColor(s.color)};\n`;

  if (s.textDecoration && s.textDecoration !== "none")
    css += `  text-decoration: ${s.textDecoration};\n`;

  return css;
}

/* ---------------- STYLE KEY ---------------- */

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

/* ---------------- NORMALIZATION ---------------- */

function normalizeLineHeight(fontSize, lineHeight) {
  if (!lineHeight) return Math.round(fontSize * 1.2);

  if (lineHeight > fontSize * 3) {
    return Math.round(fontSize * 1.2);
  }

  return lineHeight;
}

function normalizeLetterSpacing(value) {
  if (!value) return 0;

  if (Math.abs(value) > 20) return 0;

  return value;
}

function detectFontWeight(fontFamily, fallback) {
  const name = fontFamily.toLowerCase();

  if (name.includes("thin")) return 100;
  if (name.includes("light")) return 300;
  if (name.includes("regular")) return 400;
  if (name.includes("medium")) return 500;
  if (name.includes("semibold")) return 600;
  if (name.includes("bold")) return 700;
  if (name.includes("extrabold")) return 800;

  return fallback || 400;
}

/* ---------------- BASE CSS ---------------- */

function getBaseCSS() {
  return `
body{
  position: relative;
  margin:0;
}

section, header, footer{
  position:relative;
}

.card-group{
  display:flex;
  gap:30px;
  flex-wrap:wrap;
}

.card{
  position:relative;
  width:250px;
}

.icon {
  display:block;
  background-size: cover;
  background-position: center;
}

.icon{
position:absolute;
background-size:cover;
background-position:center;
}

.text-layer {
  position: absolute;
  white-space: pre;
  margin: 0;
  padding: 0;
}

.image-layer {
  position: absolute;
}

.button {
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

function sanitizeClass(id) {
  return (id || "layer").replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase();
}
