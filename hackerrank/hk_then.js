let puppeteer = require("puppeteer");
const { answers } = require("./codes");
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


browserStartPromise
    .then(function (browserObj) {
        console.log("Browser opened");
        // new tab 
        browser = browserObj
        let browserTabOpenPromise = browserObj.newPage();
        return browserTabOpenPromise;
    }).then(function (newTab) {
        page = newTab
        console.log("new tab opened ")
        let gPageOpenPromise =
            newTab.goto("https://www.google.com/");
        return gPageOpenPromise;
    }).then(function () {
        console.log("Google home page opened");
        // keyboard -> data entry 
        let waitforTypingPromise = page.type("input[title='Search']", "hackerrank");
        return waitforTypingPromise;
    }).then(function () {
        // keyboard -> specific keys
        let enterWillBeDonePromise = page.keyboard.press('Enter', { delay: 100 });
        return enterWillBeDonePromise;
    }).then(function () {
        // next page 
        //wait for element to be visible on the page-> whenver you go to a new page 
        console.log("wait for element to be visible");
        let waitForElementPromise = page.waitForSelector("div>h3>a",
            { visible: true });
        return waitForElementPromise;
    }).then(function () {
        // mouse function 
        let elemClickPromise = page.click("div>h3>a");
        return elemClickPromise;
    })
    //email--> fokiso1004@macauvpn.com password--> web1234
    .then(function () {
        // 30 seconds 
        console.log("Hackerrank opened");
        let waitForUserPromise = page.waitForSelector("input[name='username']", { visible: true });
        return waitForUserPromise;
    })
    .then(function(){
        console.log("Username Entered");
        let usernamePromise = page.type("input[name='username']", "fokiso1004@macauvpn.com");
        return usernamePromise;
    })
    .then(function(){
        console.log("Password Entered");
        let passwordPromise = page.type("input[name='password']", "web1234");
        return passwordPromise;
    }).then(function () {
        console.log("Logged in");
        let loginPromise = page.keyboard.press('Enter', { delay: 100 });
        return loginPromise;
    })
    .then(function(){
        let algorithmPromise=waitAndClick("div[data-automation='algorithms']",page);
        console.log("clicked on algorithm");
        return algorithmPromise;
    })
    .then(function(){
        let warmUpPromise=waitAndClick('input[value="warmup"]',page);
        console.log("Selected Warmup");
        return warmUpPromise;
    })
    .then(function () {
        // page element -> cheerio 
        let allChallengePromise = page.$$(".ui-btn.ui-btn-normal.primary-cta.ui-btn-line-primary.ui-btn-styled");
        return allChallengePromise;
    }).then(function (questions) {
        let code=codeObj.answers[0];
        let elementWillBeclickedPromise = questionSolver(page,questions[0],code);
        console.log("clicked on challenge");
        return elementWillBeclickedPromise;
    })
    
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


    function questionSolver(page,question,code)
    {
        return new Promise(function(resolve,reject){
            let clickOnQuestionPromise=question.click();
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
                return page.waitFor(5000);
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