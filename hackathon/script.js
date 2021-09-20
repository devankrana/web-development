let puppeteer = require("puppeteer");
let listObj=require("./fileCreator");
let src=process.cwd();
let amazon="https://www.amazon.in";
let flipkart="https://www.flipkart.com";
// creates headless browser
let browserStartPromise = puppeteer.launch({
    // visible 
    headless: false,
    // type 1sec // slowMo: 1000,
    defaultViewport: null,
    // browser setting 
    args: ["--start-maximized", "--disable-notifications"]
});
let page, browser, rTab;
//input format----> item min_price max_price
//example-->node .\script.js "earphones" "500" "1000"
let inputArr=process.argv.slice(2);
let item=inputArr[0];
let min=inputArr[1];
let max=inputArr[2];

function waitAndClick(selector, cPage) {
    return new Promise(function (resolve, reject) {
        let waitForModalPromise =
            cPage.waitForSelector(selector, { visible: true });
        waitForModalPromise.then(function () {
            let clickModal = cPage.click(selector, { delay: 100 });
            return clickModal;
        }).then(function () {
            resolve();
        }).catch(function (err) {
            reject(err)
        })
    }
    )
}

(async function(){

    if(Number(max)<Number(min))
    {
        console.log("Wrong Input--> Minimum value should be less then maximum value");
        return;
    }

    let browserObj=await browserStartPromise;
    page=await browserObj.newPage();
    
    //---------------------------------------------------AMAZON SECTION---------------------------------------------------------//
    try
    {
        await page.goto("https://www.amazon.in/");
        await page.waitForSelector("input[aria-label='Search']",{ visible: true });
        await page.type("input[aria-label='Search']", item);
        await page.keyboard.press('Enter', { delay: 100 });
        await page.waitForSelector('input[name="low-price"]',{ visible: true });
        await page.type('input[name="low-price"]',min);
        await page.type('input[name="high-price"]',max);
        await waitAndClick('#a-autoid-1',page);
        await page.waitFor(3000);
        await waitAndClick('section[aria-label="4 Stars & Up"]',page);
        // await page.waitFor(3000);
        // await waitTillHTMLRendered(page);
        await page.waitForSelector("h2>a>span",{ visible: true });
        let names = await page.$$("h2>a>span");
        let reviews=await page.$$(".a-popover-trigger.a-declarative");
        let prices=await page.$$(".a-price-whole");
        let amazonLinks=await page.$$("h2>a");
        let topResults=[];
        for(let i=0;i<prices.length;i++)
        {
            let product=await page.evaluate(getNameAndPrice, names[i], prices[i],reviews[i+1],amazonLinks[i]);
            product.link=amazon+product.link;
            topResults.push(product);
            listObj.addData(src,"amazon",item,product);
        }
    }catch(err){
        console.log("Error in Amazon");
    }
    // console.log(`----------------------AMAZON-----------------------`)
    // console.table(topResults);



    //---------------------------------------------------FLIPKART SECTION---------------------------------------------------------//
    try
    {
    await page.goto("https://www.flipkart.com/");
    // await waitTillHTMLRendered(page);
    await page.waitForSelector("input[type='text']",{ visible: true });
    await page.click("input[type='text']");
    await page.type("input[type='text']", item);
    await page.keyboard.press('Enter', { delay: 100 });
    await waitAndClick("._1YAKP4",page);
    let minRangeList=await page.$$("div[class='_1YAKP4']>select>option");
    // console.log(minRangeList.length);
    let flipMin=parseInt(min);
    // console.log(flipMin);
    let flipMax=parseInt(max);
    // console.log(flipMax);
    // let minOptions=priceRangeList.length/2;
    let bestMin=0;
    for(let i=1;i<minRangeList.length;i++)
    {   
        // priceRangeList=await page.$$("._3AsjWR");
        let option=await page.evaluate(anchor => anchor.getAttribute('value'), minRangeList[i]);
        let compare=Number(option);
        // console.log(compare);
        if(flipMin<=compare)
        {   
            // console.log("In condition");
            bestMin=i;
            break;
        }
    }
    // console.log(bestMin);
    for(let j=0;j<bestMin;j++)
    {
        await page.keyboard.press("ArrowDown");
    }
    await page.keyboard.press("Enter");
    await page.waitFor(3000);
    await waitAndClick("._3uDYxP",page);
    let maxRangeList=await page.$$("div[class='_3uDYxP']>select>option");
    let bestMax=0;
    for(let i=0;i<maxRangeList.length;i++)
    {   
        let option=await page.evaluate(anchor => anchor.getAttribute('value'), maxRangeList[i]);
        // console.log(option);
        if(flipMax<Number(option))
        {
            bestMax=i;
            break;
        }
    }
    // console.log(bestMax);
    for(let j=0;j<maxRangeList.length-bestMax;j++)
    {
        await page.keyboard.press("ArrowUp",{delay:100});
    }
    await page.keyboard.press("Enter");
    // await page.waitFor(3000);
    await waitTillHTMLRendered(page);
    await waitAndClick("div[title='4★ & above']",page);
    await waitTillHTMLRendered(page);
    let flipkartNames = await page.$$("a[title]");
    let flipKartPrices=await page.$$("._30jeq3");
    let flipkartResults=[];
    if(flipkartNames.length==3)
    {
        flipkartNames=await page.$$("._4rR01T");
        let flipLinks=await page.$$('div[data-id] a');
        for(let i=0;i<flipKartPrices.length;i++)
        {
            let product=await page.evaluate(getFlipkartDetails, flipkartNames[i], flipKartPrices[i],flipLinks[i]);
            product.link=flipkart+product.link;
            flipkartResults.push(product);
            listObj.addData(src,"flipkart",item,product);
        }
    }else{
        for(let i=0;i<flipKartPrices.length;i++)
        {
            let product=await page.evaluate(getFlipkartDetails, flipkartNames[i+3], flipKartPrices[i],flipkartNames[i+3]);
            product.link=flipkart+product.link;
            flipkartResults.push(product);
            listObj.addData(src,"flipkart",item,product);
        }

    }
}catch(err){
    console.log("Error in Flipkart");
}
// let flipkartReviews=await page.$$("._3LWZlK");

    // console.log(`----------------------FLIPKART-----------------------`);
    // console.table(flipkartResults);

})();

