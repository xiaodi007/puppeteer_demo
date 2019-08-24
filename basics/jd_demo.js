const puppeteer = require('./node_modules/puppeteer-core');
const fs = require('fs');

const preloadFile = fs.readFileSync('./basics/js_injection.js', 'utf8');

const userAgent = 'Mozilla/5.0 (X11; Linux x86_64)' + 'Baiduspider' +
    'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
const viewport = {width: 1920, height: 1080,}

(async () => {
    // connect chrome docker
    const browser = await puppeteer.connect({ browserWSEndpoint: 'ws://182.61.30.150:9000' });
    // init new page
    const page = await browser.newPage();
    // set windows height width
    await page.setViewport(viewport);
    await page.setUserAgent(userAgent);
    // inject js
    // await page.evaluateOnNewDocument(preloadFile);
    await page.goto('https://item.jd.com/4148692.html');
    await page.screenshot({path: './screenshot/jd_without.png'});
    await browser.close();
})();