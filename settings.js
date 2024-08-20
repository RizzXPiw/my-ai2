const fs = require("fs");

global.creator = "RizzPiw";
global.apikey = ["RizzXPiw","ZheeRexx"];
global.loghandler = {
	noapikey: {
		status: 403,
		message: "Masukkan parameter apikey",
		maintanied_by: `RizzPiw`,
	},
	error: {
		status: 503,
		message: "Sedang Dalam Perbaikan Cuy",
		maintanied_by: `RizzPiw`,
	},
	apikey: {
		status: 403,
		message:
			"Forbiden, Invalid apikey, silahkan hubungi RizzPiw [ wa.me/63895614033342 ]",
		maintanied_by: `RizzPiw`,
	},
	noturl: {
		status: 403,
		message: "Forbiden, Invlid url, masukkan parameter url",
		maintanied_by: `RizzPiw`,
	},
	notquery: {
		status: 403,
		message: "Forbiden, Invlid query, masukkan parameter query",
		maintanied_by: `RizzPiw`,
	},
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
	fs.unwatchFile(file);
	console.log(`Update'${__filename}'`);
	delete require.cache[file];
	require(file);
});
