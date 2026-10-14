const puppeteer = require("puppeteer-core");
const path = require("path");
const fs = require("fs");

const SCREENSHOT_DIR = "C:/Users/Rexzi/.gemini/antigravity/brain/5bdd04d7-ac3b-483f-9073-066afaa4c1aa/screenshots";

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

let chromePath = "C:/Program Files/Google/Chrome/Application/chrome.exe";
if (!fs.existsSync(chromePath)) {
  chromePath = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
}

async function run() {
  console.log("Launching browser via:", chromePath);
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  try {
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(60000);

    // 1. Mobile Menu Open from Left + Mosaic Backdrop on Right
    console.log("Capturing 83-mobile-left-menu-open.png...");
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
    await new Promise(r => setTimeout(r, 1500));

    // Click hamburger
    const hamburger = await page.$('button[aria-label="Toggle Mobile Menu"]');
    if (hamburger) {
      await hamburger.click();
      await new Promise(r => setTimeout(r, 1000));
    }

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "83-mobile-left-menu-open.png"),
      fullPage: false
    });
    console.log("Saved: 83-mobile-left-menu-open.png");

    // Close hamburger for next mobile screenshot
    if (hamburger) {
      await hamburger.click();
      await new Promise(r => setTimeout(r, 500));
    }

    // 2. Mobile Catalogue 2-Col + Bigger Categories
    console.log("Capturing 84-mobile-catalogue-2col.png...");
    await page.evaluate(() => {
      const cat = document.getElementById("catalogue");
      if (cat) cat.scrollIntoView();
    });
    await new Promise(r => setTimeout(r, 1000));

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "84-mobile-catalogue-2col.png"),
      fullPage: false
    });
    console.log("Saved: 84-mobile-catalogue-2col.png");

    // 3. Desktop Soria Headlines & Curvy Circle Background
    console.log("Capturing 85-desktop-soria-headlines.png...");
    await page.setViewport({ width: 1440, height: 900, isMobile: false, hasTouch: false });
    await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
    await new Promise(r => setTimeout(r, 1200));

    await page.evaluate(() => {
      const cat = document.getElementById("catalogue");
      if (cat) cat.scrollIntoView();
    });
    await new Promise(r => setTimeout(r, 1000));

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "85-desktop-soria-headlines.png"),
      fullPage: false
    });
    console.log("Saved: 85-desktop-soria-headlines.png");

    // 4. Desktop Brand Manifesto Trio (Soria + Thinoo + Soria)
    console.log("Capturing 86-desktop-manifesto-trio.png...");
    await page.evaluate(() => {
      const man = document.getElementById("manifesto-section");
      if (man) man.scrollIntoView();
    });
    await new Promise(r => setTimeout(r, 1000));

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "86-desktop-manifesto-trio.png"),
      fullPage: false
    });
    console.log("Saved: 86-desktop-manifesto-trio.png");

    // 5. Leaderboard Most Dedicated Collectors in Full Soria
    console.log("Capturing 87-leaderboard-soria.png...");
    await page.goto("http://localhost:3000/leaderboard", { waitUntil: "domcontentloaded" });
    await new Promise(r => setTimeout(r, 1200));

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "87-leaderboard-soria.png"),
      fullPage: false
    });
    console.log("Saved: 87-leaderboard-soria.png");

    // 6. Contact Support How Can We Help You in Full Soria
    console.log("Capturing 88-contact-soria.png...");
    await page.goto("http://localhost:3000/contact", { waitUntil: "domcontentloaded" });
    await new Promise(r => setTimeout(r, 1200));

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "88-contact-soria.png"),
      fullPage: false
    });
    console.log("Saved: 88-contact-soria.png");

    // 7. Wardrobe Loading Screen Animation
    console.log("Capturing 89-wardrobe-loader.png...");
    const loaderPage = await browser.newPage();
    await loaderPage.setViewport({ width: 1440, height: 900 });
    await loaderPage.evaluateOnNewDocument(() => {
      sessionStorage.clear();
    });
    await loaderPage.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
    await new Promise(r => setTimeout(r, 350));

    await loaderPage.screenshot({
      path: path.join(SCREENSHOT_DIR, "89-wardrobe-loader.png"),
      fullPage: false
    });
    console.log("Saved: 89-wardrobe-loader.png");
    await loaderPage.close();

    await page.close();
    console.log("ALL 7 VERIFICATION SCREENSHOTS SAVED SUCCESSFULLY!");
  } finally {
    await browser.close();
  }
}

run().catch(err => {
  console.error("Error capturing screenshots:", err);
  process.exit(1);
});
