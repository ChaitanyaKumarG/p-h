export function generateHTML(model) {
  let html = "";

  const elements = model.elements || [];
  const buttons = model.buttons || [];
  const navbars = model.navbars || [];
  const cards = model.cards || [];

  const used = new Set(model.usedElements || []);

  const navbarIds = new Set(navbars.map((n) => n.id));
  const cardIds = new Set(cards.map((c) => c.id));

  elements.forEach((el) => {
    const cls = sanitize(el.id);

    /* NAVBAR */
    if (navbarIds.has(el.id)) {
      html += `<header class="navbar ${cls}"></header>\n`;
      used.add(el.id);
      return;
    }

    /* CARD */
    if (cardIds.has(el.id)) {
      html += `<section class="card ${cls}"></section>\n`;
      used.add(el.id);
      return;
    }

    /* BUTTONS */
    const btn = buttons.find((b) => b.container.id === el.id);
    if (btn) {
      html += `
<button class="button button-${btn.variant} ${cls}">
  ${escape(btn.label?.name)}
</button>\n`;

      used.add(btn.label.id);
      used.add(btn.container.id);
      return;
    }

    /* SKIP USED */
    if (used.has(el.id)) return;

    /* NORMAL ELEMENTS */
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
