export function segmentSections(elements) {
  if (!elements || elements.length === 0) return [];

  // sort by Y position
  const sorted = [...elements].sort((a, b) => a.frame.y - b.frame.y);

  const sections = [];
  let currentSection = {
    id: "section_0",
    elements: [],
    top: sorted[0].frame.y,
  };

  const GAP_THRESHOLD = 350; // vertical gap to create new section

  sorted.forEach((el, index) => {
    const prev = sorted[index - 1];

    if (prev) {
      const gap = el.frame.y - (prev.frame.y + prev.frame.height);

      if (gap > GAP_THRESHOLD) {
        sections.push(currentSection);

        currentSection = {
          id: `section_${sections.length}`,
          elements: [],
          top: el.frame.y,
        };
      }
    }

    currentSection.elements.push(el);
  });

  sections.push(currentSection);

  return sections;
}
