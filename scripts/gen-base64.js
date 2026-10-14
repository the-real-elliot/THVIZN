const fs = require("fs");
const path = require("path");

const imgPath = path.join(__dirname, "..", "public", "images", "star-logo.png");
if (fs.existsSync(imgPath)) {
  const buf = fs.readFileSync(imgPath);
  const b64 = buf.toString("base64");
  const tsContent = `export const STAR_LOGO_BASE64 = "data:image/png;base64,${b64}";\n`;
  const outPath = path.join(__dirname, "..", "lib", "star-logo-base64.ts");
  fs.writeFileSync(outPath, tsContent, "utf8");
  console.log("Successfully wrote lib/star-logo-base64.ts with size:", tsContent.length);
} else {
  console.error("Image file not found:", imgPath);
  process.exit(1);
}
