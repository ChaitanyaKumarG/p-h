import { detectButtons } from "./buttonDetector.js";
// import { detectNavbar } from "./navbarDetector.js";
// import { detectCards } from "./cardDetector.js";
// import { detectForms } from "./formDetector.js";
// import { detectSections } from "./sectionDetector.js";
import { segmentSections } from "./sectionSegmenter.js";



export function buildModel(normalized) {
  const elements = normalized.elements || [];
  const pageWidth = normalized.document.width;

  const { buttons, used } = detectButtons(elements);
  // const sections = detectSections(elements);
  const sections = segmentSections(elements);
  // const navbars = detectNavbar(elements);
  // const cards = detectCards(elements, pageWidth);
  // const forms = detectForms(elements);

  return {
    document: normalized.document,
    // elements,
    sections,
    buttons,
    navbars,
    cards,
    forms,
    usedElements: [...used],
  };
}
