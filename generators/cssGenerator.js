export function generateCSS(elements) {
  let css = "";

  elements.forEach((el) => {
    css += `#${el.id} {\n`;

    css += `  position: absolute;\n`;
    css += `  left: ${round(el.frame.x)}px;\n`;
    css += `  top: ${round(el.frame.y)}px;\n`;
    css += `  width: ${round(el.frame.width)}px;\n`;
    css += `  height: ${round(el.frame.height)}px;\n`;

    if (el.type === "text" && el.styles) {
      const s = el.styles;

      if (s.fontSize) css += `  font-size: ${round(s.fontSize)}px;\n`;

      if (s.lineHeight) css += `  line-height: ${round(s.lineHeight)}px;\n`;

      if (s.letterSpacing)
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

function round(value) {
  return Math.round(value || 0);
}

function sanitizeColor(color) {
  if (!color) return "black";

  return color.replace(/[\d\.]+/g, (num) => Math.round(parseFloat(num)));
}
