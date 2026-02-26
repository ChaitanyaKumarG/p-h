export function detectNavbars(elements, pageWidth) {
  return elements.filter((el) => {
    if (el.type !== "shape") return false;

    const width = el.frame.width;
    const height = el.frame.height;
    const y = el.frame.y;

    const navbarLike = width >= pageWidth * 0.9 && height <= 180 && y <= 500;

    return navbarLike;
  });
}
