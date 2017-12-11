// constants
const Discord = require('discord.js');
const {
	Client,
	Util,
} = require('discord.js');
const client = new Discord.Client({
	disableEveryone: true,
});
const {
	TOKEN,
	PREFIX,
	BOT_CHANNEL,
	OWNER_ID,
	LUCAS_ID,
	GOOGLE_APIKEY,
	PROJECT_ID,
	PROJECT_KEY,
	WOLFRAM_APPID,
	CLEVERBOT_KEY,
	AIRHORN_PATH,
	MLGAIRHORN_PATH,
} = require('../config');
const unhandledRejections = new Map();
const ytdl = require('ytdl-core');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(GOOGLE_APIKEY);
const queue = new Map();
const embed = new Discord.MessageEmbed();
const type = 3;
const GAME = `you | ${PREFIX}help`;
const update = 'December 11th, 2017';
const version = 'Alpha 0.3.0.9';

// airbrake
const airbrakeJs = require('airbrake-js');
const airbrake = new airbrakeJs({
	projectId: PROJECT_ID,
	projectKey: PROJECT_KEY,
});
airbrake.addFilter(function (notice) {
	notice.context.environment = 'production';
	return notice;
});

// const for colors
const blue = 3447003;
const orange = 0xf9bd31;
const red = 0xff0000;
const black = 0x000000;
const green = 0x00ff00;
const yellow = 0xffff00;

// attributes for commands
let isYes;
let isRunning = false;

// module exports
module.exports.Discord = Discord;
module.exports.Client = Client;
module.exports.Util = Util;
module.exports.client = client;
module.exports.TOKEN = TOKEN;
module.exports.PREFIX = PREFIX;
module.exports.BOT_CHANNEL = BOT_CHANNEL;
module.exports.OWNER_ID = OWNER_ID;
module.exports.LUCAS_ID = LUCAS_ID;
module.exports.GOOGLE_APIKEY = GOOGLE_APIKEY;
module.exports.PROJECT_ID = PROJECT_ID;
module.exports.PROJECT_KEY = PROJECT_KEY;
module.exports.WOLFRAM_APPID = WOLFRAM_APPID;
module.exports.CLEVERBOT_KEY = CLEVERBOT_KEY;
module.exports.AIRHORN_PATH = AIRHORN_PATH;
module.exports.MLGAIRHORN_PATH = MLGAIRHORN_PATH;
module.exports.unhandledRejections = unhandledRejections;
module.exports.YouTube = YouTube;
module.exports.ytdl = ytdl;
module.exports.embed = embed;
module.exports.youtube = youtube;
module.exports.queue = queue;
module.exports.type = type;
module.exports.GAME = GAME;
module.exports.update = update;
module.exports.version = version;
module.exports.airbrakeJs = airbrakeJs;
module.exports.airbrake = airbrake;
module.exports.blue = blue;
module.exports.orange = orange;
module.exports.red = red;
module.exports.black = black;
module.exports.green = green;
module.exports.yellow = yellow;
module.exports.isYes = isYes;
module.exports.isRunning = isRunning;