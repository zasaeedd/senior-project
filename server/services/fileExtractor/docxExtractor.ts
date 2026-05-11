import mammoth from "mammoth";

export async function extractDocx(filePath: string): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value; // raw text from DOCX
  } catch (err) {
    console.error("Error extracting DOCX:", err);
    throw err;
  }
}
