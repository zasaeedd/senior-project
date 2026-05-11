import officeParser from "officeparser";

export async function extractPptx(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    officeParser.parseOffice(filePath, (ast, err) => {
      if (err) {
        reject(err);
      } else {
        // ast is a structured object, not a string
        // You need to walk through it to collect text
        let textContent = "";

        function walk(node: any) {
          if (typeof node === "string") {
            textContent += node + " ";
          } else if (Array.isArray(node)) {
            node.forEach(walk);
          } else if (typeof node === "object" && node !== null) {
            Object.values(node).forEach(walk);
          }
        }

        walk(ast);
        resolve(textContent.trim());
      }
    });
  });
}
