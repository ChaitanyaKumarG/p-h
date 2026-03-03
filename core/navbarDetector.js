function detectNavbar(model) {
  const header = model.sections.find((s) => s.semantic === "header");
  if (!header) return;

  header.rows.forEach((row) => {
    const texts = row.filter((el) => el.type === "text");

    // Case 1: multiple small items
    if (texts.length >= 3 && texts.every((t) => t.frame.width < 300)) {
      row.semantic = "nav";
      return;
    }

    // Case 2: single wide text with menu words
    if (texts.length === 1) {
      const content = texts[0].name;

      const wordCount = content.split(/\s{2,}/).length;

      if (wordCount >= 3) {
        row.semantic = "nav";
      }
    }
  });
}
