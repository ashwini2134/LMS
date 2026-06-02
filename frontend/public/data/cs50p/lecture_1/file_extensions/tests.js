export function runTests(code) {
  const codeWithoutComments = code.replace(/#.*$/gm, "");
  const normalized = codeWithoutComments.toLowerCase().replace(/\s/g, "");

  if (normalized.length === 0) {
    return { passed: false, message: "? Code cannot be empty or just comments." };
  }

  const reqExts = ["gif", "jpg", "jpeg", "png", "pdf", "txt", "zip"];
  for (let i = 0; i < reqExts.length; i++) {
      if (!normalized.includes(reqExts[i])) {
          return { passed: false, message: "? Expected logic for extension: " + reqExts[i] };
      }
  }

  if (!normalized.includes(".endswith(") && !normalized.includes(".split(") && !normalized.includes(".rsplit(")) {
      return { passed: false, message: "? Expected file extension extraction logic (e.g. .endswith or .split)." };
  }

  const mediaTypes = ["image/gif", "image/jpeg", "image/png", "application/pdf", "text/plain", "application/zip", "application/octet-stream"];
  let count = 0;
  for (let i = 0; i < mediaTypes.length; i++) {
      if (normalized.includes(mediaTypes[i].replace(/\s/g, ""))) {
          count++;
      }
  }
  if (count < 4) {
      return { passed: false, message: "? Expected mapping to multiple media types, not a constant." };
  }

  return { passed: true, message: "? All test cases passed!" };
}
