let treeObj=require("./command/tree");
let helpObj=require("./command/help");
let organizeObj=require("./command/organize");
let inputArr=process.argv.slice(2);
let choice=inputArr[0];
let filePath=inputArr[1];
if(choice=="tree")
{
    treeObj.ft(filePath);
}
else if(choice=="organize")
{
    organizeObj.fo(filePath);
}
else if(choice=="help"){
    helpObj.fxn();
}else{
    console.log("Wrong Input");
}