const puppeteer = require("C:/web development/node_modules/puppeteer-core");
const fs = require("fs");
const path = require("path");

const SCREENSHOT_DIR = "C:/Users/Rexzi/.gemini/antigravity/brain/5bdd04d7-ac3b-483f-9073-066afaa4c1aa/screenshots";

let chromePath = "C:/Program Files/Google/Chrome/Application/chrome.exe";
if (!fs.existsSync(chromePath)) {
  chromePath = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
}

async function verifyAll() {
  console.log("Launching browser via:", chromePath);
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

    // 1. Visit Track Page directly and seed an order in localStorage
    console.log("1. Visiting Track page and seeding device order...");
    await page.goto("http://localhost:3000/track", { waitUntil: "domcontentloaded", timeout: 20000 });
    await new Promise((r) => setTimeout(r, 1000));

    // Seed order in localStorage
    await page.evaluate(() => {
      const sampleOrder = {
        id: "ord-test-mobile-01",
        orderNumber: "TVZ-8429",
        customerName: "Aaryan Verma",
        phone: "9876543210",
        email: "aaryan@example.com",
        address: "Flat 402, Skyline Residency, Bandra West",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400050",
        items: [
          {
            productId: "prod-1",
            name: "METALLIC EYE OVERSIZED TEE",
            price: 1899,
            size: "L",
            quantity: 1,
            image: "/images/star-logo.png"
          },
          {
            productId: "prod-2",
            name: "HEAVYWEIGHT ACID WASH HOODIE",
            price: 2899,
            size: "XL",
            quantity: 1,
            image: "/images/star-logo.png"
          }
        ],
        subtotal: 4798,
        discount: 480,
        shipping: 0,
        total: 4318,
        paymentMethod: "RAZORPAY_UPI",
        paymentStatus: "PAID",
        orderStatus: "SHIPPED",
        trackingId: "BLUEDART-TVZ-8429",
        courierName: "Blue Dart Express",
        createdAt: new Date().toISOString()
      };
      localStorage.setItem("thvizn_my_orders", JSON.stringify([sampleOrder]));
    });

    // Reload track page so it reads from localStorage
    await page.reload({ waitUntil: "domcontentloaded" });
    await new Promise((r) => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, "mobile-track-device-orders.png"), fullPage: false });
    console.log("Captured mobile-track-device-orders.png");

    // 2. Open Mobile Menu Drawer to show "MY ORDERS [1 ON PHONE]"
    console.log("2. Opening mobile menu drawer...");
    const hamburger = await page.$("button[aria-label='Toggle Menu'], button[aria-label='Toggle menu']");
    if (hamburger) {
      await hamburger.click();
      await new Promise((r) => setTimeout(r, 700));
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, "mobile-drawer-my-orders-active.png"), fullPage: false });
      console.log("Captured mobile-drawer-my-orders-active.png");
    }

    // 3. Capture Receipt View with the new logo
    console.log("3. Rendering receipt preview...");
    const { generateReceiptHtml } = require("C:/thvizn 2nd varient/lib/receipt");
    const testReceiptHtml = generateReceiptHtml({
      orderNumber: "TVZ-8429",
      customerName: "Aaryan Verma",
      phone: "9876543210",
      email: "aaryan@example.com",
      address: "Flat 402, Skyline Residency, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400050",
      total: 4318,
      subtotal: 4798,
      discount: 480,
      paymentMethod: "RAZORPAY_UPI",
      paymentStatus: "PAID",
      orderStatus: "SHIPPED",
      trackingId: "BLUEDART-TVZ-8429",
      items: [
        { name: "METALLIC EYE OVERSIZED TEE", size: "L", quantity: 1, price: 1899 },
        { name: "HEAVYWEIGHT ACID WASH HOODIE", size: "XL", quantity: 1, price: 2899 }
      ]
    });

    const receiptPage = await browser.newPage();
    await receiptPage.setViewport({ width: 750, height: 950 });
    await receiptPage.setContent(testReceiptHtml, { waitUntil: "domcontentloaded" });
    await new Promise((r) => setTimeout(r, 800));
    await receiptPage.screenshot({ path: path.join(SCREENSHOT_DIR, "receipt-updated-logo.png"), fullPage: true });
    console.log("Captured receipt-updated-logo.png");

    console.log("All target screenshots successfully generated!");
  } catch (err) {
    console.error("Error during verification:", err);
  } finally {
    await browser.close();
  }
}

verifyAll();
