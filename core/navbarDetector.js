export function detectNavbar(elements) {
  const navbars = [];

  elements.forEach((el) => {
    if (el.type !== "text") return;

    const text = el.name.trim();

    if (text.includes("|")) {
      navbars.push(el);
      return;
    }

    const items = text.split(/\s{2,}/).filter(Boolean);

    if (items.length >= 3) {
      navbars.push(el);
      return;
    }

    if (/home|about|profile|practice|contact/i.test(text)) {
      navbars.push(el);
    }
  });

  return navbars;
}
