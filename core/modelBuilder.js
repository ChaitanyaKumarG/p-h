import { detectButtons } from "./buttonDetector.js";
import { detectNavbars } from "./navbarDetector.js";
import { detectCards } from "./cardDetector.js";

export function buildModel(normalized) {
  const elements = normalized.elements || [];
  const pageWidth = normalized.document.width;

  const { buttons, used } = detectButtons(elements);

  const navbars = detectNavbars(elements, pageWidth);
  const cards = detectCards(elements, pageWidth);

  return {
    document: normalized.document,
    elements,
    buttons,
    navbars,
    cards,
    usedElements: [...used],
  };
}
