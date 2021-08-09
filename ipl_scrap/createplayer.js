let fs=require("fs");
let path=require("path");

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
            let playerFile=path.join(teamFolder,player+".json");
            if(fs.existsSync(playerFile))
            {
                let statsjson = fs.readFileSync(playerFile);
                let data=JSON.parse(statsjson);
                data.push(content);
                let writeAbleData=JSON.stringify(data);
                fs.writeFileSync(playerFile,writeAbleData);
            }
            else
            {   let input=[];
                input.push(content);
                let writeAbleData=JSON.stringify(input);
                fs.writeFileSync(playerFile,writeAbleData);
                console.log("created file: "+player+".json");
            }
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

module.exports = {
    addData: createPlayer
}