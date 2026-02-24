export function generateHTML(elements) {
  let html = "";

  elements.forEach((el) => {
    if (el.type === "text") {
      html += `<div id="${el.id}">${escape(el.name)}</div>\n`;
    } else if (el.type === "image") {
      html += `<div id="${el.id}"></div>\n`;
    }
  });

  return html;
}

function escape(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
