__path = process.cwd();

require("../settings.js");
var express = require("express");
var axios = require("axios");
var qs = require("qs");
var fetch = require("node-fetch");
var cheerio = require("cheerio");
var request = require("request");
var fs = require("fs");
var dns = require('dns');
var ipRange = require('ip-range-check');
var router = express.Router();
var creator = global.creator;
const listkey = global.apikey;

const path = require('path');
const os = require('os');
const { performance } = require('perf_hooks');
const crypto = require('crypto');
const FormData = require('form-data');

const { color, bgcolor } = require(__path + "/lib/color.js");
const { fetchJson } = require(__path + "/lib/fetcher.js");
const options = require(__path + "/lib/options.js");
const { getBuffer } = require(__path + "/lib/functions.js");

const ipFilePath = require(__path + '/lib/ip.js');

_ = require("lodash");

var len = 15;
var arr = "123456789abcdefghijklmnopqrstuvwxyz";
var random = "";

for (var i = len; i > 0; i--) {
random += arr[Math.floor(Math.random() * arr.length)];
}

var lenn = 5;
var randomlagi = "";

for (var i = lenn; i > 0; i--) {
randomlagi += arr[Math.floor(Math.random() * arr.length)];
}

var randomTextNumber =
random + randomlagi + "---------Apriliya-Putri-Fatmawati" + "LOLI--KILLERS";

function muptime(seconds) {
const pad = (s) => (s < 10 ? '0' : '') + s;
const hours = Math.floor(seconds / 3600);
const minutes = Math.floor((seconds % 3600) / 60);
const sec = Math.floor(seconds % 60);
return `${pad(hours)}:${pad(minutes)}:${pad(sec)}`;
}

/** @note
 * Liat cara nulis code yang bener
 */

//===============[ Info Server ]===============\\
router.get('/status', async (req, res) => {
try {
const date = new Date();
const hours = date.getHours();
const minutes = date.getMinutes();
const seconds = date.getSeconds();
const start = performance.now();
const end = performance.now();
const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
const totalMemory = (os.totalmem() / 1024 / 1024).toFixed(2);
const cpu = os.cpus()[0].model;
const port = process.env.PORT || 8080;
const ipResponse = await fetch('https://api.ipify.org/?format=json');
const ipData = await ipResponse.json();

const status = {
status: 'online',
memory: `${memoryUsage} MB / ${totalMemory} MB`,
cpu: cpu,
port: port,
ip: ipData.ip,
time: `${hours} : ${minutes} : ${seconds}`,
uptime: muptime(process.uptime()),
speed: `${(end - start).toFixed(2)} ms`,
};

res.json(status);
} catch (error) {
console.error(error);
res.json(`${error.message}`);
}
});

//========================================\\
// Validasi ip

router.get("/validasi/add-ip", async (req, res) => {
const apikey = req.query.apikey;
const ip = req.query.ip;

if (!apikey) return res.json(loghandler.noapikey);
if (!ip) {
return res.json({
status: false,
creator: `${global.creator}`,
message: "Masukkan IP yang ingin ditambahkan.",
});
}

let ips = [];
if (fs.existsSync(ipFilePath)) {
ips = JSON.parse(fs.readFileSync(ipFilePath, 'utf8'));
}

if (ips.includes(ip)) {
return res.json({
status: false,
message: "IP sudah ada.",
});
}

ips.push(ip);
fs.writeFileSync(ipFilePath, JSON.stringify(ips));

return res.json({
status: true,
message: "IP berhasil ditambahkan.",
});
});

// Endpoint untuk menghapus IP
router.get("/validasi/delete-ip", async (req, res) => {
const apikey = req.query.apikey;
const ip = req.query.ip;

if (!apikey) return res.json(loghandler.noapikey);
if (!ip) {
return res.json({
status: false,
creator: `${global.creator}`,
message: "Masukkan IP yang ingin dihapus.",
});
}

let ips = [];
if (fs.existsSync(ipFilePath)) {
ips = JSON.parse(fs.readFileSync(ipFilePath, 'utf8'));
}

const index = ips.indexOf(ip);
if (index === -1) {
return res.json({
status: false,
message: "IP tidak ditemukan.",
});
}

ips.splice(index, 1);
fs.writeFileSync(ipFilePath, JSON.stringify(ips));

return res.json({
status: true,
message: "IP berhasil dihapus.",
});
});

