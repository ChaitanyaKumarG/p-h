// import fs from 'fs';
// import { readPsd } from 'ag-psd';


// export function parsePsd(filePath) {
//   const buffer = fs.readFileSync(filePath);
//   const psd = readPsd(buffer, { skipLayerImageData: true });
//   return psd;
// }


// core/parsePsd.js
import fs from "fs";
import { readPsd, initializeCanvas } from "ag-psd";

// 🔥 IMPORTANT: tell ag-psd NOT to use canvas
initializeCanvas(() => {
  throw new Error("Canvas disabled");
});

export function parsePsd(filePath) {
  const buffer = fs.readFileSync(filePath);

  const psd = readPsd(buffer, {
    skipLayerImageData: true,
    skipCompositeImageData: true,
  });

  return psd;
}
