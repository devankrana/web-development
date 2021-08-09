let request = require("request");
let cheerio = require("cheerio");
let playerObj=require("./createplayer");
let src=process.cwd();

console.log("Project to get stats of all players of IPL 2020");
request('https://www.espncricinfo.com/series/ipl-2020-21-1210595', cb);

function cb(error, response, html) {
    // console.error('error:', error); // Print the error if one occurred
    if (error) {
        console.log(error);
    } else if (response.statusCode == 404) {
        console.log("Page not Found");
    } else {
        // console.log(body);
        dataExtracter(html);
    }
    // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    // console.log('body:', body); // Print the HTML for the Google homepage.
}

function dataExtracter(html) {
    let searchTool = cheerio.load(html); //search tool
    let allResults = searchTool('a[data-hover="View All Results"]'); //css selector
    let link = allResults.attr("href");
    let fullLink = "https://www.espncricinfo.com" + link;
    request(fullLink, newcb);
    // console.log(fullLink);
}
function newcb(error, response, html) {
    if (error) {
        console.log(error);
    } else if (response.statusCode == 404) {
        console.log("Page not Found");
    } else {
        // console.log(body);
        getScorecard(html);
    }
}

function getScorecard(html) {
    let searchTool = cheerio.load(html); //search tool
    let allScorecards = searchTool('a[data-hover="Scorecard"]'); //css selector

    for (let i = 0; i < allScorecards.length; i++) {
        let link = searchTool(allScorecards[i]).attr("href");
        let fullLink = "https://www.espncricinfo.com" + link;
        request(fullLink, scorecb);
        console.log(fullLink);
    }
}

function scorecb(error, response, html) {
    if (error) {
        console.log(error);
    } else if (response.statusCode == 404) {
        console.log("Page not Found");
    } else {
        // console.log(body);
        getStats(html);
    }
}

function getStats(html) {
    let searchTool = cheerio.load(html); //search tool
    let teams = searchTool(".header-title.label");
    let batsman = searchTool('.table.batsman tbody tr'); //css selector

    let teamOne = searchTool(teams[0]).text();
    let teamOneNameArray = teamOne.split(" ");
    let teamOneName = "";
    for (let i = 0; i < teamOneNameArray.length; i++) {
        if (teamOneNameArray[i] == "INNINGS") { break; }
        else { teamOneName += teamOneNameArray[i] + " "; }
    }

    let teamTwo = searchTool(teams[1]).text();
    let teamTwoNameArray = teamTwo.split(" ");
    let teamTwoName = "";
    for (let i = 0; i < teamTwoNameArray.length; i++) {
        if (teamTwoNameArray[i] == "INNINGS") { break; }
        else { teamTwoName += teamTwoNameArray[i] + " "; }
    }

    let result=getresult(html);
    // console.log(result);

    let desp=getDescription(html);
    let despArray=desp.split(", ");
    let venue=despArray[1];
    let date=despArray[2];
    // console.log(date+ " "+venue);
    // let date=getdate(html);

    // console.log(teamOneName);
    // console.log("''''''''''''''''''''''''''''''''''''");
    myTeam=teamOneName.trim();
    oppTeam=teamTwoName.trim();

    
    for (let i = 0; i < batsman.length-1; i++) {

        let cols = searchTool(batsman[i]).find("td");
        
        if (searchTool(cols[0]).text() == "Extras") {
            myTeam=teamTwoName.trim();
            oppTeam=teamOneName.trim();
        }
        if (cols.length == 8) {
            let content={};
            content["myTeamName"]=myTeam;
            content["name"]=searchTool(cols[0]).text().trim();
            content["venue"]=venue;
            content["date"]=date;
            content["opponentTeamName"]=oppTeam;
            content["result"]=result;
            content["runs"]=searchTool(cols[2]).text();
            content["balls"]=searchTool(cols[3]).text();
            content["fours"]=searchTool(cols[5]).text();
            content["sixes"]=searchTool(cols[6]).text();
            content["sr"]=searchTool(cols[7]).text();

            playerObj.addData(src,myTeam,searchTool(cols[0]).text().trim(),content);
            // let name = searchTool(cols[0]).text();
            // let runs = searchTool(cols[2]).text();
            // console.log(name + " " + runs);
        }
        // console.log(content);
    }
}

function getresult(html)
{
    let searchTool = cheerio.load(html); //search tool
    let resultElem = searchTool(".status-text");
    let result=searchTool(resultElem[resultElem.length-1]).text();
    return result;
}
//   console.log("After");
function getDescription(html)
{
    let searchTool = cheerio.load(html); //search tool
    let despElem = searchTool(".match-info.match-info-MATCH.match-info-MATCH-half-width>.description");
    let desp=despElem.text();
    return desp;
}