function getNameAndPrice(element1, element2,element3,element4) {
    return {
        name: element1.textContent.trim(),
        price: element2.textContent.trim(),
        reviews: element3.textContent.trim(),
        link: element4.getAttribute("href")
    }
}

function getFlipkartDetails(element1, element2,element3) {
    return {
        name: element1.textContent.trim(),
        price: element2.textContent.trim(),
        link: element3.getAttribute("href")
    }
}


const waitTillHTMLRendered = async (page, timeout = 10000) => {
    const checkDurationMsecs = 1000;
    const maxChecks = timeout / checkDurationMsecs;
    let lastHTMLSize = 0;
    let checkCounts = 1;
    let countStableSizeIterations = 0;
    const minStableSizeIterations = 3;

    while (checkCounts++ <= maxChecks) {
        let html = await page.content();
        let currentHTMLSize = html.length;

        let bodyHTMLSize = await page.evaluate(() => document.body.innerHTML.length);

        // console.log('last: ', lastHTMLSize, ' <> curr: ', currentHTMLSize, " body html size: ", bodyHTMLSize);

        if (lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize)
            countStableSizeIterations++;
        else
            countStableSizeIterations = 0; //reset the counter

        if (countStableSizeIterations >= minStableSizeIterations) {
            console.log("Page rendered fully..");
            break;
        }

        lastHTMLSize = currentHTMLSize;
        await page.waitFor(checkDurationMsecs);
    }
};