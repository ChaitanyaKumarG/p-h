export function applySemanticTagging(model) {
  /* ---- SECTION LEVEL ---- */
  model.sections.forEach((section, index) => {
    if (index === 0) section.semantic = "header";
    if (index === 1) section.semantic = "hero";
    if (index === model.sections.length - 1) section.semantic = "footer";

    /* ---- TEXT ROLES ---- */
    section.rows.forEach((row) => {
      row.forEach((el) => {
        if (el.type === "text") {
          el.semantic = detectTextRole(el, index);
        }
      });
    });
  });

  detectNavbar(model);
  detectCards(model);
  detectForm(model);

  return model;


  console.log(
    model.sections.map((s) => ({
      section: s.id,
      rows: s.rows.map((r) => r.semantic),
    })),
  );
}

/* ---------- NAVBAR ---------- */

function detectNavbar(model) {
  const header = model.sections.find((s) => s.semantic === "header");
  if (!header) return;

  header.rows.forEach((row) => {
    const texts = row.filter((el) => el.type === "text");

    console.log(
      "HEADER ROW TEXT:",
      texts.map((t) => t.name),
    );

    if (texts.length >= 3 && texts.every((t) => t.frame.width < 300)) {
      row.semantic = "nav";
    }
  });
}

/* ---------- CARDS ---------- */

function detectCards(model) {
  model.sections.forEach((section) => {
    section.rows.forEach((row) => {
      const images = row.filter((el) => el.type === "image");
      const texts = row.filter((el) => el.type === "text");

      if (images.length >= 3 && texts.length >= 3) {
        row.semantic = "card-group";
      }
    });
  });
}

/* ---------- FORM ---------- */

function detectForm(model) {
  const footer = model.sections.find((s) => s.semantic === "footer");
  if (!footer) return;

  footer.rows.forEach((row) => {
    const formFields = row.filter(
      (el) =>
        el.type === "text" &&
        /name|email|phone/i.test(el.name) &&
        el.frame.width < 400,
    );

    if (formFields.length >= 2) {
      row.semantic = "form";
    }
  });
}

/* ---------- TEXT ROLE ---------- */

function detectTextRole(el, sectionIndex) {
  const height = el.frame.height;
  const width = el.frame.width;

  if (height > 50) {
    return sectionIndex === 1 ? "h1" : "h2";
  }

  if (height > 30) {
    return "h3";
  }

  if (width > 300) {
    return "p";
  }

  return "span";
}

