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
    // 1. Mobile Catalogue 2-Col
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
      await page.goto("http://localhost:3000/#catalogue", { waitUntil: "domcontentloaded", timeout: 30000 });
      await new Promise(r => setTimeout(r, 1200));
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, "84-mobile-catalogue-2col.png") });
      console.log("Captured 84-mobile-catalogue-2col.png");
      await page.close();
    }

    // 2. Desktop Soria Headlines
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900 });
      await page.goto("http://localhost:3000/#catalogue", { waitUntil: "domcontentloaded", timeout: 30000 });
      await new Promise(r => setTimeout(r, 1200));
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, "85-desktop-soria-headlines.png") });
      console.log("Captured 85-desktop-soria-headlines.png");
      await page.close();
    }

    // 3. Desktop Manifesto Trio
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900 });
      await page.goto("http://localhost:3000/#manifesto-section", { waitUntil: "domcontentloaded", timeout: 30000 });
      await new Promise(r => setTimeout(r, 1200));
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, "86-desktop-manifesto-trio.png") });
      console.log("Captured 86-desktop-manifesto-trio.png");
      await page.close();
    }

    // 4. Leaderboard Soria
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900 });
      await page.goto("http://localhost:3000/leaderboard", { waitUntil: "domcontentloaded", timeout: 30000 });
      await new Promise(r => setTimeout(r, 1200));
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, "87-leaderboard-soria.png") });
      console.log("Captured 87-leaderboard-soria.png");
      await page.close();
    }

    // 5. Contact Soria
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900 });
      await page.goto("http://localhost:3000/contact", { waitUntil: "domcontentloaded", timeout: 30000 });
      await new Promise(r => setTimeout(r, 1200));
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, "88-contact-soria.png") });
      console.log("Captured 88-contact-soria.png");
      await page.close();
    }

    // 6. Wardrobe Loader
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900 });
      await page.evaluateOnNewDocument(() => {
        sessionStorage.clear();
      });
      await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded", timeout: 30000 });
      await new Promise(r => setTimeout(r, 280));
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, "89-wardrobe-loader.png") });
      console.log("Captured 89-wardrobe-loader.png");
      await page.close();
    }

    console.log("ALL DONE!");
  } finally {
    await browser.close();
  }
}

run().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
