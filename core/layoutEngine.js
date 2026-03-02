export function buildLayoutModel(normalized) {
  const elements = normalized.elements.filter((el) => el.frame.height > 10);

  // Sort by vertical center
  elements.sort((a, b) => {
    const centerA = a.frame.y + a.frame.height / 2;
    const centerB = b.frame.y + b.frame.height / 2;
    return centerA - centerB;
  });

  const sections = [];
  const SECTION_GAP = 250;

  let sectionIndex = 0;
  let lastCenter = null;
  let currentSection = createSection(sectionIndex);

  elements.forEach((el) => {
    const center = el.frame.y + el.frame.height / 2;

    if (lastCenter !== null) {
      const gap = Math.abs(center - lastCenter);

      if (gap > SECTION_GAP) {
        sections.push(finalizeSection(currentSection));
        sectionIndex++;
        currentSection = createSection(sectionIndex);
      }
    }

    currentSection.elements.push(el);
    lastCenter = center;
  });

  if (currentSection.elements.length) {
    sections.push(finalizeSection(currentSection));
  }

  return {
    document: normalized.document,
    sections,
  };
}

/* -------- SECTION HELPERS -------- */

function createSection(index) {
  return {
    id: `section_${index}`,
    elements: [],
  };
}

function finalizeSection(section) {
  section.rows = detectRows(section.elements);
  return section;
}

/* -------- ROW DETECTION -------- */

function detectRows(elements) {
  const sorted = [...elements].sort((a, b) => a.frame.y - b.frame.y);

  const ROW_GAP = 60;
  const rows = [];

  let currentRow = [];
  let lastY = null;

  sorted.forEach((el) => {
    const y = el.frame.y;

    if (lastY !== null && Math.abs(y - lastY) > ROW_GAP) {
      rows.push(currentRow);
      currentRow = [];
    }

    currentRow.push(el);
    lastY = y;
  });

  if (currentRow.length) {
    rows.push(currentRow);
  }

  return rows;
}
