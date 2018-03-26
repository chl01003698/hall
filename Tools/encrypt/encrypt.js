let fs = require('fs');
let path = require('path');
var child_process = require('child_process');
var util = require('util');

let src = "/Users/baizhanxiao/Documents/workspace/Hall/build/jsb-default";
let dest = "/Users/baizhanxiao/Documents/workspace/Hall/build/jsb-default_en";

let files = ["res", "src", "mymain"];
let tag = "369huyu";
function isEncryptFilename(pathname) {
  for (let i in files) {
    let file = files[i];
    if (pathname.startsWith(src + "/" + file)) {
      return true;
    }
  }
}
child_process.execSync(util.format("rm -rf %s", dest));
fs.mkdirSync(dest);
function travel(dir, callback) {
  fs.readdirSync(dir).forEach(function (file) {
    let pathname = path.join(dir, file);
    if (fs.statSync(pathname).isDirectory()) {
      if (isEncryptFilename(pathname)) {
        let enPathname = pathname.replace(src, dest);
        fs.mkdirSync(enPathname);
        travel(pathname, callback);
      }
    } else {
      if (isEncryptFilename(pathname)) {
        callback(pathname);
      }
    }
  });
}
travel(src, function (pathname) {
  console.log(pathname);
  let destPathname = pathname.replace(src, dest);
  let buffer = fs.readFileSync(pathname);
  let key;
  let isBin = false;
  if (isBin) {
    let keyEn = buffer[buffer.length - 1];
    // keyEn = new Buffer(keyEn);
    keyEn ^= (buffer.length - 1) % 255;
    let key = keyEn;
    // if(destPathname.endsWith("main.js")){
    //   console.log(buffer.subarray(buffer.length - 2, buffer.length).toString());
    //   console.log("tag=", key);
    // }
    for (let i = 0; i < buffer.length - 1; ++i) {
      let b = buffer[i];
      b ^= (key + i)% 255;
      buffer[i] = b;
    }
    buffer[buffer.length - 1] = 0;
    fs.writeFileSync(destPathname, buffer.subarray(0, buffer.length));
  } else {
    key = 0;
    while(key <= 0){
      key = Math.floor(Math.random() * 255);
    }
    for (let i = 0; i < buffer.length; ++i) {
      let b = buffer[i];
      b ^= (key + i)%255;
      buffer[i] = b;
    }
    let tagBuffer = new Buffer(tag);
    for (let i = 0; i < tagBuffer.length; ++i) {
      let b = tagBuffer[i];
      b ^= (key + i)%255;
      tagBuffer[i] = b;
    }
    //let key2 = new Buffer(String(key));
    key ^= buffer.length % 255;
    fs.writeFileSync(destPathname, buffer);
    fs.appendFileSync(destPathname, new Buffer([key]));
    fs.appendFileSync(destPathname, tagBuffer);
  }
});

// function geFileList(path) {  
//     var filesList = [];  
//     readFile(path, filesList);  
//     return filesList;  
// }  

// function readFile(path, filesList) {  
//     files = fs.readdirSync(path);  
//     files.forEach(walk);  
//     function walk(file) {  
//         states = fs.statSync(path + '/' + file);  
//         if (states.isDirectory()) {  
//             readFile(path + '/' + file, filesList);  
//         }  
//         else {  
//             var obj = new Object();  
//             obj.size = states.size;  
//             obj.name = file;  
//             obj.path = path + '/' + file;  
//             filesList.push(obj);  
//         }  
//     }  
// }  

// var getFileName = function (path) {  
//     var pathList = path.split("/");  
//     var fileName = pathList[pathList.length - 1];  
//     return fileName;  
// };  


// var getFileContent = function (filePath, cb) {  
//     fs.readFile(filePath, function (err, buf) {  
//         cb(err, buf);  
//     });  
// };  

// var writeFileSync = function (filePath, text) {  
//     fs.writeFileSync(filePath, text);  
// };  

// var writeFileAsync = function (filePath, text, cb) {  
//     fs.writeFile(filePath, text, function (err) {  
//         cb(err);  
//     });  
// };  