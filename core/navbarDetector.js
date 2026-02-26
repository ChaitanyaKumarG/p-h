export function detectNavbars(elements, pageWidth) {
  return elements.filter((el) => {
    if (el.type !== "shape") return false;

    const { width, height, y } = el.frame;

    const nearTop = y < 250;
    const wide = width > pageWidth * 0.9;
    const thin = height < 140;

    return nearTop && wide && thin;
  });
}
