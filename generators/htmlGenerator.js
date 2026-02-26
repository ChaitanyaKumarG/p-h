export function generateHTML(model) {
  let html = "";

  const buttonMap = new Map();

  /* Map elements → button */
  (model.buttons || []).forEach(({ container, label }) => {
    buttonMap.set(container.id, { container, label });
    buttonMap.set(label.id, { container, label });
  });

  (model.elements || []).forEach((el) => {
    const cls = sanitize(el.id);

    /* If element belongs to button */
    if (buttonMap.has(el.id)) {
      const { container, label } = buttonMap.get(el.id);

      /* Render ONLY once (on container) */
      if (el.id !== container.id) return;

      html += `
<button class="button ${sanitize(container.id)}">
  ${escape(label?.name)}
</button>\n`;

      return;
    }

    /* Normal rendering */
    if (el.type === "text") {
      html += `<div class="text-layer ${cls}">${escape(el.name)}</div>\n`;
    } else {
      html += `<div class="image-layer ${cls}"></div>\n`;
    }
  });

  return html;
}

/* ---------------- HELPERS ---------------- */

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
