export function applySemanticTagging(model) {
  model.sections.forEach((section, index) => {
    section.rows.forEach((row) => {
      row.forEach((el) => {
        if (el.type !== "text") return;

        el.semantic = detectTextRole(el, section, index);
      });
    });

    // Detect header (top section)
    if (index === 0) {
      section.semantic = "header";
    }

    // Detect footer (last section)
    if (index === model.sections.length - 1) {
      section.semantic = "footer";
    }
  });

  return model;
}

/* -------- TEXT ROLE DETECTION -------- */

function detectTextRole(el, section, sectionIndex) {
  const height = el.frame.height;
  const width = el.frame.width;

  // Large text → heading
  if (height > 50) {
    return sectionIndex === 1 ? "h1" : "h2";
  }

  // Medium text → subheading
  if (height > 30) {
    return "h3";
  }

  // Small wide text → paragraph
  if (width > 300) {
    return "p";
  }

  return "span";
}
