import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer";

const url = process.env.URL || process.argv[2];
if (!url) {
  console.error("Usage: URL=<url> node scripts/screenshot_puppeteer.mjs <url>");
  process.exit(2);
}

const outDir = process.env.OUT_DIR || process.argv[3] || "/tmp";
fs.mkdirSync(outDir, { recursive: true });

const shots = [
  { name: "mobile", width: 390, height: 844, deviceScaleFactor: 2 },
  { name: "desktop", width: 1280, height: 720, deviceScaleFactor: 1 },
];

const browser = await puppeteer.launch({
  headless: "new",
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
  ],
});

try {
  for (const s of shots) {
    const page = await browser.newPage();
    await page.setViewport({
      width: s.width,
      height: s.height,
      deviceScaleFactor: s.deviceScaleFactor,
    });

    page.setDefaultTimeout(60000);
    page.setDefaultNavigationTimeout(60000);

    await page.goto(url, { waitUntil: "networkidle2" });
    // give Vite/React a beat for transitions
    await new Promise((r) => setTimeout(r, 1500));

    const outPath = path.join(outDir, `clube_${s.name}.png`);
    await page.screenshot({ path: outPath, fullPage: true });
    console.log(outPath);

    await page.close();
  }
} finally {
  await browser.close();
}
