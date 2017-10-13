//const
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
} = require('./config');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const embed = new Discord.RichEmbed();
const youtube = new YouTube(YT_API);
const queue = new Map();
const GAME = 'Work in Progress | Prefix: .';

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
const cardValues = [1,2,3,4,5,6,7,8,9,10,10,10,10,11];
var isYes;

//warn
client.on('warn', console.warn);

//error
client.on('error', console.error);

//ready
client.on('ready', () => {
    client.user.setPresence({
        game: {
            name: GAME,
            type: 0
        }
    });
    logToChannel("Information", "Bot successfully initialized.", client.user.tag, client.user.displayAvatarURL);
});

//disconnect
client.on('disconnect', () => console.log('Bot has disconnected...'));

//reconnecting
client.on('reconnecting', () => console.log('Bot is reconnecting...'));

//bot token login
client.login(TOKEN);

//music stuff
client.on('message', async message => {
    if (message.author.bot) return;
    if (!message.content.toUpperCase().startsWith(PREFIX)) return;
    const args = message.content.split(' ');
    const searchString = args.slice(1).join(' ');
    const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
    const serverQueue = queue.get(message.guild.id);

    if (message.content.toUpperCase().startsWith(MUSIC_PLAY)) {
        const voiceChannel = message.member.voiceChannel;
        const authorid = message.author.id;
        if (!voiceChannel) return message.channel.send(':bangbang: **You need to be in a voice channel to play music!**');
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) {
            return message.channel.send(':bangbang: **Cannot connect to your voice channel!**');
        }
        if (!permissions.has('SPEAK')) {
            return message.channel.send(':bangbang: **Cannot speak in your voice channel!**');
        }

        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
            message.channel.startTyping();
            const playlist = await youtube.getPlaylist(url);
            const videos = await playlist.getVideos();
            for (const video of Object.values(videos)) {
                const video2 = await youtube.getVideoByID(video.id);
                await handleVideo(video2, message, voiceChannel, true);
            }
            message.channel.stopTyping(true);
            return message.channel.send(`Playlist **${playlist.title}** has been added to the queue!`);
        } else {
            try {
                var video = await youtube.getVideo(url);
            } catch (error) {
                try {
                    var videos = await youtube.searchVideos(searchString, 5);
                    let index = 0;
                    message.channel.send(`
__**Search results:**__

\`\`\`xl
${videos.map(video2 => `${++index} - ${video2.title}`).join('\n')}
\`\`\`
Please input the number of the song you want to play **(1-5)**
                    `);

                    try {
                        var response = await message.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 6, {
                            maxMatches: 1,
                            time: 30000,
                            errors: ['time']
                        });
                    } catch (err) {
                        console.error(err);
                        return message.channel.send('No or invalid input, cancelling video selection.');
                    }
                    const videoIndex = parseInt(response.first().content);
                    var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                } catch (err) {
                    console.error(err);
                    airbrake.notify(err);
                    message.channel.stopTyping(true);
                    return message.channel.send(':bangbang: **Could not get search results.**');
                }
            }
            return handleVideo(video, message, voiceChannel);
        }
    } else if (message.content.toUpperCase().startsWith(MUSIC_SKIP)) {
        if (!message.member.voiceChannel) return message.channel.send(':bangbang: **You are not in a voice channel!**');
        if (!serverQueue) return message.channel.send(':bangbang: **There is nothing playing!**');
        setTimeout(function () {
            serverQueue.connection.dispatcher.end('Skip command has been used.');
        }, 500);
        message.channel.send(':track_next: **Skipping...**');
        return;
    } else if ((message.content.toUpperCase().startsWith(MUSIC_STOP)) || (message.content.toUpperCase().startsWith(`${PREFIX}leave`))) {
        if (!message.member.voiceChannel) return message.channel.send(':bangbang: **You are not in a voice channel!**');
        if (!serverQueue) return message.channel.send(':bangbang: **There is nothing playing!**');
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end('Stop command has been used.');
        message.channel.send(':stop_button: **Successfully stopped.**');
        return;
    } else if (message.content.toUpperCase().startsWith(MUSIC_VOLUME)) {
        if (!message.member.voiceChannel) return message.channel.send(':bangbang: **You are not in a voice channel!**');
        if (!serverQueue) return message.channel.send(':bangbang: **There is nothing playing!**');
        if (!args[1]) return message.channel.send(`:loud_sound: The current volume is: **${serverQueue.volume}**.`);
        if (args[1]) {
            if (args[1] > 10) {
                serverQueue.volume = 10;
                serverQueue.connection.dispatcher.setVolumeLogarithmic(10 / 5);
                return message.channel.send(':loud_sound: Set the volume to the maximum: **10**.');
            } else if (serverQueue.volume === parseInt(args[1])) {
                return message.channel.send(`:loud_sound: The volume is already on **${args[1]}**.`);
            } else if (args[1] <= 10) {
                serverQueue.volume = args[1];
                serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
                return message.channel.send(`:loud_sound: Set the volume to: **${args[1]}**.`);
            }
        }
    } else if (message.content.toUpperCase().startsWith(MUSIC_NP)) {
        if (!serverQueue) return message.channel.send(':bangbang: **There is nothing playing.**');
        return message.channel.send(`:notes: Now playing: **${serverQueue.songs[0].title}**`);
    } else if (message.content.toUpperCase().startsWith(MUSIC_QUEUE)) {
        if (!serverQueue) return message.channel.send(':bangbang: **There is nothing playing.**');
        let index = 0;
        var queuelist = `\n${serverQueue.songs.map(song => `${++index} - ${song.title}`).join('\n')}`;
        return message.channel.send({
            embed: {
                title: 'Queue',
                color: blue,
                description: `\`\`\`xl
${queuelist}
            \`\`\``,
                footer: {
                    text: `Now playing: ${serverQueue.songs[0].title}`
                }
            }
        });
    } else if (message.content.toUpperCase().startsWith(MUSIC_PAUSE)) {
        if (serverQueue && serverQueue.playing) {
            serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause();
            return message.channel.send(':pause_button: **Successfully paused.**');
        }
        return message.channel.send(':bangbang: **There is nothing playing.**');
    } else if (message.content.toUpperCase().startsWith(MUSIC_RESUME)) {
        if (serverQueue && !serverQueue.playing) {
            serverQueue.playing = true;
            serverQueue.connection.dispatcher.resume();
            return message.channel.send(':arrow_forward: **Successfully resumed.**');
        }
        return message.channel.send(':bangbang: **There is nothing playing.**');
    }
    return;
});

