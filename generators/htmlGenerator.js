export function generateHTML(elements) {
  let html = "";

  elements.forEach((el) => {
    const className = sanitizeClass(el.id);

    if (el.type === "text") {
      html += `<div class="text-layer ${className}">${escape(el.name)}</div>\n`;
    } else {
      html += `<div class="image-layer ${className}"></div>\n`;
    }
  });

  return html;
}

function sanitizeClass(id) {
  return id.replace(/[^a-zA-Z0-9_-]/g, "_").replace(/^_+/, "");
}

function escape(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
