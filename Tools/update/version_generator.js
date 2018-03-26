var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var child_process = require('child_process');
var util = require('util');

debug = process.argv[2];
let projectFilename;
let versionFilename;
let baseUrl;
// if(debug){
    projectFilename = "debug_project.manifest";
    versionFilename = "debug_version.manifest";
    baseUrl = "http://192.168.22.112:8081";
// }else if(debug == "false"){
    projectFilename = "release_project.manifest";
    versionFilename = "release_version.manifest";
    baseUrl = "http://chess-client.oss-cn-beijing.aliyuncs.com/hotupdate";
//}
var manifest = {
    packageUrl: baseUrl + '/all/',
    remoteManifestUrl: baseUrl + '/all/res/raw-assets/resources/res/config/' + projectFilename,
    remoteVersionUrl: baseUrl + '/all/res/raw-assets/resources/res/config/' + versionFilename,
    version: String(new Date().getTime()),
    assets: {},
    searchPaths: ["update"]
};

// var dest = '/Users/jenkins/.jenkins/workspace/server/all/';
// var src = '/Users/jenkins/.jenkins/workspace/DDZ_Android/build/jsb-default/';

var dest = "/Users/baizhanxiao/Documents/server/all/";
var src = "/Users/baizhanxiao/Documents/workspace/Hall/build/jsb-default/";

// Parse arguments
var i = 2;
var project;
while ( i < process.argv.length) {
    var arg = process.argv[i];

    switch (arg) {
    case '-p':
        project = process.argv[i+1];
        i += 2;
        break;
    case '--url' :
    case '-u' :
        var url = process.argv[i+1];
        manifest.packageUrl = url;
        manifest.remoteManifestUrl = url + projectFilename;
        manifest.remoteVersionUrl = url + versionFilename;
        i += 2;
        break;
    case '--version' :
    case '-v' :
        manifest.version = process.argv[i+1];
        i += 2;
        break;
    case '--src' :
    case '-s' :
        src = process.argv[i+1];
        i += 2;
        break;
    case '--dest' :
    case '-d' :
        dest = process.argv[i+1];
        i += 2;
        break;
    default :
        i++;
        break;
    }
}


function readDir (dir, obj) {
    var stat = fs.statSync(dir);
    if (!stat.isDirectory()) {
        return;
    }
    var subpaths = fs.readdirSync(dir), subpath, size, md5, compressed, relative;
    for (var i = 0; i < subpaths.length; ++i) {
        if (subpaths[i][0] === '.') {
            continue;
        }
        subpath = path.join(dir, subpaths[i]);
        stat = fs.statSync(subpath);
        if (stat.isDirectory()) {
            readDir(subpath, obj);
        }
        else if (stat.isFile()) {
            // Size in Bytes
            size = stat['size'];
            md5 = crypto.createHash('md5').update(fs.readFileSync(subpath, 'binary')).digest('hex');
            compressed = path.extname(subpath).toLowerCase() === '.zip';

            relative = path.relative(src, subpath);
            relative = relative.replace(/\\/g, '/');
            relative = encodeURI(relative);
            obj[relative] = {
                'size' : size,
                'md5' : md5
            };
            if (compressed) {
                obj[relative].compressed = true;
            }
        }
    }
}

var mkdirSync = function (path) {
    try {
        fs.mkdirSync(path);
    } catch(e) {
        if ( e.code != 'EEXIST' ) throw e;
    }
}

// Iterate res and src folder
readDir(path.join(src, 'src'), manifest.assets);
readDir(path.join(src, 'res'), manifest.assets);

var destManifest = path.join(util.format("%sres/raw-assets/resources/res/config", src), projectFilename);
var destVersion = path.join(util.format("%sres/raw-assets/resources/res/config", src), versionFilename);

mkdirSync(dest);

fs.writeFileSync(destManifest, JSON.stringify(manifest), (err) => {
  if (err) throw err;
  console.log('Manifest successfully generated');
});

delete manifest.assets;
delete manifest.searchPaths;
fs.writeFileSync(destVersion, JSON.stringify(manifest), (err) => {
  if (err) throw err;
  console.log('Version successfully generated');
});
child_process.execSync(util.format("rm -rf %ssrc", dest));
child_process.execSync(util.format("rm -rf %sres", dest));
console.log(util.format("cp -R %ssrc %s", src, dest));
child_process.execSync(util.format("cp -R %ssrc %s", src, dest));
console.log(util.format("cp -R %sres %s", src, dest));
child_process.execSync(util.format("cp -R %sres %s", src, dest));
child_process.execSync(util.format("cp %sres/raw-assets/resources/res/config/%s %s%s", src, projectFilename, dest, projectFilename));
child_process.execSync(util.format("cp %sres/raw-assets/resources/res/config/%s %s%s", src, versionFilename, dest, versionFilename));
if(project){
    child_process.execSync(util.format("cp %sres/raw-assets/resources/res/config/%s %s/assets/resources/res/config/%s", src, projectFilename, project, projectFilename));
    child_process.execSync(util.format("cp %sres/raw-assets/resources/res/config/%s %s/assets/resources/res/config/%s", src, versionFilename, project, versionFilename));
}