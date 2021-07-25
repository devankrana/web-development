let fs=require("fs");
let path=require("path");

function fn(src){
    // let pathtree=process.cwd();
    // console.log("tree command executed with path "+src);
    let arrFiles=fs.readdirSync(src);
    for(let i=0;i<arrFiles.length;i++)
    {
        console.log("-->"+arrFiles[i]);
    }
}
module.exports={
    ft:fn
}