async function handleVideo(video, message, voiceChannel, playlist = false) {
    const serverQueue = queue.get(message.guild.id);
    console.log(video);
    const song = {
        id: video.id,
        title: Util.escapeMarkdown(video.title),
        url: `https://www.youtube.com/watch?v=${video.id}`
    };
    if (!serverQueue) {
        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 3,
            playing: true
        };
        queue.set(message.guild.id, queueConstruct);
        queueConstruct.songs.push(song);
        try {
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            play(message.guild, queueConstruct.songs[0]);
        } catch (error) {
            console.error(`:bangbang: **Could not join the voice channel:** ${error}`);
            airbrake.notify(error);
            queue.delete(message.guild.id);
            return message.channel.send(`:bangbang: **Could not join the voice channel:** ${error}`);
        }
    } else {
        serverQueue.songs.push(song);
        console.log(serverQueue.songs);
        if (playlist) return;
        else return message.channel.send(`:notes: **${song.title}** has been added to the queue!`);
    }
    return;
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }
    console.log(serverQueue.songs);
    const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
        .on('end', reason => {
            if (reason === 'Stream is not generating quickly enough.') console.log('Song ended!');
            else console.log(reason);
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on('error', error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`:arrow_forward: Started playing: **${song.title}**`);
}

//message on member join
client.on('guildMemberAdd', function (member) {
    // Send the message to a designated channel on a server
    const channel = member.guild.channels.find('name', 'announcements');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`Welcome to the server, ${member}!`);
});

//function for correct time format
function format(seconds) {
    function pad(s) {
        return (s < 10 ? '0' : '') + s;
    }
    var hours = Math.floor(seconds / (60 * 60));
    var minutes = Math.floor(seconds % (60 * 60) / 60);
    var seconds = Math.floor(seconds % 60);

    return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
}

//function for logging
function logToChannel(title, logMessage, messageAuthor, picture) {

    switch (title) {
        case "Information":
            color = blue;
            console.log(logMessage);
            break;
        case "Warning":
            color = orange;
            console.warn(logMessage);
            break;
        case "Error":
            color = red;
            console.error(logMessage);
            airbrake.notify(logMessage);
            break;
        default:
            color = black;
    }

    const embed = new Discord.RichEmbed()
        .setTitle(title)
        .setAuthor(messageAuthor)
        .setColor(color)
        .setDescription(logMessage)
        .setThumbnail(picture)
        .setTimestamp();
    client.channels.get(BOT_CHANNEL).send({
        embed
    });

}

//function for coinflip
function coinFlip(coinFlipMessage) {
    const coinflipEmbed = new Discord.RichEmbed()
        .setDescription(`${PREFIX}coinflip firstCondition secondCondition **OR** ${PREFIX}coinflip`)
        .setColor(blue);
    var clientInput = coinFlipMessage.split(" ");
    if (clientInput.length != 3 && clientInput.length != 1) {
        return coinflipEmbed;
    } else {
        if (clientInput.length == 3) {
            var firstCondition = clientInput[1];
            var secondCondition = clientInput[2];
            var coin = Math.floor((Math.random() * 10) + 1);
            if (coin <= 5) return firstCondition;
            else return secondCondition;
        } else {
            var coin = Math.floor((Math.random() * 10) + 1);
            if (coin <= 5) return "Head";
            else return "Tails";
        }
    }
}

//function for RPS
function rpsGenerator() {

    var rps = Math.floor((Math.random() * 3) + 1);
    if (rps == 1) {
        return "Rock";
    } else if (rps == 2) {
        return "Paper";
    } else {
        return "Scissor";
    }
}

function rpsBattle(botRPS, userRPS) {

    if (botRPS == "Rock") {

        if (userRPS == "ROCK") {
            return "DRAW";
        } else if (userRPS == "SCISSOR") {
            return "BOT";
        } else {
            return "USER";
        }

    } else if (botRPS == "Paper") {
        if (userRPS == "ROCK") {
            return "BOT";
        } else if (userRPS == "SCISSOR") {
            return "USER";
        } else {
            return "DRAW";
        }

    } else if (botRPS == "Scissor") {
        if (userRPS == "ROCK") {
            return "USER";
        } else if (userRPS == "SCISSOR") {
            return "DRAW";
        } else {
            return "BOT";
        }

    }
}

