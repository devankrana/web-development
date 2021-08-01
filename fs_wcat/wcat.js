let fs=require("fs");
let path=require("path");
let inputArr=process.argv.slice(2);
let option=[];
let filesArr=[];
for(let i=0;i<inputArr.length;i++)
{
    let firstChar=inputArr[i].charAt(0);
    if(firstChar=="-")
    {
        option.push(inputArr[i]);
    }
    else
    {
        filesArr.push(inputArr[i]);
    }
}

for(let i=0;i<filesArr.length;i++)
{
    let ans=fs.existsSync(filesArr[i]);
    if(ans==false)
    {
        console.log("File doesnt exist");
        return;
    }
}
let content="";

for(let i=0;i<filesArr.length;i++)
    {   
        content=content+fs.readFileSync(filesArr[i])+"\n";
    }
    // console.log(content);
    // node wcat.js -s "C:\Users\user\Desktop\git tut\fs_wcat\test_files\f1.txt"
    if(option.length==0)
    {
        console.log(content);
        return;
    }

    let ans= content.split("\n");
    let isSpresent=option.includes("-s");
    if(isSpresent)
{   let tempArr=[];
    for(let i=0;i<ans.length-1;i++)
    {
        if(ans[i]!="\r")
        { 
            console.log(ans[i]);
            console.log("");
            tempArr.push(ans[i]);
            tempArr.push("");
        }
    }
    // console.log(tempArr);
    ans=tempArr;
}
let isNfirst=false;
if(option.includes("-n") && option.includes("-b"))
{
    if(option.indexOf("-n")<option.indexOf("-b"))
    {
        isNfirst=true;
    }
}
else{
    if(option.includes("-n"))
    isNfirst=true;
}

if(isNfirst)
{
    for(let i=0;i<ans.length;i++)
    {
        //if(ans[i]!="\r")
        console.log(i+1,ans[i]);
    }
}
else if(option.includes("-b"))
{   let num=1;
    for(let i=0;i<ans.length-1;i++)
    {
        if(ans[i]!="")
        {
            console.log(num,ans[i]);
            num++;
        }
    }
}


    