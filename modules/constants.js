//constants
const Discord = require('discord.js');
const {
    Client,
    Util
} = require('discord.js');
const client = new Discord.Client({
    disableEveryone: true
});
const {
    SECRET,
    TOKEN,
    PREFIX,
    CHANNEL,
    BOT_CHANNEL,
    OWNERID,
    LUCASID,
    YT_API,
    PROJECT_ID,
    PROJECT_KEY
} = require('../config');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const embed = new Discord.RichEmbed();
const youtube = new YouTube(YT_API);
const queue = new Map();
const GAME = '.help | Work in Progress';

//const for admin commands
const SET_GAME = `${PREFIX}SETGAME`;
const SET_AVATAR = `${PREFIX}SETAVATAR`;
const SET_STATUS = `${PREFIX}SETSTATUS`;
const RESTART = `${PREFIX}RESTART`;
const SHUTDOWN = `${PREFIX}SHUTDOWN`;
const DELETE = `${PREFIX}DELETE`;
const PURGE = `${PREFIX}PURGE`;
const MEMORY = `${PREFIX}MEMORY`;
const EVAL = `${PREFIX}EVAL`;

//const for music commands
const MUSIC_PLAY = `${PREFIX}PLAY`;
const MUSIC_STOP = `${PREFIX}STOP`;
const MUSIC_SKIP = `${PREFIX}SKIP`;
const MUSIC_PAUSE = `${PREFIX}PAUSE`;
const MUSIC_RESUME = `${PREFIX}RESUME`;
const MUSIC_VOLUME = `${PREFIX}VOLUME`;
const MUSIC_NP = `${PREFIX}NP`;
const MUSIC_QUEUE = `${PREFIX}QUEUE`;

//airbrake
var airbrakeJs = require('airbrake-js');
var airbrake = new airbrakeJs({
    projectId: PROJECT_ID,
    projectKey: PROJECT_KEY
});
airbrake.addFilter(function (notice) {
    notice.context.environment = 'production';
    return notice;
});

//const for colors
const blue = 3447003;
const orange = 0xf9bd31;
const red = 0xff0000;
const black = 000000;
const green = 0x00ff00;
const yellow = 0xffff00;

//attributes for games
var isYes;

module.exports.Discord = Discord;
module.exports.Client = Client;
module.exports.Util = Util;
module.exports.client = client;
module.exports.SECRET = SECRET;
module.exports.TOKEN = TOKEN;
module.exports.PREFIX = PREFIX;
module.exports.CHANNEL = CHANNEL;
module.exports.BOT_CHANNEL = BOT_CHANNEL;
module.exports.OWNERID = OWNERID;
module.exports.LUCASID = LUCASID;
module.exports.YT_API = YT_API;
module.exports.PROJECT_ID = PROJECT_ID;
module.exports.PROJECT_KEY = PROJECT_KEY;
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
module.exports.MEMORY = MEMORY;
module.exports.EVAL = EVAL;
module.exports.MUSIC_PLAY = MUSIC_PLAY;
module.exports.MUSIC_STOP = MUSIC_STOP;
module.exports.MUSIC_SKIP = MUSIC_SKIP;
module.exports.MUSIC_PAUSE = MUSIC_PAUSE;
module.exports.MUSIC_RESUME = MUSIC_RESUME;
module.exports.MUSIC_VOLUME = MUSIC_VOLUME;
module.exports.MUSIC_NP = MUSIC_NP;
module.exports.MUSIC_QUEUE = MUSIC_QUEUE;
module.exports.airbrakeJs = airbrakeJs;
module.exports.airbrake = airbrake;
module.exports.blue = blue;
module.exports.orange = orange;
module.exports.red = red;
module.exports.black = black;
module.exports.green = green;
module.exports.yellow = yellow;
module.exports.isYes = isYes;