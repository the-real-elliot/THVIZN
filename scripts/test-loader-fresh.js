const puppeteer = require("puppeteer-core");
const path = require("path");
const fs = require("fs");

const SCREENSHOT_DIR = "C:/Users/Rexzi/.gemini/antigravity/brain/5bdd04d7-ac3b-483f-9073-066afaa4c1aa/screenshots";

let chromePath = "C:/Program Files/Google/Chrome/Application/chrome.exe";
if (!fs.existsSync(chromePath)) {
  chromePath = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
}

async function captureAtTime(delayMs, filename) {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--incognito"]
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
    await new Promise(r => setTimeout(r, delayMs));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, filename) });
    console.log(`Captured ${filename} at ${delayMs}ms`);
    await page.close();
  } finally {
    await browser.close();
  }
}

async function run() {
  await captureAtTime(250, "94-3d-wardrobe-closed.png");
  await captureAtTime(900, "95-3d-wardrobe-doors-opening.png");
  await captureAtTime(1150, "96-3d-wardrobe-clothes-rack.png");
  console.log("All loader snapshots done!");
}

run().catch(console.error);
