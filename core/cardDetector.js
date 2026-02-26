export function detectCards(elements, pageWidth) {
  return elements.filter((el) => {
    if (el.type !== "shape") return false;

    const width = el.frame.width;
    const height = el.frame.height;

    const sizeMatch =
      width > 220 && height > 160 && width < pageWidth * 0.95 && height < 1000;

    return sizeMatch;
  });
}
