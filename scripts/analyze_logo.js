const puppeteer = require('puppeteer-core');
const fs = require('fs');

let chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
if (!fs.existsSync(chromePath)) chromePath = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

(async () => {
  const browser = await puppeteer.launch({ executablePath: chromePath, headless: 'new' });
  const page = await browser.newPage();
  await page.setContent('<html><body><canvas id="c"></canvas></body></html>');
  const fileData = fs.readFileSync('C:/Users/Rexzi/Downloads/04.png').toString('base64');
  const info = await page.evaluate(async (b64) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const c = document.getElementById('c');
        c.width = img.width;
        c.height = img.height;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, img.width, img.height).data;
        let minX = img.width, minY = img.height, maxX = 0, maxY = 0;
        let transparentCorner = data[3] === 0;
        let whiteCorner = data[0] > 250 && data[1] > 250 && data[2] > 250;
        for (let y = 0; y < img.height; y += 4) {
          for (let x = 0; x < img.width; x += 4) {
            const idx = (y * img.width + x) * 4;
            const r = data[idx], g = data[idx+1], b = data[idx+2], a = data[idx+3];
            const isContent = a > 20 && !(r > 245 && g > 245 && b > 245);
            if (isContent) {
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }
        resolve({ width: img.width, height: img.height, transparentCorner, whiteCorner, minX, minY, maxX, maxY });
      };
      img.src = 'data:image/png;base64,' + b64;
    });
  }, fileData);
  console.log('04.png bounds info:', info);
  await browser.close();
})();
