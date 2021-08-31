const puppeteer = require('puppeteer-core');
const fs = require('fs');

const { saveAllData, setUrl, get_untorch_urls } = require('./database')

const puppeteer_url = "ws://127.0.0.1:9000";

// 加载注入的js文件
const preloadFile = fs.readFileSync('injection.js', 'utf8');
const user_agent_list = require('./user_agent.json');

// 随机筛选user_agent
function random_user_agent() {
    return  user_agent_list[Math.floor(Math.random() * user_agent_list.length)]
}


(async () => {
    // connect chrome docker
    const browser = await puppeteer.connect({ browserWSEndpoint: puppeteer_url });

    // 获取待爬取待页面列表
    let url_lists = await get_untorch_urls();


    for (const page_url of url_lists) {
        console.log(page_url)
        // 获取页面数据
        let page_data = await get_page_data(browser, page_url);
        // 当反爬时，进行等待 再爬取
        while (page_data === 0 ){
            console.log("retry: ", page_url)
            const page = await browser.newPage();
            await page.setUserAgent(random_user_agent());
            await page.evaluateOnNewDocument(preloadFile);

            await page.goto(page_url, {waitUntil: 'networkidle2'});
            await page.click("#btnSubmit");

            console.log("click")
            await sleep(5000);
            await page.screenshot({path: 'err2.png', fullPage: true,});
            await page.waitForSelector(name_path);
            await page.screenshot({path: 'err3.png', fullPage: true,});
            page.close();
            let page_data = await get_page_data(browser, page_url);
            await sleep(30000);
        }
        console.log("get data")
        await saveAllData(page_data);
        console.log("save data")

        await setUrl(page_url);
        console.log("set estate")
        await sleep(100);

    }
    await browser.close();
})();