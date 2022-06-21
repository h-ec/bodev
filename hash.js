const fs = require("fs");
const path = require("path");

function muid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

let bcknd;
let styles;
let styleName;

fs.readFile(path.join(__dirname + "/src/backend/backend.js"), (err, data) => {
    if(err) return console.error("Couldn't find the entered file! Make sure you have specified the correct path for the file!");
    else {
        bcknd = muid(6);
        styles = muid(8);
        styleName = muid(12);
        var fileData = data.toString();
        var fdr = fileData.replace(`// fun 1`, `function h(){return 'head';}`);
        var fdr2 = fdr.replace(`\`<link rel="stylesheet" href="../../backend/styles/\${css_path}">\``, `\`<link rel="stylesheet" href="${styles}/\${css_path}">\``);
        var fdr3 = fdr2.replace(`document.querySelector(h()).innerHTML += htmlLinkCss("style.css");`, `document.querySelector(h()).innerHTML += htmlLinkCss("${styles}/${styleName}.css");`)
        var ffData = fdr3.replace(`"head"`, `h()`);
        fs.access("./hashed", function(error) {
            if (error) 
            {
                fs.mkdir("hashed", (data, err) => {if(err) return console.error(err);});
            } 
            else 
            {
                fs.rmdir("./hashed/", {force:true}, () => {console.log("Deleted OLD_HASHED"); fs.mkdir("hashed", (data, err) => {if(err) return console.error(err);});});
                fs.appendFile("hashed/" + bcknd + ".js", ffData, (data, err) => {if(err) return console.error(err);});
            }
        })
    }
});

fs.readFile(path.join(__dirname + "/src/frontend/views/index.html"), (err, data) => {
    if(err) return console.error("Couldn't find the entered file! Make sure you have specified the correct path for the file!");
    else {
        var fileData = data.toString();
        // 
        var fdr = fileData.replace(`<script src="../../backend/backend.js" defer></script> <!-- Backend css linker -->`, `RPLACE_HOLDER`);
        var ffData = fdr.replace(`RPLACE_HOLDER`, `<script src="${bcknd}.js" defer></script> <!-- Backend css linker -->`);
        fs.mkdir("hashed", (data, err) => {if(err) return console.error(err);});
        fs.appendFile("hashed/" + "index.html", ffData, (data, err) => {if(err) return console.error(err);});
    }
});

fs.readFile(path.join(__dirname + "/src/backend/styles/style.css"), (err, data) => {
    if(err) return console.error("Couldn't find the entered file! Make sure you have specified the correct path for the file!");
    else {
        var fileData = data.toString();
        fs.mkdir(`./hashed/${styles}/`, {force:true}, () => {if(err) console.log(err);});
        fs.appendFile(`hashed/${styles}/${styleName}.css`, fileData, (data, err) => {if(err) return console.error(err);});
    }
});