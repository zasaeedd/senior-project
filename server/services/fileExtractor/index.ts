import { extractPdf } from "./pdfExtractor";
import { extractDocx } from "./docxExtractor";
import { extractPptx } from "./pptxExtractor";

export async function extractFile(filePath: string, fileType: string) {
  switch (fileType.toLowerCase()) {
    case "pdf":
      return await extractPdf(filePath);
    case "docx":
      return await extractDocx(filePath);
    case "pptx":
      return await extractPptx(filePath);
    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
}
