import { detectButtons } from "./buttonDetector.js";

export function buildModel(normalized) {
  const elements = normalized.elements || [];

  const { buttons, used } = detectButtons(elements);

  return {
    document: normalized.document,
    elements,
    buttons,
    usedElements: [...used],
  };
}
