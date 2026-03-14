export function generateHTML(model) {
  let html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Generated Page</title>
<link rel="stylesheet" href="styles.css">
</head>
<body>
`;

  model.sections.forEach((section) => {
    const sectionTag =
      section.semantic === "header"
        ? "header"
        : section.semantic === "footer"
          ? "footer"
          : "section";

    html += `<${sectionTag} class="${section.id}">\n`;

    (section.rows || []).forEach((row) => {
      /* ---------- FORM ---------- */

      if (row.semantic === "form") {
        html += `<form>\n`;

        row.forEach((el) => {
          if (el.type === "text") {
            html += `<input placeholder="${escape(el.name)}"/>\n`;
          }
        });

        html += `</form>\n`;

        return;
      }

      /* ---------- NAV ---------- */

      if (row.semantic === "nav") {
        html += `<nav>\n<ul>\n`;

        row.forEach((el) => {
          if (el.type === "text") {
            const items = el.name
              .trim()
              .split(/\s{2,}|\|/)
              .filter(Boolean);

            items.forEach((item) => {
              html += `<li>${escape(item.trim())}</li>\n`;
            });
          }
        });

        html += `</ul>\n</nav>\n`;

        return;
      }

      /* ---------- CARD GROUP ---------- */

      if (row.semantic === "card-group") {
        html += `<section class="card-group">\n`;

        const images = row.filter((el) => el.type === "image");
        const texts = row.filter((el) => el.type === "text");

        const count = Math.min(images.length, texts.length);

        for (let i = 0; i < count; i++) {
          html += `<article class="card">\n`;

          html += `<div class="icon ${sanitize(images[i].id)}"></div>\n`;

          html += `<h3 class="${sanitize(texts[i].id)}">${escape(texts[i].name)}</h3>\n`;

          html += `</article>\n`;
        }

        html += `</section>\n`;

        return;
      }

      /* ---------- NORMAL - LAYERS ---------- */

      row.forEach((el) => {
        /* TEXT */

        if (el.type === "text") {
          const tag = el.semantic || "p";

          const cls = sanitize(el.id);

          html += `<${tag} class="${cls}">${escape(el.name)}</${tag}>\n`;
        } else if (el.type === "image") {

        /* IMAGE */
          const cls = sanitize(el.id);

          html += `<div class="${cls}"></div>\n`;
        }
      });
    });

    html += `</${sectionTag}>\n\n`;
  });

  html += `
</body>
</html>
`;

  return html;
}

/* ---------- HELPERS ---------- */

function sanitize(id) {
  return String(id || "layer")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .toLowerCase();
}

function escape(text) {
  return (text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
