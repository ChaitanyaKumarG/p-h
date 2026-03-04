export function generateHTML(model) {
  let html = "";

  model.sections.forEach((section) => {
    const sectionTag =
      section.semantic === "header"
        ? "header"
        : section.semantic === "footer"
          ? "footer"
          : "section";

    html += `<${sectionTag} class="${section.id}">\n`;

    section.rows.forEach((row) => {
      console.log("ROW SEMANTIC:", row.semantic);

      /* ---------- FORM ---------- */

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

      /* ---------- NAV ---------- */

      if (row.semantic === "nav") {
        html += `  <nav>\n    <ul>\n`;

        row.forEach((el) => {
          if (el.type === "text") {
            const items = el.name
              .trim()
              .split(/\s{2,}|\|/)
              .filter(Boolean);

            items.forEach((item) => {
              html += `      <li>${escape(item.trim())}</li>\n`;
            });
          }
        });

        html += `    </ul>\n  </nav>\n`;

        return;
      }

      /* ---------- NORMAL ROW ---------- */

      html += `  <div class="row">\n`;

      row.forEach((el) => {
        if (el.type === "text") {
          const tag = el.semantic || "p";

          html += `    <${tag}>${escape(el.name)}</${tag}>\n`;
        } else {
          html += `    <div class="image-layer ${sanitize(el.id)}"></div>\n`;
        }
      });

      html += `  </div>\n`;
    });

    html += `</${sectionTag}>\n\n`;
  });

  return html;
}

/* ---------- HELPERS ---------- */

function sanitize(id) {
  return (id || "").replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase();
}

function escape(text) {
  return (text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