// Endpoint untuk mencantumkan IP
router.get("/validasi/list-ip", async (req, res) => {
const apikey = req.query.apikey;
if (!apikey) return res.json(loghandler.noapikey);

let ips = [];
if (fs.existsSync(ipFilePath)) {
ips = JSON.parse(fs.readFileSync(ipFilePath, 'utf8'));
}

return res.json({
status: true,
ips: ips,
});
});

//========================================\\
// Gpt

router.get("/ai/simi", async (req, res, next) => {
var apikey = req.query.apikey;
var query = req.query.query;
if (!apikey) return res.json(loghandler.noapikey);
if (!query)
return res.json({
status: false,
creator: `${global.creator}`,
message: "Masukkan Teks Nya",
});
if (listkey.includes(apikey)) {
try {
const simi = async (query) => {
const url = 'https://simsimi.vn/web/simtalk';
const headers = {
'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
Accept: 'application/json, text/javascript, */*; q=0.01',
'X-Requested-With': 'XMLHttpRequest',
'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36',
Referer: 'https://simsimi.vn/'
};
const response = await axios.post(url, `text=${encodeURIComponent(query)}&lc=id`, { headers });
return response.data.success;
}
const hasil_nya = await simi(query);
res.json({
status: true,
creator: `${global.creator}`,
result: hasil_nya,
});
} catch (e) {
console.log(e);
res.json({ status: false, message: e.message });
}
} else {
res.json(loghandler.apikey);
}
});

router.get("/ai-chat", async (req, res, next) => {
const { chat } = require('../scraper/ai/blackbox')
var q = req.query.q;
const response = await chat(q);
return res.json({
status: true,
creator: `${global.creator}`,
result: response,
})
});

router.get("/ai-image", async (req, res, next) => {
const { image } = require('../scraper/ai/blackbox')
var q = req.query.q;
const response = await image(q);
return res.json({
status: true,
creator: `${global.creator}`,
result: response,
})
});

router.get("/ai-bing-img", async (req, res, next) => {
const { BingImage } = require('../scraper/ai/blackbox')
var q = req.query.q;
const response = await BingImage(q);
return res.json({
status: true,
creator: `${global.creator}`,
result: response,
})
});

//=========[ Versi Post ]=========//

router.post("/ai-chat2", async (req, res, next) => {
const { chat } = require('../scraper/ai/blackbox')
var prompt = req.query.prompt;
var q = req.query.q;

const response = await chat(prompt,q);
return res.json({
status: true,
creator: `${global.creator}`,
result: response,
})
});

router.post("/ai-image2", async (req, res, next) => {
const { image } = require('../scraper/ai/blackbox')
var q = req.query.q;
const response = await image(q);
return res.json({
status: true,
creator: `${global.creator}`,
result: response,
})
});

router.post("/ai-bing-img2", async (req, res, next) => {
const { BingImage } = require('../scraper/ai/blackbox')
var q = req.query.q;
const response = await BingImage(q);
return res.json({
status: true,
creator: `${global.creator}`,
result: response,
})
});

//==================//

// Versi Pakai Url
router.get("/ai-upload", async (req, res, next) => {
var url = req.query.url;
var q = req.query.q;

// Headers untuk permintaan ke API
const headers = {
"Accept-Language": "id-ID,en;q=0.5",
"Referer": "https://api.blackbox.ai/",
"Content-Type": "application/json",
"Origin": "https://api.blackbox.ai/",
"User-Agent": "api.blackbox.ai"
};

// Mengambil gambar dari URL
const filePath = path.join(`${Date.now()}.jpg`);
try {
const response = await fetch(url);
if (!response.ok) {
return res.json({ error: 'Error fetching image from URL.' });
}
const buffer = await response.buffer();
await fs.promises.writeFile(filePath, buffer);

const imageBase64 = await fs.promises.readFile(filePath, { encoding: 'base64' });

const data = {
messages: [{ 
id: m.sender, 
content: `FILE:BB${response}, ${text}`, 
data: { 
fileText: `${response}`,
imageBase64: `data:image/jpeg;base64,${imageBase64}`, 
title: 'undefined.jpg', 
}, 
id: m.sender, 
role: 'user'
}],
userId: "",
previewToken: null,
codeModelMode: true,
agentMode: {},
trendingAgentMode: {},
isMicMode: false,
maxTokens: 1024,
webSearchMode: false,
promptUrls: "",
isChromeExt: false,
githubToken: null
};

const blackboxResponse = await fetch('https://api.blackbox.ai/api/chat', {
method: "POST",
headers,
body: JSON.stringify(data)
});

const blackboxData = await blackboxResponse.text();
return res.json({
status: true,
creator: `${global.creator}`,
result: blackboxData,
});
} catch (error) {
console.error('Error fetching data:', error);
res.json({ error: error.message });
}
});

