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
      html += `  <div class="row">\n`;

      row.forEach((el) => {
        if (el.type === "text") {
          const tag = el.semantic || "div";
          html += `    <${tag}>${escape(el.name)}</${tag}>\n`;
        } else {
          html += `    <div class="image-layer ${sanitize(el.id)}"></div>\n`;
        }
      });

      html += `  </div>\n`;
    });

    html += `</${sectionTag}>\n\n`;
  });

  function sanitize(id) {
    return (id || "").replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase();
  }
  function escape(text) {
    return (text || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  return html;
}
