export function detectNavbar(elements) {
  const navbars = [];

  elements.forEach((el) => {
    if (el.type !== "text") return;

    const content = el.name.trim();

    // Detect pipe-style nav
    if (content.includes("|")) {
      navbars.push(el);
      return;
    }

    // Detect multi-space nav
    const items = content.split(/\s{2,}/).filter(Boolean);

    if (items.length >= 3) {
      navbars.push(el);
      return;
    }

    // Detect common menu words
    if (/home|profile|practice|contact/i.test(content)) {
      navbars.push(el);
    }
  });

  return navbars;
}
