const puppeteer = require("puppeteer-core");
const path = require("path");
const fs = require("fs");

const SCREENSHOT_DIR = "C:/Users/Rexzi/.gemini/antigravity/brain/5bdd04d7-ac3b-483f-9073-066afaa4c1aa/screenshots";

let chromePath = "C:/Program Files/Google/Chrome/Application/chrome.exe";
if (!fs.existsSync(chromePath)) {
  chromePath = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
}

async function verify() {
  console.log("Launching browser for clean photo verification...");
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 950 });

    console.log("Navigating to tactical cargo pants product page...");
    await page.goto("http://localhost:3000/product/thvizn-tactical-cargo-pants", {
      waitUntil: "domcontentloaded",
      timeout: 30000
    });

    // Wait for IntroLoader to finish opening and disappear
    await new Promise(r => setTimeout(r, 3600));

    // Get all gallery photo cards
    const cards = await page.$$(".hidden.md\\:grid > div");
    console.log(`Found ${cards.length} desktop cards.`);

    if (cards.length > 1) {
      // Scroll so detail cards 1 and 2 are centered in viewport
      await cards[1].evaluate(el => el.scrollIntoView({ block: "center", behavior: "instant" }));
      await new Promise(r => setTimeout(r, 600));

      // 1. Screenshot of clean photos without any text overlays and with tighter gap
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, "variant2-clean-photos-tight-gap.png") });
      console.log("Saved variant2-clean-photos-tight-gap.png");

      // 2. Hover over card 1 to activate square zoom box
      const cardBox = await cards[1].boundingBox();
      if (cardBox) {
        await page.mouse.move(cardBox.x + cardBox.width * 0.5, cardBox.y + cardBox.height * 0.5);
        await new Promise(r => setTimeout(r, 600));

        await page.screenshot({ path: path.join(SCREENSHOT_DIR, "variant2-clean-zoom-no-text.png") });
        console.log("Saved variant2-clean-zoom-no-text.png");
      }
    }

    await page.close();
    console.log("Done!");
  } catch (err) {
    console.error("Verification error:", err);
  } finally {
    await browser.close();
  }
}

verify();
