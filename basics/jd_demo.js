const puppeteer = require('puppeteer-core');
const fs = require('fs');

const preloadFile = fs.readFileSync('js_injection.js', 'utf8');

const userAgent = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64)' +
    'AppleWebKit/537.36 (KHTML, like Gec            ko) Chrome/75.0.3770.100 Safari/537.36';
const viewport = {width: 1920, height: 1080,};

(async () => {
    // connect chrome docker
    const browser = await puppeteer.connect({ browserWSEndpoint: 'ws://119.23.255.159:9000' });
    // init new page
    const page = await browser.newPage();
    // set windows height width
    // await page.setViewport(viewport);
    await page.setUserAgent(userAgent);
    // inject js
    // await page.evaluateOnNewDocument(preloadFile);
    await page.goto('http://km.xiaoqu.zhuge.com/', {waitUntil: 'networkidle2'});
    console.log("gotp page")
    const name = await page.$$eval("#listTableBox > li",
            el => { return el.map(anchor => anchor.innerHTML) });
    // await page.goto('https://blog.csdn.net/qq_24448899/article/details/78083319');
    // await page.screenshot({path: 'jd_without.png', fullPage: true,});
    console.log(name)
    await browser.close();
})();