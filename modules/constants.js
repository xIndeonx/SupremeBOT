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
	GUILD_ID,
	BOT_CHANNEL,
	OWNERID,
	LUCASID,
	GOOGLE_APIKEY,
	PROJECT_ID,
	PROJECT_KEY,
	WOLFRAM_APPID,
	CLEVERBOT_KEY,
} = require('../config');
const unhandledRejections = new Map();
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const embed = new Discord.MessageEmbed();
const youtube = new YouTube(GOOGLE_APIKEY);
const queue = new Map();
const GAME = `you | ${PREFIX}help`;

// const for admin commands
const SET_GAME = `${PREFIX}setgame`;
const SET_AVATAR = `${PREFIX}setavatar`;
const SET_STATUS = `${PREFIX}setstatus`;
const RESTART = `${PREFIX}restart`;
const SHUTDOWN = `${PREFIX}shutdown`;
const DELETE = `${PREFIX}delete`;
const PURGE = `${PREFIX}purge`;
const EVAL = `${PREFIX}eval`;

// const for music commands
const MUSIC_PLAY = `${PREFIX}play`;
const MUSIC_STOP = `${PREFIX}stop`;
const MUSIC_SKIP = `${PREFIX}skip`;
const MUSIC_PAUSE = `${PREFIX}pause`;
const MUSIC_RESUME = `${PREFIX}resume`;
const MUSIC_VOLUME = `${PREFIX}volume`;
const MUSIC_NP = `${PREFIX}np`;
const MUSIC_QUEUE = `${PREFIX}queue`;
const MUSIC_SEARCH = `${PREFIX}search`;

// airbrake
var airbrakeJs = require('airbrake-js');
var airbrake = new airbrakeJs({
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
var isYes;
var isRunning = false;

// module exports
module.exports.Discord = Discord;
module.exports.Client = Client;
module.exports.Util = Util;
module.exports.client = client;
module.exports.TOKEN = TOKEN;
module.exports.PREFIX = PREFIX;
module.exports.GUILD_ID = GUILD_ID;
module.exports.BOT_CHANNEL = BOT_CHANNEL;
module.exports.OWNERID = OWNERID;
module.exports.LUCASID = LUCASID;
module.exports.GOOGLE_APIKEY = GOOGLE_APIKEY;
module.exports.PROJECT_ID = PROJECT_ID;
module.exports.PROJECT_KEY = PROJECT_KEY;
module.exports.WOLFRAM_APPID = WOLFRAM_APPID;
module.exports.CLEVERBOT_KEY = CLEVERBOT_KEY;
module.exports.unhandledRejections = unhandledRejections;
module.exports.YouTube = YouTube;
module.exports.ytdl = ytdl;
module.exports.embed = embed;
module.exports.youtube = youtube;
module.exports.queue = queue;
module.exports.GAME = GAME;
module.exports.SET_GAME = SET_GAME;
module.exports.SET_AVATAR = SET_AVATAR;
module.exports.SET_STATUS = SET_STATUS;
module.exports.RESTART = RESTART;
module.exports.SHUTDOWN = SHUTDOWN;
module.exports.DELETE = DELETE;
module.exports.PURGE = PURGE;
module.exports.EVAL = EVAL;
module.exports.MUSIC_PLAY = MUSIC_PLAY;
module.exports.MUSIC_STOP = MUSIC_STOP;
module.exports.MUSIC_SKIP = MUSIC_SKIP;
module.exports.MUSIC_PAUSE = MUSIC_PAUSE;
module.exports.MUSIC_RESUME = MUSIC_RESUME;
module.exports.MUSIC_VOLUME = MUSIC_VOLUME;
module.exports.MUSIC_NP = MUSIC_NP;
module.exports.MUSIC_QUEUE = MUSIC_QUEUE;
module.exports.MUSIC_SEARCH = MUSIC_SEARCH;
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