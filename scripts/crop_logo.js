const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

let chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
if (!fs.existsSync(chromePath)) chromePath = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

(async () => {
  const browser = await puppeteer.launch({ executablePath: chromePath, headless: 'new' });
  const page = await browser.newPage();
  await page.setContent('<html><body><canvas id="c"></canvas></body></html>');
  const fileData = fs.readFileSync('C:/Users/Rexzi/Downloads/04.png').toString('base64');
  
  const croppedDataUrl = await page.evaluate(async (b64) => {
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
        for (let y = 0; y < img.height; y++) {
          for (let x = 0; x < img.width; x++) {
            const idx = (y * img.width + x) * 4;
            const a = data[idx+3];
            if (a > 20) {
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }
        // Add 20px padding
        const pad = 30;
        minX = Math.max(0, minX - pad);
        minY = Math.max(0, minY - pad);
        maxX = Math.min(img.width, maxX + pad);
        maxY = Math.min(img.height, maxY + pad);
        const cropW = maxX - minX;
        const cropH = maxY - minY;

        const outCanvas = document.createElement('canvas');
        outCanvas.width = cropW;
        outCanvas.height = cropH;
        const outCtx = outCanvas.getContext('2d');
        outCtx.drawImage(c, minX, minY, cropW, cropH, 0, 0, cropW, cropH);
        resolve(outCanvas.toDataURL('image/png'));
      };
      img.src = 'data:image/png;base64,' + b64;
    });
  }, fileData);

  const base64Data = croppedDataUrl.replace(/^data:image\/png;base64,/, '');
  const outDir = 'C:/thvizn 2nd varient/public/images';
  fs.writeFileSync(path.join(outDir, 'star-logo.png'), base64Data, 'base64');
  fs.writeFileSync(path.join(outDir, 'thvizn-eye-logo.png'), base64Data, 'base64');
  // Also copy uncropped 04.png as full
  fs.copyFileSync('C:/Users/Rexzi/Downloads/04.png', path.join(outDir, 'star-logo-full.png'));
  console.log('Successfully saved cropped and full star-logo.png to public/images!');

  await browser.close();
})();
