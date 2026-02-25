export function generateHTML(model) {
  let html = "";

  const buttons = model.buttons || [];
  const elements = model.elements || [];
  const used = new Set(model.usedElements || []);

  /* Render Buttons */
  buttons.forEach(({ container, label }) => {
    html += `
<button class="button ${sanitize(container.id)}">
  ${escape(label?.name)}
</button>\n`;
  });

  /* Remaining Elements */
  elements.forEach((el) => {
    if (used.has(el.id)) return;

    const cls = sanitize(el.id);

    if (el.type === "text") {
      html += `<div class="text-layer ${cls}">${escape(el.name)}</div>\n`;
    } else {
      html += `<div class="image-layer ${cls}"></div>\n`;
    }
  });

  return html;
}

function sanitize(id) {
  return id.replace(/[^a-zA-Z0-9_-]/g, "_");
}

function escape(text) {
  if (!text) return "";

  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}