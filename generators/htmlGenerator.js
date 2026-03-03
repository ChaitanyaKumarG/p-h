export function generateHTML(model) {
  let html = "";

  model.sections.forEach((section) => {
    const sectionTag =
      section.semantic === "header"
        ? "header"
        : section.semantic === "footer"
          ? "footer"
          : section.semantic === "hero"
            ? "section"
            : "section";

    const sectionClass =
      section.semantic === "hero"
        ? `class="hero ${section.id}"`
        : `class="${section.id}"`;

    html += `<${sectionTag} ${sectionClass}>\n`;

    section.rows.forEach((row) => {
      /* ----- FORM ----- */
      if (row.semantic === "form") {
        html += `  <form>\n`;

        row.forEach((el) => {
          if (el.type === "text") {
            html += `    <input placeholder="${escape(el.name)}" />\n`;
          }
        });

        html += `  </form>\n`;
        return;
      }

      if (row.semantic === "nav") {
        html += `  <nav>\n    <ul>\n`;

        row.forEach((el) => {
          if (el.type === "text") {
            const items = el.name.split(/\s{2,}/);

            items.forEach((item) => {
              html += `      <li>${escape(item.trim())}</li>\n`;
            });
          }
        });

        html += `    </ul>\n  </nav>\n`;
        return;
      }

      /* ----- NAV / CARD / NORMAL ROW ----- */
      const rowTag = row.semantic === "nav" ? "nav" : "div";

      const rowClass = row.semantic === "card-group" ? "card-group" : "row";

      html += `  <${rowTag} class="${rowClass}">\n`;

      row.forEach((el) => {
        if (el.type === "text") {
          const tag = el.semantic || "div";
          html += `    <${tag}>${escape(el.name)}</${tag}>\n`;
        } else {
          html += `    <div class="image-layer ${sanitize(el.id)}"></div>\n`;
        }
      });

      html += `  </${rowTag}>\n`;
    });

    html += `</${sectionTag}>\n\n`;
  });

  return html;
}

function sanitize(id) {
  return (id || "").replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase();
}

function escape(text) {
  return (text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