// Versi pakai url v2
router.get("/ai-upload2", async (req, res, next) => {
var url = req.query.url;
var q = req.query.q;

// Headers for the API request
const headers = {
"Accept": "*/*",
"Accept-Language": "id-ID,en;q=0.5",
"Referer": "https://api.blackbox.ai/",
"Content-Type": "application/json",
"Origin": "https://api.blackbox.ai",
"Alt-Used": "api.blackbox.ai"
};

// Fetch image from the provided URL
const filePath = path.join(`${Date.now()}.jpg`);
try {
const response = await fetch(url);
if (!response.ok) {
return res.json({ error: 'Error fetching image from URL.' });
}

// Save the image buffer to a file
const buffer = await response.buffer();
await fs.promises.writeFile(filePath, buffer);

// Read the image file as base64
const imageBase64 = await fs.promises.readFile(filePath, { encoding: 'base64' });

// Prepare the form data for image upload
let BodyForm = require('form-data');
const form = new BodyForm();
form.append('image', fs.createReadStream(filePath));
form.append('fileName', 'undefined.jpg');
form.append('userId', '');

const uploadHeaders = {
...form.getHeaders(),
'Accept': '*/*',
'Accept-Language': 'id-ID,en;q=0.5',
'Referer': 'https://api.blackbox.ai',
'Origin': 'https://api.blackbox.ai',
};

// Upload image to blackbox.ai
const blackboxUploadResponse = await fetch("https://api.blackbox.ai/api/upload", {
method: "POST",
headers: uploadHeaders,
body: form
});

const uploadStatus = blackboxUploadResponse.status;
const uploadResponseData = await blackboxUploadResponse.json();
const responseText = uploadResponseData.response || 'No response key found';

console.log(responseText);
console.log(imageBase64);

const data = {
messages: [{ 
id: "", 
content: `FILE:BB${responseText}, ${q}`, 
data: { 
fileText: `${responseText}`,
imageBase64: `data:image/jpeg;base64,${imageBase64}`, 
title: 'undefined.jpg', 
}, 
role: 'user'
}],
userId: "",
previewToken: null,
codeModelMode: true,
agentMode: {},
trendingAgentMode: {},
isMicMode: false,
maxTokens: 1024,
webSearchMode: false,
promptUrls: "",
isChromeExt: false,
githubToken: null
};

// Send chat request to blackbox.ai
const blackboxResponse = await fetch('https://api.blackbox.ai/api/chat', {
method: "POST",
headers,
body: JSON.stringify(data)
});

const blackboxData = await blackboxResponse.text();
return res.json({
status: true,
creator: `${global.creator}`,
result: blackboxData,
});

} catch (error) {
console.error('Error fetching data:', error);
res.json({ error: error.message });
}
});

// Versi pakai base64
router.get("/ai-upload3", async (req, res, next) => {
var bass64 = req.query.base64;
if (!image) return res.json('Base64 nya mana?')
var query = req.query.q;
if (!query) return res.json('Query nya mana?')
try {
const form = new BodyForm();
form.append('image', base64); 
form.append('fileName', 'undefined.jpg');
form.append('userId', '');

const uploadHeaders = {
...form.getHeaders(),
'Accept': '*/*',
'Accept-Language': 'id-ID,en;q=0.5',
'Referer': 'https://api.blackbox.ai',
'Origin': 'https://api.blackbox.ai',
};

const blackboxUploadResponse = await fetch("https://api.blackbox.ai/api/upload", {
method: "POST",
headers: uploadHeaders,
body: form
});

const uploadResponseData = await blackboxUploadResponse.json();
const response = uploadResponseData.response || 'No response key found';
const imageBase64 = base64; 

const data = {
messages: [{ 
id: '',
content: `FILE:BB${response}, ${query}`, 
data: { 
fileText: `${response}`,
imageBase64: `data:image/jpeg;base64,${imageBase64}`, 
title: 'undefined.jpg', 
}, 
role: 'user'
}],
userId: "",
previewToken: null,
codeModelMode: true,
agentMode: {},
trendingAgentMode: {},
isMicMode: false,
maxTokens: 1024,
webSearchMode: false,
promptUrls: "",
isChromeExt: false,
githubToken: null
};

const blackboxResponse = await fetch('https://api.blackbox.ai/api/chat', {
method: "POST",
headers: {
'Content-Type': 'application/json'
},
body: JSON.stringify(data)
});

let blackboxData = await blackboxResponse.text();
blackboxData = blackboxData.replace(/\$\@.*?\$\@|\*\*|\$/g, '');

return res.json({
status: true,
creator: `${global.creator}`,
result: blackboxData
});

} catch (error) {
console.error('Error fetching data:', error);
return res.json({ 
status: false, 
message: `Error: ${error.message}` });
}
});

