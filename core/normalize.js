export function normalizePsd(psd) {
  return {
    document: {
      width: psd.width,
      height: psd.height,
    },
    elements: extractLayers(psd.children || []),
  };
}

function extractLayers(layers, result = [], parent = null) {
  layers.forEach((layer, index) => {
    const left = layer.left ?? 0;
    const top = layer.top ?? 0;
    const right = layer.right ?? left;
    const bottom = layer.bottom ?? top;

    const element = {
      id: `${layer.name}_${index}`,
      name: layer.name,
      type: detectType(layer),
      frame: {
        x: left,
        y: top,
        width: right - left,
        height: bottom - top,
      },
      parent,
    };

    result.push(element);

    if (layer.children) {
      extractLayers(layer.children, result, element.id);
    }
  });

  return result;
}

function detectType(layer) {
  if (layer.text) return "text";
  if (layer.children) return "group";
  return "image";
}
