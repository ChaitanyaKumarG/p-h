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

  const rows = [];

  sorted.forEach((el) => {
    let placed = false;

    for (const row of rows) {
      if (isVerticallyAligned(el, row[0])) {
        row.push(el);
        placed = true;
        break;
      }
    }

    if (!placed) {
      rows.push([el]);
    }
  });

  return rows.map((row) => row.sort((a, b) => a.frame.x - b.frame.x));
}

/* --- helper --- */

function isVerticallyAligned(a, b) {
  const aTop = a.frame.y;
  const aBottom = a.frame.y + a.frame.height;

  const bTop = b.frame.y;
  const bBottom = b.frame.y + b.frame.height;

  const overlap = Math.min(aBottom, bBottom) - Math.max(aTop, bTop);

  return overlap > Math.min(a.frame.height, b.frame.height) * 0.4;
}