function rpsPrint(userRPS, usertag) {

    var botRPS = rpsGenerator();
    if (userRPS.toUpperCase() == "ROCK" || userRPS.toUpperCase() == "SCISSOR" || userRPS.toUpperCase() == "PAPER" && userRPS) {
        var rpsMessage = rpsBattle(botRPS, userRPS);
        switch (rpsMessage) {
            case "USER":
                return usertag + " Won!";
            case "BOT":
                return client.user.toString() + " Won!";
            case "DRAW":
                return rpsMessage;
        }
    } else {
        return "Please enter a valid message! (Rock, Paper or Scissor)";
    }

}

//function for 8ball
function eightball() {

    var answer = Math.floor((Math.random() * 10) + 1);
    var answerChoice = Math.floor((Math.random() * 8) + 1);
    if (answer <= 5) {
        isYes = "YES";
        switch (answerChoice) {
            case 1:
                return "Definitiv.";
            case 2:
                return "Uf jede Fall, ja.";
            case 3:
                return "Mini Source seget mir das stimmt.";
            case 4:
                return "Ja, aber nur will **ICH**s sege.";
            case 5:
                return "Bin mir nöd 100% sicher, aber glaubs ja.";
            case 6:
                isYes = "VAPEIO";
                return "Ich bin de Vapeio und ich han kei Entscheidigsfähigkeit.";
            case 7:
                return "Ich han googlet, es stimmt, ja.";
            case 8:
                return "Ih dem Fall scho, ja.";
        }
    } else {
        isYes = "NO";
        switch (answerChoice) {
            case 1:
                return "Nö, sicher nöd.";
            case 2:
                return "Bisch du behindert? **Nei**.";
            case 3:
                return "Also wenn das stimmt, denn weissi au nöd.";
            case 4:
                return "Also wenn du denksch, dass mini Antwort ja isch, denn hesch dich girrt.";
            case 5:
                return "Hesch du wüki s'Gfühl, dass ich ja sege? wtf";
            case 6:
                return "Ich weiss du ghörsch es nöd gern, aber es isch es klars nei vo mir.";
            case 7:
                return "Also wenn das \"Britain's Got Talent\" wär, hetsch fix 3 Mal nei becho.";
            case 8:
                return "Wenns Wort ja **\"nei\"** heisse wür, wärs es ja.";
        }
    }

}

function eightballColorDecider(){
    if(isYes == "YES"){
        return green;
    } else if(isYes == "VAPEIO"){
        return yellow;
    } else {
        return red;
    }
}

//function for lotto
function lotto(userGuess) {
    if (!userGuess || isNaN(userGuess)) {
        return `Please use the command like this: \`${PREFIX}lotto number\``;
    } else if (userGuess < 1 || userGuess > 50) {
        return "Please enter a valid number between 1 and 50!";
    } else {
        var lottoNumber = Math.floor((Math.random() * 50) + 1);
        if (userGuess == lottoNumber) {
            return "Congratulations, you guessed right! Here's a kiss from Doni! :kissing_closed_eyes:";
        } else {
            return "You guesses wrong :pensive: Maybe next time...";
        }
    }

}

