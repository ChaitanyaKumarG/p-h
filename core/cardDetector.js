export function detectCards(elements, pageWidth) {
  return elements.filter((el) => {
    if (el.type !== "shape") return false;

    const { width, height } = el.frame;

    /* Reject obvious junk */
    if (width < 150 || height < 120) return false; // too small
    if (height < 40) return false; // divider lines
    if (width > pageWidth * 0.98 && height > 500) return false; // page blocks

    const ratio = width / height;

    if (ratio > 8 || ratio < 0.2) return false; // weird strips

    return true;
  });
}
