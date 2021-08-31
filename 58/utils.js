
// 元素路径
// 小区名称
const name_path = "#__layout > div > section > section.list-main > section > div.list-cell > a > div.li-info > div.li-title > div";
// 均价
const price_path = "#__layout > div > section > section.list-main > section > div.list-cell > a > div.li-side > div > strong";
// 行政区划
const division_path = "#__layout > div > section > section.list-main > section > div.list-cell > a > div.li-info > div.props.nowrap > span:last-child";
// 小区路由
const url_path = "#__layout > div > section > section.list-main > section > div.list-cell > a";



// 异步休眠函数
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}


// 抽取页面数据
async function get_page_data(browser, page_url) {
    const page = await browser.newPage();
    await page.setUserAgent(userAgent);
    await page.evaluateOnNewDocument(preloadFile);
    // 开启请求拦截功能
    page.setRequestInterception(true);

    page.on('request', async req => {
        // 过滤图片
        const resourceType = req.resourceType();
        if (resourceType === 'image') {
            req.abort();}
        else {
            req.continue();
        }
    });

    await page.goto(page_url, {waitUntil: 'networkidle2'});

    console.log("goto page", page_url);

    // 获取元素
    const estate_name_list = await page.$$eval(name_path,
        el => { return el.map(x => x.innerHTML) });
    const estate_price_list = await page.$$eval(price_path,
        el => { return el.map(x => x.innerHTML) });
    const estate_division_list = await page.$$eval(division_path,
        el => { return el.map(x => x.innerHTML) });
    const estate_url_list = await page.$$eval(url_path,
        el => { return el.map(x => x.href) });

    // 保存页面数据
    let page_data = []
    for (let i=0; i<estate_name_list.length; i++) {
        page_data.push(
            {
                name: estate_name_list[i],
                price: estate_price_list[i],
                division: estate_division_list[i],
                url: estate_url_list[i]
            }
        )

    }
    // 如果获取数据为0,截屏保存
    if (estate_name_list.length === 0) {
        console.log("error in", page_url);
        await page.screenshot({path: 'err.png', fullPage: true,});
        return 0
    }
    page.close();
    return page_data
}