const puppeteer = require("puppeteer-core");
const path = require("path");
const fs = require("fs");

const SCREENSHOT_DIR = "C:/Users/Rexzi/.gemini/antigravity/brain/5bdd04d7-ac3b-483f-9073-066afaa4c1aa/screenshots";

let chromePath = "C:/Program Files/Google/Chrome/Application/chrome.exe";
if (!fs.existsSync(chromePath)) {
  chromePath = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  try {
    // 1. Desktop Footer with dummy company info & direct links
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900 });
      // Pre-set splash done so footer is immediately visible
      await page.evaluateOnNewDocument(() => {
        sessionStorage.setItem("thvizn_splash_done", "true");
      });
      await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded", timeout: 30000 });
      await new Promise(r => setTimeout(r, 1200));

      // Scroll to footer bottom
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      await new Promise(r => setTimeout(r, 800));

      await page.screenshot({ path: path.join(SCREENSHOT_DIR, "90-footer-company-info.png") });
      console.log("Captured 90-footer-company-info.png");
      await page.close();
    }

    // 2. Mobile Footer View
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
      await page.evaluateOnNewDocument(() => {
        sessionStorage.setItem("thvizn_splash_done", "true");
      });
      await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded", timeout: 30000 });
      await new Promise(r => setTimeout(r, 1200));

      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      await new Promise(r => setTimeout(r, 800));

      await page.screenshot({ path: path.join(SCREENSHOT_DIR, "93-mobile-footer-company-info.png") });
      console.log("Captured 93-mobile-footer-company-info.png");
      await page.close();
    }

    // 3. 3D Clothing Wardrobe Loading Screen - Closed with center plaque
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900 });
      await page.evaluateOnNewDocument(() => {
        sessionStorage.clear();
      });
      await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded", timeout: 30000 });
      await new Promise(r => setTimeout(r, 350));
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, "91-3d-wardrobe-closed.png") });
      console.log("Captured 91-3d-wardrobe-closed.png");
      await page.close();
    }

    // 4. 3D Clothing Wardrobe Loading Screen - Doors Swung Wide Open Revealing 3D Clothing Rack
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900 });
      await page.evaluateOnNewDocument(() => {
        sessionStorage.clear();
      });
      await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded", timeout: 30000 });
      // Capture at 1100ms when doors have fully swung 110deg and garments are in full view
      await new Promise(r => setTimeout(r, 1100));
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, "92-3d-wardrobe-opened-clothing-rack.png") });
      console.log("Captured 92-3d-wardrobe-opened-clothing-rack.png");
      await page.close();
    }

    console.log("ALL COMPLETE!");
  } finally {
    await browser.close();
  }
}

run().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
