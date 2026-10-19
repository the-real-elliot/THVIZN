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

async function dismissIntro(page) {
  try {
    // If skip button is available, click it immediately
    const skipBtn = await page.$("button:has-text('SKIP'), button");
    if (skipBtn) {
      await page.keyboard.press("Escape");
      await page.click("button");
    }
  } catch (e) {}
  // Wait until IntroLoader is fully gone from DOM
  await page.waitForFunction(() => !document.querySelector("[aria-label='Skip Intro']"), { timeout: 6000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 600));
}

async function capture() {
  console.log("Launching browser for background verification...");
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 950 });

    // 1. Home Top Hero
    console.log("Navigating to Home...");
    await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded", timeout: 30000 });
    await dismissIntro(page);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "variant2-white-gradient-home.png") });
    console.log("Saved variant2-white-gradient-home.png");

    // 2. Home Scrolled / Mid-body
    console.log("Scrolling Home to mid-body...");
    await page.evaluate(() => window.scrollBy(0, 500));
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "variant2-white-gradient-scrolled.png") });
    console.log("Saved variant2-white-gradient-scrolled.png");

    // 3. Product Page
    console.log("Navigating to Product...");
    await page.goto("http://localhost:3000/product/thvizn-north-star-heavyweight-tee", {
      waitUntil: "domcontentloaded",
      timeout: 30000
    });
    await dismissIntro(page);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "variant2-white-gradient-product.png") });
    console.log("Saved variant2-white-gradient-product.png");

    // 4. Leaderboard Page
    console.log("Navigating to Leaderboard...");
    await page.goto("http://localhost:3000/leaderboard", {
      waitUntil: "domcontentloaded",
      timeout: 30000
    });
    await dismissIntro(page);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "variant2-white-gradient-leaderboard.png") });
    console.log("Saved variant2-white-gradient-leaderboard.png");

    await page.close();
    console.log("All background captures done!");
  } catch (err) {
    console.error("Capture error:", err);
  } finally {
    await browser.close();
  }
}

capture();
