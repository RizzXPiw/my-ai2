__path = process.cwd();

require("../settings.js");
var express = require("express");
var axios = require("axios");
var qs = require("qs");
const os = require('os');
var fetch = require("node-fetch");
var cheerio = require("cheerio");
var request = require("request");
var fs = require("fs");

var router = express.Router();
var creator = global.creator;
const listkey = global.apikey;

_ = require("lodash");

function muptime(seconds) {
const pad = (s) => (s < 10 ? '0' : '') + s;
const hours = Math.floor(seconds / 3600);
const minutes = Math.floor((seconds % 3600) / 60);
const sec = Math.floor(seconds % 60);
return `${pad(hours)}:${pad(minutes)}:${pad(sec)}`;
}

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
// Di Sini Ai Nya

let messageHistory = [];

router.get("/ai", async (req, res) => {
var apikey = req.query.apikey;
var query = req.query.query;
if (!apikey) return res.json(loghandler.noapikey);
if (!query) return res.json({
status: false,
creator: `${global.creator}`,
message: "Masukkan Teks Nya",
});

if (listkey.includes(apikey)) {
try {
if (messageHistory.length === 0 || messageHistory[0].role !== "assistant") {
const today = new Date();
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const hari = today.toLocaleDateString('id-ID', { weekday: 'long' });
const tanggal = today.toLocaleDateString('id-ID', options);
const jam = today.toLocaleTimeString('id-ID');

const assistantPrompt = {
role: "assistant",
content: `Halo, Nama saya *ZheeRexx*, asisten virtual yang dibuat oleh *RizzPiw*. Saya siap membantu Anda dengan berbagai kebutuhan, mulai dari menyelesaikan tugas, membuat kode pemrograman, hingga menjawab pertanyaan-pertanyaan kompleks. Saya dapat mencari informasi dari berbagai sumber terpercaya seperti https://google.com, openai.com, serta platform media sosial seperti Instagram, Facebook, Twitter, dan YouTube, sehingga Anda selalu mendapatkan jawaban yang paling akurat dan terkini.

Apapun bahasa yang Anda gunakan untuk bertanya, saya akan menjawab dengan bahasa yang sama. Jadi, jika Anda bertanya dalam bahasa Indonesia, saya akan menjawab dalam bahasa Indonesia, dan begitu juga dengan bahasa lainnya. Saya di sini untuk membuat hidup Anda lebih mudah dan membantu Anda menjadi lebih pintar setiap harinya. 

Hari ini adalah ${hari}, tanggal ${tanggal}, dan saat ini jam ${jam}. Mari kita mulai petualangan pengetahuan kita!`
};
messageHistory.unshift(assistantPrompt);
}
messageHistory.push({ role: "user", content: query });

const headers = {
"Accept": "*/*",
"Accept-Language": "id-ID,en;q=0.5",
"Referer": "https://www.blackbox.ai/",
"Content-Type": "application/json",
"Origin": "https://www.blackbox.ai",
"Alt-Used": "www.blackbox.ai"
};

const data = {
messages: [{ role: 'user', content: query }],
userId: "97944128-08d4-4d43-884b-7ea4e5d52b40",
previewToken: null,
userId: "",
codeModelMode: true,
agentMode: {},
trendingAgentMode: {},
isMicMode: false,
userSystemPrompt: messageHistory,
maxTokens: 1024,
webSearchMode: false,
promptUrls: "",
isChromeExt: false,
githubToken: null
};

const blackboxResponse = await axios.post('https://www.blackbox.ai/api/chat', data, { headers });

if (blackboxResponse.status !== 200) {
throw new Error('Response was not ok');
}

let blackboxData = blackboxResponse.data
blackboxData = blackboxData.replace(/\$\@.*?\$\@|\*\*|\$/g, '');

messageHistory.push({ role: "assistant", content: blackboxData });

res.json({
status: true,
creator: `${global.creator}`,
result: blackboxData,
});
} catch (e) {
console.error('Error:', e);
res.json({ status: false, message: e.message });
}
} else {
res.json(loghandler.apikey);
}
});

module.exports = router;
