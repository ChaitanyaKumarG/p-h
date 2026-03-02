export function generateHTML(model) {
  let html = "";

  model.sections.forEach((section) => {
    html += `<section class="${section.id}">\n`;

    section.rows.forEach((row) => {
      html += `  <div class="row">\n`;

      row.forEach((el) => {
        const cls = sanitize(el.id);

        if (el.type === "text") {
          html += `    <div class="text-layer ${cls}">${escape(el.name)}</div>\n`;
        } else {
          html += `    <div class="image-layer ${cls}"></div>\n`;
        }
      });

      html += `  </div>\n`;
    });

    html += `</section>\n\n`;
  });

  return html;
}

function sanitize(id) {
  return id.replace(/[^a-zA-Z0-9_-]/g, "_");
}

function escape(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
