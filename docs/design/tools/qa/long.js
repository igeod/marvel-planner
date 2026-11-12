const { chromium } = require('playwright'); const fs=require('fs'); const path=require('path');
const src=fs.readFileSync(path.join(__dirname,'shot4.js'),'utf8');
