let fs = require("fs");
let path = require("path");
let types = {
    media: ["mp4", "mkv", "mp3"],
    archives: ['zip', '7z', 'rar', 'tar', 'gz', 'ar', 'iso', "xz"],
    documents: ['docx', 'doc', 'pdf', 'xlsx', 'xls', 'odt', 'ods', 'odp', 'odg', 'odf', 'txt', 'ps', 'tex'],
    app: ['exe', 'dmg', 'pkg', "deb"]
}

function copytodest(dirpath, destfolderPath) {
    let orginalName = path.basename(dirpath);
    let destFilePath = path.join(destfolderPath, orginalName);
    fs.copyFileSync(dirpath, destFilePath);
}

function isFilorNot(dirpath) {
    return fs.lstatSync(dirpath).isFile();
}
function getContent(dirpath) {
    return fs.readdirSync(dirpath);
}
function getFolderName(dirpath) {
    let strArr = dirpath.split(".");
    let ext = strArr.pop();
    for (let key in types) {
        for (let i = 0; i < types[key].length; i++) {
            if (types[key][i] == ext) {
                return key;
            }
        }
    }
    return "others";
}
function orgFiles(dirpath, organizedFilesPath) {
    let isFile = isFilorNot(dirpath);
    if (isFile == true) {
        let destFolderName = getFolderName(dirpath);
        console.log(dirpath, "-->", destFolderName);
        let destFolderPath = path.join(organizedFilesPath, destFolderName);
        copytodest(dirpath, destFolderPath);
    } else {
        let content = getContent(dirpath);
        for (let i = 0; i < content.length; i++) {
            let childPath = path.join(dirpath, content[i])
            orgFiles(childPath, organizedFilesPath);
        }
    }
}
function dirCreator(dirpath) {
    if (fs.existsSync(dirpath) == false) {
        fs.mkdirSync(dirpath);
    }
}
function organizeFn(toOrganizeDirPath) {
    
    let organizedFilesPath = path.join(toOrganizeDirPath, "organized_files");
    dirCreator(organizedFilesPath); 
    for (let key in types) {
        let innerDirPath = path.join(organizedFilesPath, key);
        dirCreator(innerDirPath);
    }
    let otherPath = path.join(organizedFilesPath, "others");
    dirCreator(otherPath);

    orgFiles(toOrganizeDirPath, organizedFilesPath);
}

module.exports = {
    fo: organizeFn
}