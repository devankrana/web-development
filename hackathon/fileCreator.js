let fs=require("fs");
let path=require("path");
let xlsx = require("xlsx");

function createFolder(folderPath)
{
    fs.mkdirSync(folderPath);
    let folderName=path.basename(folderPath);
    console.log("Created Folder: ",folderName);
}

function createList(src,website,item,content)
{
    let folderPath=path.join(src,"searched_products");
    if(fs.existsSync(folderPath))
    {
        let itemFolder=path.join(folderPath,item);
        if(fs.existsSync(itemFolder))
        {   
            let webFile=path.join(itemFolder,website+".xlsx");
            itemArray=[];
            if(fs.existsSync(webFile))
            {   

                //---------for creating excel files----------
                itemArray = excelReader(webFile, website);
                itemArray.push(content);
            }
            else
            {   
                itemArray.push(content);
                console.log("created file: "+website+".xlsx for "+item);
            }
            excelWriter(webFile, itemArray, website);
        }
        else{
            createFolder(itemFolder);
            createList(src,website,item,content)
        }
    }
    else{
        createFolder(folderPath);
        createList(src,website,item,content)
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
    addData: createList
}