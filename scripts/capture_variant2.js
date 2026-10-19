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
  console.log("Launching browser with:", chromePath);
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  try {
    // 1. Desktop Home with Translucent Opaque Blurred Top Bar & Moonlit Stone Silver Gradient
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900 });
      await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded", timeout: 30000 });
      // wait for intro loader to dismiss
      await new Promise(r => setTimeout(r, 3400));
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, "variant2-desktop-home.png") });
      console.log("Captured variant2-desktop-home.png");

      // Scroll slightly to demonstrate translucent opaque blurred top bar over content
      await page.evaluate(() => window.scrollBy(0, 420));
      await new Promise(r => setTimeout(r, 600));
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, "variant2-desktop-navbar-scrolled.png") });
      console.log("Captured variant2-desktop-navbar-scrolled.png");
      await page.close();
    }

    // 2. Desktop Manifesto Section (100% Unified Bold Luxury Typography, Zero Mismatched Letters)
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900 });
      await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded", timeout: 30000 });
      await new Promise(r => setTimeout(r, 3400));
      await page.evaluate(() => {
        const el = document.getElementById("manifesto-section");
        if (el) el.scrollIntoView();
      });
      await new Promise(r => setTimeout(r, 800));
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, "variant2-desktop-manifesto.png") });
      console.log("Captured variant2-desktop-manifesto.png");
      await page.close();
    }

    // 3. Desktop Catalogue Section (Moonlit Stone Silver & Squarish Frame Cards)
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900 });
      await page.goto("http://localhost:3000/#catalogue", { waitUntil: "domcontentloaded", timeout: 30000 });
      await new Promise(r => setTimeout(r, 3400));
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, "variant2-desktop-catalogue.png") });
      console.log("Captured variant2-desktop-catalogue.png");
      await page.close();
    }

    // 4. Mobile Viewport (2 Products per row & Translucent Mobile Top Bar)
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
      await page.goto("http://localhost:3000/#catalogue", { waitUntil: "domcontentloaded", timeout: 30000 });
      await new Promise(r => setTimeout(r, 3400));
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, "variant2-mobile-catalogue.png") });
      console.log("Captured variant2-mobile-catalogue.png");
      await page.close();
    }

    // 5. Mobile Drawer Menu Open
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
      await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded", timeout: 30000 });
      await new Promise(r => setTimeout(r, 3400));
      // Click hamburger
      await page.click('button[aria-label="Toggle Mobile Menu"]');
      await new Promise(r => setTimeout(r, 600));
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, "variant2-mobile-drawer-open.png") });
      console.log("Captured variant2-mobile-drawer-open.png");
      await page.close();
    }

    console.log("ALL Variant 2 screenshots captured successfully!");
  } catch (err) {
    console.error("Error capturing screenshots:", err);
  } finally {
    await browser.close();
  }
}

run();
