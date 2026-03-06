export function detectSections(elements) {
  const sorted = [...elements].sort((a, b) => a.frame.y - b.frame.y);

  const sections = [];

  let currentSection = [];
  let lastY = null;

  const GAP_THRESHOLD = 400;

  sorted.forEach((el) => {
    const y = el.frame.y;

    if (lastY !== null && Math.abs(y - lastY) > GAP_THRESHOLD) {
      sections.push(currentSection);
      currentSection = [];
    }

    currentSection.push(el);

    lastY = y;
  });

  if (currentSection.length) {
    sections.push(currentSection);
  }

  return sections;
}
