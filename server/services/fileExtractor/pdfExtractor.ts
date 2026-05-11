// fallback if ESModuleInterop doesn't fix it
const pdfParse = require("pdf-parse");

export async function extractPdf(buffer: Buffer): Promise<string> {
  const result = await pdfParse(buffer);
  return result.text;
}