//function for eval command
function clean(text) {
    if (typeof (text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}

//commands
client.on('message', function (message) {
    if (message.author.bot) return;
    if (!message.content.toUpperCase().startsWith(PREFIX)) return;
    if (!message.guild) return;
    if (message.content.toUpperCase().startsWith(`${PREFIX}JOIN`)) {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join()
                .then(connection => { // Connection is an instance of VoiceConnection
                    message.channel.send(':white_check_mark: I have successfully connected to the channel!');
                })
                .catch(console.log);
        } else {
            message.channel.send(':bangbang: You need to join a voice channel first!');
        }
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}VCLEAVE`)) {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.leave();
            message.channel.send(':white_check_mark: I have successfully disconnected from the channel!');
        } else {
            message.channel.send(':bangbang: You are not in a voice channel!');
        }
    } else if (message.content.toUpperCase().startsWith(EVAL)) { //eval
        if ((message.author.id === OWNERID) || (message.author.id === LUCASID)) {
            const args = message.content.split(" ").slice(1);
            try {
                const code = args.join(" ");
                var now = require('performance-now');
                var start = now();
                let evaled = eval(code);
                var end = now();

                if (typeof evaled !== "string")
                    evaled = require("util").inspect(evaled);

                message.channel.send({
                    embed: {
                        color: green,
                        title: 'Success',
                        description: '\`\`\`xl\n' + clean(evaled) + '\`\`\`Took `' + (end - start).toFixed(3) + 'ms`'
                    }
                });
            } catch (err) {
                message.channel.send({
                    embed: {
                        color: red,
                        title: 'ERROR',
                        description: `\`\`\`xl\n${clean(err)}\n\`\`\``
                    }
                });
            }
        } else return;
    } else if (message.content.toUpperCase().startsWith(SET_GAME)) { //setgame
        if ((message.author.id === OWNERID) || (message.author.id === LUCASID)) {
            var input = message.content;
            var clientInput = input.substr(9);
            client.user.setPresence({
                game: {
                    name: clientInput,
                    type: 0
                }
            });
        } else {
            message.channel.send('You are not authorized to use this command.');
        }
    } else if (message.content.toUpperCase().startsWith(SET_AVATAR)) { //setavatar
        if ((message.author.id === OWNERID) || (message.author.id === LUCASID)) {
            var input = message.content;
            var clientInput = input.substr(11);
            client.user.setAvatar(clientInput);
        } else {
            message.channel.send('You are not authorized to use this command.');
        }
    } else if (message.content.toUpperCase().startsWith(SET_STATUS)) { //setstatus
        if ((message.author.id === OWNERID) || (message.author.id === LUCASID)) {
            var input = message.content;
            var clientInput = input.substr(11);
            if (clientInput === ('dnd') || clientInput === ('online') || clientInput === ('idle') || clientInput === ('invisible')) {
                client.user.setStatus(clientInput);
            } else return message.channel.send('Wrong input. Please use `online`, `idle`, `dnd`, or `invisible`.');
        } else {
            message.channel.send('You are not authorized to use this command.');
        }
    } else if (message.content.toUpperCase().startsWith(RESTART)) { //restart
        if ((message.author.id === OWNERID) || (message.author.id === LUCASID)) {
            message.channel.send('Restarting...');
            setTimeout(function () {
                process.exit();
            }, 1000);
        } else {
            message.channel.send('You are not authorized to use this command.');
        }
    } else if (message.content.toUpperCase().startsWith(SHUTDOWN)) { //shutdown
        if ((message.author.id === OWNERID) || (message.author.id === LUCASID)) {
            message.channel.send('Shutting down...');
            client.destroy((err) => {
                logToChannel("Error", err, message.author.tag, message.author.displayAvatarURL);
            });
            process.exitCode = 1;
        } else {
            message.channel.send('You are not authorized to use this command.');
        }
    } else if (message.content.toUpperCase().startsWith(DELETE)) { //delete
        if ((message.member.permissions.has('ADMINISTRATOR')) || (message.author.id === OWNERID) || (message.author.id === OWNERID)) {
            if (message.channel.type == 'text') {
                var input = message.content;
                var clientInput = input.substr(8);
                let messagecount = parseInt(clientInput);
                if (isNaN(messagecount)) {
                    message.channel.send('Could not delete messages. Please enter a valid number.');
                    return;
                } else {
                    messagecount = messagecount + 1;
                    message.channel.fetchMessages({
                            limit: messagecount
                        })
                        .then(messages => message.channel.bulkDelete(messages));
                    message.channel.send({
                            embed: {
                                color: blue,
                                description: "You deleted: " + (messagecount - 1) + " message(s)"
                            }
                        })
                        .then(sent => sent.delete(5000));
                    logToChannel("Information", "Deleted Messages.\nCount: **" + (messagecount - 1) + "**", message.author.tag, message.author.displayAvatarURL);
                }
            }
        } else {
            message.channel.send('You are not authorized to use this command.');
        }
    } else if (message.content.toUpperCase().startsWith(PURGE)) { //purge
        if ((message.member.permissions.has('ADMINISTRATOR')) || (message.author.id === OWNERID) || (message.author.id === OWNERID)) {
            if (message.channel.type == 'text') {
                message.channel.fetchMessages()
                    .then(messages => {
                        message.channel.bulkDelete(messages);
                        messagesDeleted = messages.array().length; // number of messages deleted
                        // Logging the number of messages deleted on both the channel and console.
                        message.channel.send({
                                embed: {
                                    color: blue,
                                    description: "Purge successful: " + messagesDeleted + " message(s) fetched and deleted."
                                }
                            })
                            .then(sent => sent.delete(5000));
                        logToChannel("Information", "Purge successful: " + messagesDeleted, message.author.tag, message.author.displayAvatarURL);
                    })
                    .catch(err => {
                        logToChannel("Error", err, message.author.tag, message.author.displayAvatarURL);
                    });
            }
        } else {
            message.channel.send('You are not authorized to use this command.');
        }
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}1=0`)) { //1=0
        message.channel.send('1=0');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}8BALL`)) { //8ball
        message.channel.send({
            embed: {
                title: 'The magic 8ball says...',
                description: eightball(),
                color: eightballColorDecider()
            }
        });
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}ADEMERCI`)) { //ademerci
        message.channel.send('Ademerci');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}AHA`)) { //aha
        message.channel.send('Aha');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}ALINA`)) { //alina
        message.channel.send('Daddy?');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}ANDREAS`)) { //andreas
        message.channel.send('I heisse Andreas, nöd Oliver.');
    } else if ((message.content.toUpperCase().startsWith(`${PREFIX}ANDY`)) || (message.content.toUpperCase().startsWith(`${PREFIX}ANDI`))) { //andy / andi
        message.channel.send('De Andi füut sech elei in Bärn.');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}AUÄ`)) { //auä
        message.channel.send('Auä!');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}AUTISMUS`)) { //autismus
        message.channel.send('Autismus ist eine weitverbreitete Krankheit, vor allem im schweizerischen Bubikon.');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}AUTIST`)) { //autist
        message.channel.send('Wüki?!?!?');
    } else if (message.content.toUpperCase() === `${PREFIX}BAUMI`) { //baumi
        message.channel.send('Try using `.baumi1`, `.baumi2`, `.baumi3`, or `.baumi4`!');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}BAUMI1`)) { //baumi1
        message.channel.send("Cha de Alain scho d'Uhr lese?");
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}BAUMI2`)) { //baumi2
        message.channel.send('Wetsch es Zäpfli?');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}BAUMI3`)) { //baumi3
        message.channel.send('<@' + LUCASID + '>, ab id Duschi');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}BAUMI4`)) { //baumi4
        message.channel.send('Chopf im Sofa.');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}BITTE`)) { //bitte
        message.channel.send('Bitte gerngscheh.');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}BOOGEYMAN`)) { //boogeyman
        message.channel.send('Kuka pelkää musta miestä?');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}BZZ`)) { //bzz
        message.channel.send('Bescht Schuel vom Kanton Horge.');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}CHANNELINFO`)) { //channelinfo
        const embed = new Discord.RichEmbed()
            .setColor(blue)
            .setTimestamp()
            .setAuthor(message.channel.name, message.guild.iconURL)
            .addField('Name', message.channel.name)
            .addField('ID', message.channel.id)
            .addField('Topic', message.channel.topic)
            .addField('Type', message.channel.type)
            .addField('Created At', message.channel.createdAt)
            .addField('Position', message.channel.position);
        message.channel.send({
            embed
        });
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}CHANNELS`)) { //channels
        const embed = new Discord.RichEmbed()
            .setColor(blue)
            .setTimestamp()
            .setAuthor(message.guild.name, message.guild.iconURL)
            .addField('List of Channels', 'TBD');
        message.channel.send({
            embed
        });
    } else if (message.content.toUpperCase() === `${PREFIX}CLAUDIO`) { //claudio
        message.channel.send('De Clö isch immer am schaffe.');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}CLAUDIOLINO`)) { //claudiolino
        message.channel.send('Clö, bitte, stfu.');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}CLÖ`)) { //clö
        message.channel.send('Ich ha gseit **NEI**.');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}COINFLIP`)) { //coinflip
        var result = coinFlip(message.content);
        message.channel.send({
            embed: {
                title: 'Result',
                color: blue,
                description: result
            }
        });
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}COUNTDOWN`)) { //countdown
        var input = message.content;
        var clientInput = input.substr(11);
        let count = parseInt(clientInput);
        if (isNaN(count)) {
            message.channel.send('Could not create countdown. Please enter a valid number.');
            return;
        } else {
            message.channel.send({
                embed: {
                    color: blue,
                    title: 'Countdown',
                    description: 'Countdown started. This will take approximately **' + format(clientInput) + '**'
                }
            }).then(sentmsg => {
                var i = clientInput;
                var interval = setInterval(function () {
                    sentmsg.edit({
                        embed: {
                            color: blue,
                            title: 'Countdown',
                            description: '```' + format(i) + '```'
                        }
                    });
                }, 3000);
                (function fn() {
                    if (i > 0) {
                        setTimeout(function () {
                            fn(--i);
                        }, 1000);
                    }
                    if (i === 0) {
                        sentmsg.edit({
                            embed: {
                                color: blue,
                                title: 'Countdown',
                                description: 'Countdown ended. Total time wasted: **' + format(clientInput) + '**'
                            }
                        });
                        clearInterval(interval);
                    }
                }(clientInput));
            });
        }
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}CUSTOM`)) { //custom
        const embed = new Discord.RichEmbed()
            .setColor(red)
            .setTimestamp()
            .setAuthor(client.user.username, client.user.displayAvatarURL)
            .setTitle('Custom Commands')
            .setDescription('This is a complete list of all custom commands.')
            .addField('A-E', '\`' + PREFIX + '1=0\`\n' + '\`' + PREFIX + 'ademerci\`\n' + '\`' + PREFIX + 'aha\`\n' + '\`' + PREFIX + 'alina\`\n' + '\`' + PREFIX + 'andreas\`\n' + '\`' + PREFIX + 'andi\`\n' + '\`' + PREFIX + 'andy\`\n' + '\`' + PREFIX + 'auä\`\n' + '\`' + PREFIX + 'autismus\`\n' + '\`' + PREFIX + 'autist\`\n' + '\`' + PREFIX + 'baumi\`\n' + '\`' + PREFIX + 'baumi1\`\n' + '\`' + PREFIX + 'baumi2\`\n' + '\`' + PREFIX + 'baumi3\`\n' + '\`' + PREFIX + 'baumi4\`\n' + '\`' + PREFIX + 'bitte\`\n' + '\`' + PREFIX + 'boogeyman\`\n' + '\`' + PREFIX + 'bzz\`\n' + '\`' + PREFIX + 'claudio\`\n' + '\`' + PREFIX + 'claudiolino\`\n' + '\`' + PREFIX + 'clö\`\n' + '\`' + PREFIX + 'danke\`\n' + '\`' + PREFIX + 'dinimom\`\n' + '\`' + PREFIX + 'doni\`\n' + '\`' + PREFIX + 'eine\`\n', true)
            .addField('E-J', '\`' + PREFIX + 'eis\`\n' + '\`' + PREFIX + 'exit\`\n' + '\`' + PREFIX + 'fabio\`\n' + '\`' + PREFIX + 'fabio2\`\n' + '\`' + PREFIX + 'fabiocsgo\`\n' + '\`' + PREFIX + 'fige\`\n' + '\`' + PREFIX + 'filip\`\n' + '\`' + PREFIX + 'game\`\n' + '\`' + PREFIX + 'getshiton\`\n' + '\`' + PREFIX + 'gopfeteli\`\n' + '\`' + PREFIX + 'gschicht\`\n' + '\`' + PREFIX + 'hoi\`\n' + '\`' + PREFIX + 'hm\`\n' + '\`' + PREFIX + 'ich\`\n' + '\`' + PREFIX + 'ichi\`\n' + '\`' + PREFIX + 'interessiert\`\n' + '\`' + PREFIX + 'inyourfaculty\`\n' + '\`' + PREFIX + 'inyourfamily\`\n' + '\`' + PREFIX + 'inyourname\`\n' + '\`' + PREFIX + 'inyourspirit\`\n' + '\`' + PREFIX + 'ivan\`\n' + '\`' + PREFIX + 'jacob\`\n' + '\`' + PREFIX + 'jesus\`\n' + '\`' + PREFIX + 'jesuschrist\`\n' + '\`' + PREFIX + 'joel\`\n', true)
            .addField('K-Z', '\`' + PREFIX + 'kadder\`\n' + '\`' + PREFIX + 'kadder2\`\n' + '\`' + PREFIX + 'ksh\`\n' + '\`' + PREFIX + 'lucas\`\n' + '\`' + PREFIX + 'lucas2\`\n' + '\`' + PREFIX + 'lucas3\`\n' + '\`' + PREFIX + 'merci\`\n' + '\`' + PREFIX + 'mila\`\n' + '\`' + PREFIX + 'noah\`\n' + '\`' + PREFIX + 'oli\`\n' + '\`' + PREFIX + 'ppap\`\n' + '\`' + PREFIX + 'pubg\`\n' + '\`' + PREFIX + 'rip\`\n' + '\`' + PREFIX + 'snus\`\n' + '\`' + PREFIX + 'sorry\`\n' + '\`' + PREFIX + 'stfu\`\n' + '\`' + PREFIX + 'thermos\`\n' + '\`' + PREFIX + 'toubi\`\n' + '\`' + PREFIX + 'velo\`\n' + '\`' + PREFIX + 'vn\`\n' + '\`' + PREFIX + 'weltbild\`\n' + '\`' + PREFIX + 'zeit\`\n' + '\`' + PREFIX + 'ziit\`\n' + '\`' + PREFIX + 'ziit?\`\n' + '\`' + PREFIX + 'zoel\`\n', true)
        message.channel.send({
            embed
        });
    } else if ((message.content.toUpperCase().startsWith(`${PREFIX}DANKE`)) || (message.content.toUpperCase().startsWith(`${PREFIX}MERCI`))) { //danke / merci
        const embed = new Discord.RichEmbed()
            .setTitle('Merci viu mol')
            .setColor(blue)
            .setImage('https://t3.ftcdn.net/jpg/00/88/04/32/240_F_88043202_HGdQvy3vJoSYVznZXBx1n2JNvDhSk8Ss.jpg')
        message.channel.send({
            embed
        });
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}DINIMOM`)) { //dinimom
        message.channel.send('WÜKI?!?!?!??');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}DONI`)) { //doni
        message.channel.send('Heb fressi oder ich küss dich.');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}ECHO`)) { //echo
        var input = message.content;
        var clientInput = input.substr(6);
        message.delete(200);
        setTimeout(function () {
            message.channel.send(clientInput);
        }, 300);
        logToChannel("Information", "Echo command has been used:\n" + clientInput, message.author.tag, message.author.displayAvatarURL);
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}EINE`)) { //eine
        message.channel.send('isch keine.');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}EIS`)) { //eis
        message.channel.send('isch keis.');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}EXIT`)) { //exit
        message.channel.send('Selbstmordorganisation');
    } else if (message.content.toUpperCase() === `${PREFIX}FABIO`) { //fabio
        message.channel.send('De Vabio isch en chline Memer.');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}FABIO2`)) { //fabio2
        message.channel.send('Wie isch d\'Matur? - Mis Lebe isch erfüllt.');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}FABIOCSGO`)) { //fabiocsgo
        message.channel.send('High risk - no reward.');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}FIGE`)) { //fige
        message.channel.send('De Feliks het en usprägte Orientierigssinn.');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}FILIP`)) { //filip
        message.channel.send('Uf de Chopf gheit.');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}GAME`)) { //game
        message.channel.send('Gits eis?');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}GETSHITON`)) { //getshiton
        message.channel.send('Catch it hard!');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}GOPFETELI`)) { //gopfeteli
        message.channel.send('Gopfeteli');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}GSCHICHT`)) { //gschicht
        message.channel.send('*glernt*');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}HAKAI`)) { //hakai
        if (message.mentions.users.size == 0) return message.channel.send('Did not specify a user.');
        if (message.mentions.users.size == 1) {
            if (message.mentions.users.first() != message.author.toString()) {
                return message.channel.send(message.mentions.users.first() + ' has been destroyed by ' + message.author.toString());
            } else return message.channel.send("You cannot destroy yourself, " + message.author.toString());
        }
        if (message.mentions.users.size > 1) return message.channel.send('Specified too many users.');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}HELP`)) { //help
        const embed = new Discord.RichEmbed()
            .setColor(red)
            .setTimestamp()
            .setAuthor(client.user.username, client.user.displayAvatarURL)
            .setTitle('Commands')
            .setDescription('This is a complete list of commands currently available for the bot.\nFor a list of custom commands, use \`' + PREFIX + 'custom\`')
            .addField('Owner', '\`' + PREFIX + 'eval\`\n' + '\`' + PREFIX + 'restart\`\n' + '\`' + PREFIX + 'setavatar\`\n' + '\`' + PREFIX + 'setgame\`\n' + '\`' + PREFIX + 'setstatus\`\n' + '\`' + PREFIX + 'shutdown\`\n', true)
            .addField('Admin', '\`' + PREFIX + 'delete\`\n' + '\`' + PREFIX + 'purge\`\n', true)
            .addBlankField(true)
            .addField('Music', '\`' + PREFIX + 'join\`\n' + '\`' + PREFIX + 'leave\`\n' + '\`' + PREFIX + 'np\`\n' + '\`' + PREFIX + 'pause\`\n' + '\`' + PREFIX + 'play\`\n' + '\`' + PREFIX + 'queue\`\n' + '\`' + PREFIX + 'resume\`\n' + '\`' + PREFIX + 'skip\`\n' + '\`' + PREFIX + 'stop\`\n' + '\`' + PREFIX + 'vcleave\`\n' + '\`' + PREFIX + 'volume\`\n', true)
            .addField('Info', '\`' + PREFIX + 'channelinfo\`\n' + '\`' + PREFIX + 'channels\`\n' + '\`' + PREFIX + 'custom\`\n' + '\`' + PREFIX + 'help\`\n' + '\`' + PREFIX + 'memory\`\n' + '\`' + PREFIX + 'osuptime\`\n' + '\`' + PREFIX + 'ping\`\n' + '\`' + PREFIX + 'roles\`\n' + '\`' + PREFIX + 'serverinfo\`\n' + '\`' + PREFIX + 'uptime\`\n' + '\`' + PREFIX + 'userinfo\`\n', true)
            .addField('Miscellaneous', '\`' + PREFIX + '8ball\`\n' + '\`' + PREFIX + 'coinflip\`\n' + '\`' + PREFIX + 'countdown\`\n' + '\`' + PREFIX + 'echo\`\n' + '\`' + PREFIX + 'hakai\`\n' + '\`' + PREFIX + 'lotto\`\n' + '\`' + PREFIX + 'rps\`\n' + '\`' + PREFIX + 'tts\`\n', true)
        message.channel.send({
            embed
        });
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}HOI`)) { //hoi
        message.channel.send('Sali.');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}HM`)) { //hm
        message.channel.send('Hm?');
    } else if (message.content.toUpperCase() === `${PREFIX}ICH`) { //ich
        message.channel.send('***ICH*** stahn im __Mittelpunkt!!!111!!1!!1__');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}ICHI`)) { //ichi
        message.channel.send('Bruchsch hilf? **ICH** cha der helfe.');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}INTERESSIERT`)) { //interessiert
        message.channel.send('Wie es Loch im Chopf.');
    } else if ((message.content.toUpperCase().startsWith(`${PREFIX}INYOURFACULTY`)) || (message.content.toUpperCase().startsWith(`${PREFIX}INYOURFAMILY`)) || (message.content.toUpperCase().startsWith(`${PREFIX}INYOURNAME`)) || (message.content.toUpperCase().startsWith(`${PREFIX}INYOURSPIRIT`))) { //inyour... commands
        message.channel.send('BECEASED!!!1!!!!111!!1!!!');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}IVAN`)) { //ivan
        message.channel.send('Hoi zämä, i bims, dr Ivam. I bi ä waschächtä Schwiizer wiä mr gseht. Wohne duän i ~~IM REICH~~ in Öschtriich, und cha ou nid Schwiizertüütsch. Ademerci.');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}JACOB`)) { //jacob
        message.channel.send('Jeg elsker dig ligesom du elsker min fugtig migmig.');
    } else if (message.content === `${PREFIX}JESUS`) { //jesus
        message.channel.send('**IN THE NAAAAME OF JESUS!!!!!!**');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}JESUSCHRIST`)) { //jesuschrist
        message.channel.send('is my nigga.');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}JOEL`)) { //joel
        message.channel.send('IcH bI dE jOeL uNd IcH gLaUb AlLeS wO mEr MiR sEiT.');
    } else if (message.content === `${PREFIX}KADDER`) { //kadder
        message.channel.send('Ich ha gern Klobürschtene.');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}KADDER2`)) { //kadder2
        message.channel.send('Tüend sie Wasser löse?');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}KSH`)) { //ksh
        message.channel.send('Da lernsch vil, und Matur beschtahsch grad.');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}LOTTO`)) { //lotto
        var input = message.content;
        var guess = input.split(" ");
        message.channel.send(lotto(guess[1]));
    } else if (message.content === `${PREFIX}LUCAS`) { //lucas
        message.channel.send('Dr Luckckas verdient viu a dr HSR.');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}LUCAS2`)) { //lucas2
        message.channel.send('exit');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}LUCAS3`)) { //lucas3
        message.channel.send('ICH chan auto fahre');
    } else if (message.content.toUpperCase().startsWith(MEMORY)) { //memory
        if ((message.author.id === OWNERID) || (message.author.id === LUCASID)) {
            const used = process.memoryUsage();
            var usage = [];
            for (let key in used) {
                var output = `${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB\n`;
                var output = `${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`;
                usage.push(output);
            }
            message.channel.send({
                embed: {
                    color: blue,
                    description: usage.toString(),
                    description: usage.join("\n")
                }
            });
        }
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}MILA`)) { //mila
        message.channel.send('__**ACHT**__');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}NOAH`)) { //noah
        message.channel.send('Wo isch de Noah?');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}OLI`)) { //oli
        message.channel.send('Ich bi sozial.');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}OSUPTIME`)) { //osuptime
        message.channel.send({
            embed: {
                color: blue,
                description: "Uptime of the operating system:\n**" + format(require('os').uptime()) + "**"
            }
        });
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}PING`)) { //ping
        message.channel.send('**PONG**' + ' `' + Math.floor(client.ping.toString()) + 'ms`');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}PPAP`)) { //ppap
        message.channel.send(':pen_fountain: :pineapple: :apple: :pen_fountain:');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}PUBG`)) { //pubg
        message.channel.send('1=0');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}RIP`)) { //rip
        message.channel.send('Rest In Peace.');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}ROLES`)) { //roles
        const embed = new Discord.RichEmbed()
            .setColor(blue)
            .setTimestamp()
            .setAuthor(message.guild.name, message.guild.iconURL)
            .addField('List of Roles', 'TBD');
        message.channel.send({
            embed
        });
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}RPS`)) { //rps
        var input = message.content;
        var clientInput = input.substr(5);
        message.channel.send({
            embed: {
                title: 'Result',
                color: blue,
                description: rpsPrint(clientInput, message.author.toString())
            }
        });
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}SERVERINFO`)) { //serverinfo
        const embed = new Discord.RichEmbed()
            .setColor(blue)
            .setTimestamp()
            .setAuthor(message.guild.name, message.guild.iconURL)
            .addField('ID', message.guild.id)
            .addField('Owner', message.guild.owner.user.tag)
            .addField('Created At', message.guild.createdAt)
            .addField('Region', message.guild.region)
            .addField('Verification Level', message.guild.verificationLevel)
            .addField('Member Count', message.guild.memberCount)
            .addField('Channels', message.guild.channels.size)
            .addField('Roles', message.guild.roles.size)
            .addField('Emojis', message.guild.emojis.size);
        message.channel.send({
            embed
        });
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}SNUS`)) { //snus
        const embed = new Discord.RichEmbed()
            .setTitle('Die Uhrzeit')
            .setColor(black)
            .setImage('http://www.odenssnus.eu/public/img/user/1026.png')
        message.channel.send({
            embed
        });
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}SORRY`)) { //sorry
        message.channel.send('Sorry?');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}STFU`)) { //stfu
        message.channel.send('Bitte, stfu.');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}THERMOS`)) { //thermos
        message.channel.send('Ich rauch mini Thermoschanne voll dure.');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}TOUBI`)) { //toubi
        message.channel.send('Hallo, ich heisse Toubi.');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}TTS`)) { //tts
        var input = message.content;
        var clientInput = input.substr(5);
        message.delete(200);
        setTimeout(function () {
            message.channel.send(clientInput, {
                tts: true
            });
        }, 300);
        logToChannel("Information", "TTS command has been used:\n" + clientInput, message.author.tag, message.author.displayAvatarURL);
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}UPTIME`)) { //uptime
        message.channel.send({
            embed: {
                color: blue,
                description: "Uptime of the bot process:\n**" + format(process.uptime()) + "**"
            }
        });
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}USERINFO`)) { //userinfo
        const embed = new Discord.RichEmbed()
            .setColor(blue)
            .setAuthor(message.author.username, message.author.avatarURL)
            .addField('Username', message.author.username)
            .addField('Discriminator', message.author.discriminator)
            .addField('ID', message.author.id)
            .setFooter('User created at: ' + message.author.createdAt);
        message.channel.send({
            embed
        });
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}VELO`)) { //velo
        message.channel.send('黒人が自転車を盗んだ');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}VN`)) { //vn
        const embed = new Discord.RichEmbed()
            .setTitle('Vape Nation')
            .setColor(green)
            .setImage('https://carboncostume.com/wordpress/wp-content/uploads/2016/04/vapenation.jpg')
        message.channel.send({
            embed
        });
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}WELTBILD`)) { //weltbild
        message.channel.send('"Du hesch es falsches Weltbild."');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}ZEIT`)) { //zeit
        message.channel.send('Neun Uhr Achtzig.');
    } else if (message.content.toUpperCase() === `${PREFIX}ZIIT`) { //ziit
        if (message.author.id === OWNERID) {
            const embed = new Discord.RichEmbed()
                .setTitle('Vape Nation')
                .setColor(green)
                .setImage('https://carboncostume.com/wordpress/wp-content/uploads/2016/04/vapenation.jpg')
            message.channel.send({
                embed
            });
        } else {
            const embed = new Discord.RichEmbed()
                .setTitle('Die Uhrzeit')
                .setColor(black)
                .setImage('http://www.odenssnus.eu/public/img/user/1026.png')
            message.channel.send({
                embed
            });
        }
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}ZIIT?`)) { //ziit?
        message.channel.send('Ja, was isch denn für Ziit?');
    } else if (message.content.toUpperCase().startsWith(`${PREFIX}ZOEL`)) { //zoel
        message.channel.send('Hoi zäme, ich bi de Zoel, freut mi.');
    }
});
