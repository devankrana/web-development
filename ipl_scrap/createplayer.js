let fs=require("fs");
let path=require("path");
let xlsx = require("xlsx");

function createFolder(folderPath)
{
    fs.mkdirSync(folderPath);
    let folderName=path.basename(folderPath);
    console.log("Created Folder: ",folderName);
}

function createPlayer(src,team,player,content)
{
    let folderPath=path.join(src,"ipl");
    if(fs.existsSync(folderPath))
    {
        let teamFolder=path.join(folderPath,team);
        if(fs.existsSync(teamFolder))
        {   
            let playerFile=path.join(teamFolder,player+".xlsx");
            playerArray=[];
            if(fs.existsSync(playerFile))
            {   
                //-------for creating json files----------- 
                // let statsjson = fs.readFileSync(playerFile);
                // let data=JSON.parse(statsjson);
                // data.push(content);
                // let writeAbleData=JSON.stringify(data);
                // fs.writeFileSync(playerFile,writeAbleData);

                //---------for creating excel files----------
                playerArray = excelReader(playerFile, player);
                playerArray.push(content);
            }
            else
            {   //-------for creating json files-----------
                // let input=[];
                // input.push(content);
                // let writeAbleData=JSON.stringify(input);
                // fs.writeFileSync(playerFile,writeAbleData);
                playerArray.push(content);
                console.log("created file: "+player+".xlsx");
            }
            excelWriter(playerFile, playerArray, player);
        }
        else{
            createFolder(teamFolder);
            createPlayer(src,team,player,content);
        }
    }
    else{
        createFolder(folderPath);
        createPlayer(src,team,player,content);
    }
}

function excelWriter(filePath, json, sheetName) {
    // workbook create
    let newWB = xlsx.utils.book_new();
    // worksheet
    let newWS = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
    // excel file create 
    xlsx.writeFile(newWB, filePath);
}
// // json data -> excel format convert
// // -> newwb , ws , sheet name
// // filePath
// read 
//  workbook get
function excelReader(filePath, sheetName) {
    // player workbook
    let wb = xlsx.readFile(filePath);
    // get data from a particular sheet in that wb
    let excelData = wb.Sheets[sheetName];
    // sheet to json 
    let ans = xlsx.utils.sheet_to_json(excelData);
    return ans;
}

module.exports = {
    addData: createPlayer
}