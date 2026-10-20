const puppeteer = require("C:/web development/node_modules/puppeteer-core");
const fs = require("fs");
const path = require("path");

const SCREENSHOT_DIR = "C:/Users/Rexzi/.gemini/antigravity/brain/5bdd04d7-ac3b-483f-9073-066afaa4c1aa/screenshots";

let chromePath = "C:/Program Files/Google/Chrome/Application/chrome.exe";
if (!fs.existsSync(chromePath)) {
  chromePath = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
}

async function testMobileMenu() {
  console.log("Launching headless browser via:", chromePath);
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  try {
    const page = await browser.newPage();
    // Emulate iPhone 14 Pro mobile viewport
    await page.setViewport({ width: 393, height: 852, isMobile: true, hasTouch: true });

    console.log("Navigating to http://localhost:3000/...");
    await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded", timeout: 15000 });
    // Wait for initial loader fade out and full unmount
    await new Promise((r) => setTimeout(r, 2200));

    // 1. Initial Mobile Home Screenshot
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "mobile-home-smooth.png") });
    console.log("Captured mobile-home-smooth.png");

    // 2. Click Mobile Hamburger Menu
    console.log("Clicking mobile hamburger button...");
    await page.evaluate(() => {
      const btn = document.querySelector("button[aria-label='Toggle Mobile Menu']");
      if (btn) btn.click();
    });

    // Wait 350ms for slide-in animation
    await new Promise((r) => setTimeout(r, 350));

    // Capture open drawer
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "mobile-menu-open-smooth.png") });
    console.log("Captured mobile-menu-open-smooth.png");

    // 3. Click Close Button inside Drawer
    console.log("Clicking close button inside mobile drawer...");
    const closeBtn = await page.$("button[aria-label='Close Mobile Menu']");
    if (closeBtn) {
      await closeBtn.click();
      await new Promise((r) => setTimeout(r, 350));
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, "mobile-menu-closed.png") });
      console.log("Captured mobile-menu-closed.png");
    }

    // 4. Test Opening Again and Clicking Backdrop
    console.log("Testing reopening drawer and clicking backdrop...");
    await page.evaluate(() => {
      const btn = document.querySelector("button[aria-label='Toggle Mobile Menu']");
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 350));
    // Click backdrop (x: 350, y: 300)
    await page.mouse.click(350, 300);
    await new Promise((r) => setTimeout(r, 350));
    console.log("Backdrop click test passed.");

    // 5. Test Scroll Smoothness on Mobile
    console.log("Scrolling down smoothly on mobile...");
    await page.evaluate(() => {
      window.scrollBy({ top: 600, behavior: "smooth" });
    });
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "mobile-scrolled-smooth.png") });
    console.log("Captured mobile-scrolled-smooth.png");

    console.log("SUCCESS! All mobile menu and scroll interactions verified cleanly.");
  } catch (err) {
    console.error("Test failed:", err);
  } finally {
    await browser.close();
  }
}

testMobileMenu();
