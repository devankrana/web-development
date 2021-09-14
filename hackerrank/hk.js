let puppeteer = require("puppeteer");
// const { answers } = require("./codes");
let codeObj=require("./codes");
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
    let browserObj=await browserStartPromise;
    console.log("Browser opened");
    browser = browserObj;
    page=await browserObj.newPage();
    console.log("new tab opened ");
    await page.goto("https://www.google.com/");
    console.log("Google home page opened");
    await page.type("input[title='Search']", "hackerrank");
    await page.keyboard.press('Enter', { delay: 100 });
    await page.waitForSelector("div>h3>a",{ visible: true });
    await page.click("div>h3>a");
    console.log("Hackerrank opened");
    await page.waitForSelector("input[name='username']", { visible: true });
    await page.type("input[name='username']", "fokiso1004@macauvpn.com");
    await page.type("input[name='password']", "web1234");
    await page.keyboard.press('Enter', { delay: 100 });
    // await page.click('button[data-analytics="LoginPassword"]', { delay: 100 });
    await waitAndClick("div[data-automation='algorithms']",page);
    await waitAndClick('input[value="warmup"]',page);
    let questions = await page.$$(".js-track-click.challenge-list-item");
    let quesLinks=[];
    for(let i=1;i<questions.length;i++)
    {
        let link=await page.evaluate(anchor => anchor.getAttribute('href'), questions[i]);
        quesLinks.push(link);
    }
    for(let i=0;i<quesLinks.length;i++)
    {
        let fullLink="https://www.hackerrank.com"+quesLinks[i];
        await questionSolver(page,fullLink,codeObj.answers[i]);
    }
})();


    //.ui-btn.ui-btn-normal.ui-btn-primary.pull-right.hr-monaco-submit.ui-btn-styled
    // .then(function(){
    //     let code=codeObj.answers[0];
    //     let codePromise=page.keyboard.type(code,{delay:50});
    //     console.log("code typed");
    //     return codePromise;
    // })
    // .then(function(){
    //     let submitPromise=waitAndClick('.ui-btn.ui-btn-normal.ui-btn-primary.pull-right.hr-monaco-submit.ui-btn-styled',page);
    //     // console.log("Selected Warmup");
    //     return submitPromise;
    // })


    function questionSolver(page,link,code)
    {
        return new Promise(function(resolve,reject){
            let clickOnQuestionPromise=page.goto(link);
            clickOnQuestionPromise
            .then(function(){
                let waitPromise = page.waitFor(2000);
                return waitPromise;
            })
            // .then(function(){
            //     let editorPromise=waitAndClick('.monaco-editor.no-user-select.vs',page);
            //     // console.log("Selected Warmup");
            //     return editorPromise;
            // })
            .then(function(){
                return waitAndClick('input[type="checkbox"]',page);
            })
            .then(function(){
                // let code=codeObj.answers[0];
                return page.keyboard.type(code,{delay:50});
            })
            .then(function(){
                let holdPromise=page.keyboard.down('ControlLeft');
                return holdPromise;
            })
            .then(function(){
                let selectPromise=page.keyboard.press('KeyA');
                console.log("selected");
                return selectPromise;
            })
            .then(function(){
                let cutPromise=page.keyboard.press('KeyX');
                console.log("cut");
                return cutPromise;
            })
            .then(function(){
                let releasePromise=page.keyboard.up('ControlLeft');
                console.log("done");
                return releasePromise;
            })
            .then(function(){
                let editorPromise=waitAndClick('.monaco-editor.no-user-select.vs',page);
                // console.log("Selected Warmup");
                return editorPromise;
            })
            .then(function(){
                let holdPromise=page.keyboard.down('ControlLeft');
                return holdPromise;
            })
            .then(function(){
                let selectPromise=page.keyboard.press('KeyA');
                console.log("selected");
                return selectPromise;
            })
            .then(function(){
                let cutPromise=page.keyboard.press('KeyV');
                console.log("paste");
                return cutPromise;
            })
            .then(function(){
                let releasePromise=page.keyboard.up('ControlLeft');
                console.log("done");
                return releasePromise;
            })
            .then(function(){
                return waitAndClick('input[type="checkbox"]',page);
            })
            .then(function(){
                return waitAndClick('.hr-monaco__run-code',page);
            })
            .then(function(){
                return page.waitFor(7000);
            })
            .then(function(){
                return page.goBack();
            })
            .then(function () {
                resolve();
            }).catch(function (err) {
                console.log(err)
                reject(err);
            })
        })
    }