// Versi Pakai Buffer
router.get("/ai-upload4", async (req, res, next) => {
const imageBuffer = req.query.imageBuffer;
const query = req.query.q;

if (!imageBuffer) return res.json('Buffer gambar mana?');
if (!query) return res.json('Query mana?');

let imgName = `${Date.now()}.jpg`
try {
// Mengonversi buffer dari string ke Buffer
const buffer = Buffer.from(imageBuffer, 'base64');
const filePath = path.join(`${imgName}`);

// Menyimpan buffer ke file
fs.writeFileSync(filePath, buffer);

const form = new BodyForm();
form.append('image', fs.createReadStream(filePath));
form.append('fileName', `${imgName}`); 
form.append('userId', '');

const uploadHeaders = {
...form.getHeaders(),
'Accept': '*/*',
'Accept-Language': 'id-ID,en;q=0.5',
'Referer': 'https://api.blackbox.ai',
'Origin': 'https://api.blackbox.ai',
};

const blackboxUploadResponse = await fetch("https://api.blackbox.ai/api/upload", {
method: "POST",
headers: uploadHeaders,
body: form
});

const uploadResponseData = await blackboxUploadResponse.json();
const response = uploadResponseData.response || 'No response key found';

// Membaca file dan mengonversi ke Base64
const base64Image = fs.readFileSync(filePath, { encoding: 'base64' });

const data = {
messages: [{ 
id: '',
content: `FILE:BB${response}, ${query}`, 
data: { 
fileText: `${response}`,
imageBase64: `data:image/jpeg;base64,${base64Image}`, 
title: 'image.jpg', 
}, 
role: 'user'
}],
userId: "",
previewToken: null,
codeModelMode: true,
agentMode: {},
trendingAgentMode: {},
isMicMode: false,
maxTokens: 1024,
webSearchMode: false,
promptUrls: "",
isChromeExt: false,
githubToken: null
};

const blackboxResponse = await fetch('https://api.blackbox.ai/api/chat', {
method: "POST",
headers: {
'Content-Type': 'application/json'
},
body: JSON.stringify(data)
});

let blackboxData = await blackboxResponse.text();
blackboxData = blackboxData.replace(/\$\@.*?\$\@|\*\*|\$/g, '');

return res.json({
status: true,
creator: `${global.creator}`,
result: blackboxData
});

} catch (error) {
console.error('Error fetching data:', error);
return res.json({ 
status: false, 
message: `Error: ${error.message}` 
});
}
});

// Versi Pakai Post + New
router.post("/ai-upload5", async (req, res, next) => {
try {
const id = crypto.randomUUID();
const userId = crypto.randomBytes(8).toString('hex');

const imageBuffer = req.files?.image?.data; 
const inputText = req.body?.text || "Default Text";

if (!imageBuffer) {
return res.status(400).json({ error: "Image is required" });
}

const { ext, mime } = (await fileTypeFromBuffer(imageBuffer)) || {};
if (!ext || !mime) {
return res.status(400).json({ error: "Invalid file type" });
}

// Upload the image
const form = new FormData();
const blob = new Blob([imageBuffer], { type: mime });
form.append('image', blob, `image.${ext}`);
form.append('fileName', `image.${ext}`);
form.append('userId', userId);

const uploadResponse = await fetch("https://api.blackbox.ai/api/upload", {
method: 'POST',
body: form,
});
const uploadData = await uploadResponse.json();

if (!uploadResponse.ok) {
throw new Error("Image upload failed");
}

// Prepare JSON for chat
const chatJson = {
messages: [{
id,
content: inputText,
role: "user",
data: {
imageBase64: uploadData.response,
fileText: inputText
}
}],
id,
previewToken: null,
userId,
codeModelMode: true,
agentMode: { mode: true, id: "tioYvlHC5x", name: "tio" },
trendingAgentMode: {},
isMicMode: false,
isChromeExt: false,
githubToken: null
};

const { data } = await axios.post('https://api.blackbox.ai/api/chat', chatJson);

res.json({ chatResponse: data });
} catch (error) {
console.error("Error:", error);
res.status(500).json({ error: error.message });
}
});

