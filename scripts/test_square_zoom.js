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

async function testZoom() {
  console.log("Launching browser for zoom test:", chromePath);
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 950 });
    console.log("Navigating to product page...");
    await page.goto("http://localhost:3000/product/thvizn-north-star-heavyweight-tee", {
      waitUntil: "domcontentloaded",
      timeout: 30000
    });

    // Wait for IntroLoader (2900ms) to completely vanish
    await new Promise(r => setTimeout(r, 3600));

    // Get all gallery photo cards
    const cards = await page.$$(".hidden.md\\:grid > div");
    console.log(`Found ${cards.length} desktop gallery photo cards.`);

    if (cards.length > 0) {
      // TEST 1: Hover over First Long Hero Photo (aspect 2/3)
      console.log("TEST 1: Hover over Hero Photo (at top)...");
      const heroBox = await cards[0].boundingBox();
      console.log("Hero photo bounding box:", heroBox);

      // Move mouse onto hero chest/graphic area
      await page.mouse.move(heroBox.x + heroBox.width * 0.5, heroBox.y + heroBox.height * 0.35);
      await new Promise(r => setTimeout(r, 600));

      const zoomInfo1 = await page.evaluate(() => {
        // Query portal zoom on document.body
        const portal = Array.from(document.body.children).find(el => el.classList && el.classList.contains("z-[9999]"));
        if (!portal) return { found: false };
        const rect = portal.getBoundingClientRect();
        const img = portal.querySelector("img");
        return {
          found: true,
          portalParent: portal.parentElement.tagName,
          width: rect.width,
          height: rect.height,
          isSquare: Math.abs(rect.width - rect.height) < 1,
          top: rect.top,
          right: window.innerWidth - rect.right,
          imgStyleWidth: img ? img.style.width : null,
          imgStyleHeight: img ? img.style.height : null,
          imgTransform: img ? img.style.transform : null,
        };
      });
      console.log("TEST 1 ZOOM METRICS:", zoomInfo1);

      await page.screenshot({ path: path.join(SCREENSHOT_DIR, "variant2-fixed-square-zoom-hero.png") });
      console.log("Saved variant2-fixed-square-zoom-hero.png");

      // TEST 2: Scroll Down to Detail Photos (Collar / Fabric Quality)
      console.log("TEST 2: Scrolling down to Detail Card 1...");
      await cards[1].evaluate(el => el.scrollIntoView({ block: "center", behavior: "instant" }));
      await new Promise(r => setTimeout(r, 500));

      const card1Box = await cards[1].boundingBox();
      console.log("Detail card 1 bounding box:", card1Box);
      await page.mouse.move(card1Box.x + card1Box.width * 0.5, card1Box.y + card1Box.height * 0.5);
      await new Promise(r => setTimeout(r, 600));

      const zoomInfo2 = await page.evaluate(() => {
        const portal = Array.from(document.body.children).find(el => el.classList && el.classList.contains("z-[9999]"));
        if (!portal) return { found: false };
        const rect = portal.getBoundingClientRect();
        const img = portal.querySelector("img");
        return {
          found: true,
          scrollY: window.scrollY,
          top: rect.top,
          bottom: rect.bottom,
          width: rect.width,
          height: rect.height,
          isSquare: Math.abs(rect.width - rect.height) < 1,
          imgStyleWidth: img ? img.style.width : null,
          imgStyleHeight: img ? img.style.height : null,
        };
      });
      console.log("TEST 2 ZOOM METRICS (Scrolled):", zoomInfo2);

      await page.screenshot({ path: path.join(SCREENSHOT_DIR, "variant2-fixed-square-zoom-scrolled.png") });
      console.log("Saved variant2-fixed-square-zoom-scrolled.png");

      // TEST 3: Scroll further down to Arms / Shoulders
      if (cards.length > 3) {
        console.log("TEST 3: Scrolling down to Detail Card 3...");
        await cards[3].evaluate(el => el.scrollIntoView({ block: "center", behavior: "instant" }));
        await new Promise(r => setTimeout(r, 500));

        const card3Box = await cards[3].boundingBox();
        console.log("Detail card 3 bounding box:", card3Box);
        await page.mouse.move(card3Box.x + card3Box.width * 0.5, card3Box.y + card3Box.height * 0.5);
        await new Promise(r => setTimeout(r, 600));

        await page.screenshot({ path: path.join(SCREENSHOT_DIR, "variant2-fixed-square-zoom-deep-scrolled.png") });
        console.log("Saved variant2-fixed-square-zoom-deep-scrolled.png");
      }
    }

    await page.close();
    console.log("All tests passed!");
  } catch (err) {
    console.error("Test error:", err);
  } finally {
    await browser.close();
  }
}

testZoom();
