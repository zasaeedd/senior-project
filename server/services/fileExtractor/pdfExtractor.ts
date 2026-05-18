const { PDFParse } = require("pdf-parse");

export async function extractPdf(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: buffer });

  try {
    const result = (await parser.getText()) as { text?: string };
    return result.text || "";
  } finally {
    await parser.destroy();
  }
}