router.get("/ai/gpt4", async (req, res, next) => {
const gpt4 = require('../scraper/ai/gpt4.js')
var apikey = req.query.apikey;
var text = req.query.text;

if (!apikey) return res.json(loghandler.noapikey);
if (!text)
return res.json({
status: false,
creator: `${global.creator}`,
message: "Masukkan Teks Nya",
});

if (listkey.includes(apikey)) {
try {
const hasil_nya = await gpt4(text);
const ress = {
model: `${hasil_nya.model}`,
gpt: `${hasil_nya.gpt}`
}
res.json({
status: true,
creator: `${global.creator}`,
result: ress,
});
} catch (e) {
console.log(e);
res.json(loghandler.error);
}
} else {
res.json(loghandler.apikey);
}
});

router.get("/ai/gpt-3turbo", async (req, res, next) => {
const gpt3 = require('../scraper/ai/gpt-3-5.js')
var apikey = req.query.apikey;
var text = req.query.text;

if (!apikey) return res.json(loghandler.noapikey);
if (!text)
return res.json({
status: false,
creator: `${global.creator}`,
message: "Masukkan Teks Nya",
});

if (listkey.includes(apikey)) {
try {
const hasil_nya = await gpt3(text);
const ress = {
model: `${hasil_nya.model}`,
gpt: `${hasil_nya.gpt}`
}
res.json({
status: true,
creator: `${global.creator}`,
result: ress,
});
} catch (e) {
console.log(e);
res.json(loghandler.error);
}
} else {
res.json(loghandler.apikey);
}
});

router.get("/ai/bard", async (req, res) => {
const apikey = req.query.apikey;
const text = req.query.q;

if (!apikey) {
return res.json(loghandler.noapikey);
}
if (!text) {
return res.json({
status: false,
creator: "RizzPiw",
message: "Masukkan Query Nya",
});
}

if (listkey.includes(apikey)) {
try {
const results = await GoogleBard(text);
res.json({
status: true,
creator: "RizzPiw",
result: results,
});
} catch (e) {
console.error(e);
res.json(`${e.message}`);
}
} else {
res.json(loghandler.apikey);
}
});

router.get("/ai/bingimg", async (req, res, next) => {
var apikey = req.query.apikey;
var text = req.query.q;

if (!apikey) return res.json(loghandler.noapikey);
if (!text) return res.json({
status: false,
creator: 'RizzPiw',
message: "Masukkan parameter query",
});

if (listkey.includes(apikey)) {
try {
const result = await bingimg(text);
res.json({
status: true,
creator: "RizzPiw",
result,
});
} catch (e) {
console.log(e);
res.json(loghandler.error);
}
} else {
res.json(loghandler.apikey);
}
});

// Tools
router.get("/tools/subfinder", async (req, res, next) => {
const subfinder = require('../scraper/tools/subfinder')
var apikey = req.query.apikey;
var q = req.query.q;

if (!apikey) return res.json(loghandler.noapikey);
if (!q)
return res.json({
status: false,
creator: 'RizzPiw',
message: "Masukkan parameter q",
});

if (listkey.includes(apikey)) {
try {
const result = await subfinder(q);
res.json({
author: "RizzPiw",
result,
});
} catch (e) {
console.log(e);
res.json(`${e.message}`);
}
} else {
res.json(loghandler.apikey);
}
});

router.get("/tools/whois", async (req, res, next) => {
var apikey = req.query.apikey;
var text = req.query.domain;

if (!apikey) return res.json(loghandler.noapikey);
if (!text) return res.json({
status: false,
creator: 'RizzPiw',
message: "Masukkan parameter domain",
});

if (listkey.includes(apikey)) {
try {
const result = await whois(text);
res.json({
status: true,
creator: "RizzPiw",
result: result,
});
} catch (e) {
console.log(e);
res.json(loghandler.error);
}
} else {
res.json(loghandler.apikey);
}
});

