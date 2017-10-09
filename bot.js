//const
const Discord = require('discord.js');
const { Client, Util } = require('discord.js');
const client = new Discord.Client({ disableEveryone: true });
const { TOKEN, PREFIX, CHANNEL, OWNERID, LUCASID, YT_API } = require('./config');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const embed = new Discord.RichEmbed();
const youtube = new YouTube(YT_API);
const queue = new Map();
const GAME = 'Work in Progress | Prefix: .';

//const for admin commands
const SET_GAME = `${PREFIX}setgame`;
const SET_AVATAR = `${PREFIX}setavatar`;
const SET_STATUS = `${PREFIX}setstatus`;
const RESTART = `${PREFIX}restart`;
const SHUTDOWN = `${PREFIX}shutdown`;
const DELETE = `${PREFIX}delete`;
const PURGE = `${PREFIX}purge`;
const MEMORY = `${PREFIX}memory`;
const EVAL = `${PREFIX}eval`;

//const for music commands
const MUSIC_PLAY = `${PREFIX}play`;
const MUSIC_STOP = `${PREFIX}stop`;
const MUSIC_SKIP = `${PREFIX}skip`;
const MUSIC_PAUSE = `${PREFIX}pause`;
const MUSIC_RESUME = `${PREFIX}resume`;
const MUSIC_VOLUME = `${PREFIX}volume`;
const MUSIC_NP = `${PREFIX}np`;
const MUSIC_QUEUE = `${PREFIX}queue`;

//warn
client.on('warn', logToChannel("Warning", "Unknown warning", client.user.username, client.user.displayAvatarURL));

//error
client.on('error', logToChannel("Error", "Unknown error", client.user.username, client.user.displayAvatarURL));

//ready
client.on('ready',() => {
    client.user.setPresence({ game: { name: GAME, type: 0 } });
    const channel = client.channels.get(CHANNEL);
    if (!channel) return;
    channel.send('Bot successfully initialized.');
    //logToChannel('Bot successfully initialized.');
});

//disconnect
client.on('disconnect', () => logToChannel("Information", 'Bot has disconnected...', client.user.username, client.user.displayAvatarURL));

//reconnecting
client.on('reconnecting', () => logToChannel("Information", "Bot is reconnecting...", client.user.username, client.user.displayAvatarURL));

//bot token login
client.login(TOKEN);

//music stuff
client.on('message', async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;
    const args = message.content.split(' ');
    const searchString = args.slice(1).join(' ');
    const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
    const serverQueue = queue.get(message.guild.id);

    if (message.content.startsWith(MUSIC_PLAY)) {
        const voiceChannel = message.member.voiceChannel;
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
                    var videos = await youtube.searchVideos(searchString, 1);
                    var video = await youtube.getVideoByID(videos[0].id);
                } catch (err) {
                    logToChannel("Error", err, message.author.username, message.author.displayAvatarURL);
                    message.channel.stopTyping(true);
                    return message.channel.send(':bangbang: **Could not get search results.**');
                }
            }
            return handleVideo(video, message, voiceChannel);
        }
    } else if (message.content.startsWith(MUSIC_SKIP)) {
        if (!message.member.voiceChannel) return message.channel.send(':bangbang: **You are not in a voice channel!**');
        if (!serverQueue) return message.channel.send(':bangbang: **There is nothing playing!**');
        setTimeout(function(){ serverQueue.connection.dispatcher.end('Skip command has been used.'); }, 500);
        message.channel.send(':track_next: **Skipping...**');
        return;
    } else if ((message.content.startsWith(MUSIC_STOP)) || (message.content.startsWith(`${PREFIX}leave`))) {
        if (!message.member.voiceChannel) return message.channel.send(':bangbang: **You are not in a voice channel!**');
        if (!serverQueue) return message.channel.send(':bangbang: **There is nothing playing!**');
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end('Stop command has been used.');
        message.channel.send(':stop_button: **Successfully stopped.**');
        return;
    } else if (message.content.startsWith(MUSIC_VOLUME)) {
        if (!message.member.voiceChannel) return message.channel.send(':bangbang: **You are not in a voice channel!**');
        if (!serverQueue) return message.channel.send(':bangbang: **There is nothing playing!**');
        if (!args[1]) return message.channel.send(`:loud_sound: The current volume is: **${serverQueue.volume}**.`);
        if(args[1]) {
            if (args[1] > 10) {
                serverQueue.volume = 10;
                serverQueue.connection.dispatcher.setVolumeLogarithmic(10 / 5);
                return message.channel.send(':loud_sound: Set the volume to the maximum: **10**.');
            } else if (args[1] <= 10) {
                serverQueue.volume = args[1];
                serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
                return message.channel.send(`:loud_sound: Set the volume to: **${args[1]}**.`);
            } /*else if (serverQueue.volume === args[1]) {
                return message.channel.send(`:loud_sound: The volume is already on **${args[1]}**.`);
            }*/
        }
    } else if (message.content.startsWith(MUSIC_NP)) {
        if (!serverQueue) return message.channel.send(':bangbang: **There is nothing playing.**');
        return message.channel.send(`:notes: Now playing: **${serverQueue.songs[0].title}**`);
    } else if (message.content.startsWith(MUSIC_QUEUE)) {
        if (!serverQueue) return message.channel.send(':bangbang: **There is nothing playing.**');
        return message.channel.send(`
__**Queue:**__
${serverQueue.songs.map(song => `**:arrow_right_hook:** ${song.title}`).join('\n')}

:notes: Now playing: **${serverQueue.songs[0].title}**
      `);
    } else if (message.content.startsWith(MUSIC_PAUSE)) {
        if (serverQueue && serverQueue.playing) {
        serverQueue.playing = false;
        serverQueue.connection.dispatcher.pause();
        return message.channel.send(':pause_button: **Successfully paused.**');
        }
        return message.channel.send(':bangbang: **There is nothing playing.**');
    } else if (message.content.startsWith(MUSIC_RESUME)) {
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
    logToChannel("Information", video, message.author.username, message.author.displayAvatarURL);
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
            logToChannel("Error", `:bangbang: **Could not join the voice channel:** ${error}`, message.author.username, message.author.displayAvatarURL);
            queue.delete(message.guild.id);
            return message.channel.send(`:bangbang: **Could not join the voice channel:** ${error}`);
        }
    } else {
        serverQueue.songs.push(song);
        logToChannel("Information", serverQueue.songs, message.author.username, message.author.displayAvatarURL);
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
    logToChannel("Information", serverQueue.songs, message.author.username, message.author.displayAvatarURL);
    const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
        .on('end', reason => {
            if (reason === 'Stream is not generating quickly enough.') logToChannel("Information", "Song ended!", message.author.username, message.author.displayAvatarURL);
            else logToChannel("Information", reason, message.author.username, message.author.displayAvatarURL);
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on('error', error => logToChannel("Error", error, message.author.username, message.author.displayAvatarURL);
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`:arrow_forward: Started playing: **${song.title}**`);
}

//message on member join
client.on('guildMemberAdd', function(member) {
    // Send the message to a designated channel on a server
    const channel = member.guild.channels.find('name', 'announcements');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`Welcome to the server, ${member}!`);
});

//function for correct time format
function format(seconds){
    function pad(s){
        return (s < 10 ? '0' : '') + s;
    }
    var hours = Math.floor(seconds / (60*60));
    var minutes = Math.floor(seconds % (60*60) / 60);
    var seconds = Math.floor(seconds % 60);
  
    return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
}

//function to log
function logToChannel(title, logMessage, messageAuthor, picture){
    
        switch(title) {
            case "Information":
                color = 3447003;
                console.log(logMessage);
                break;
            case "Warning":
                color = 0xf9bd31;
                console.warn(logMessage);
                break;
            case "Error":
                color = 0xff2b30;
                console.error(logMessage);
                break;
            default:
                color = 000000;
        }
    
        const embed = new Discord.RichEmbed()
        .setTitle(title)
        .setAuthor(messageAuthor)
        .setColor(color)
        .setDescription(logMessage)
        .setThumbnail(picture)
        .setTimestamp();
        client.channels.get("341732211612975104").send({embed});
        
}
//function for eval command
function clean(text) {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
  }

//commands
client.on('message', function(message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;
    if (!message.guild) return;
    if (message.content.startsWith(`${PREFIX}join`)) {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join()
                .then(connection => { // Connection is an instance of VoiceConnection
                message.channel.send(':GreenTick: I have successfully connected to the channel!');
                })
            .catch(logToChannel("Information", "Connected to channel", message.author.username, message.author.displayAvatarURL));
        } else {
            message.channel.send(':bangbang: You need to join a voice channel first!');
        }
    } else if (message.content.startsWith(`${PREFIX}vcleave`)) {
        if(message.member.voiceChannel) {
            message.member.voiceChannel.leave();
            message.channel.send(':GreenTick: I have successfully disconnected from the channel!');
        } else {
            message.channel.send(':bangbang: You are not in a voice channel!');
        }
    } else if (message.content.startsWith(EVAL)) { //eval
        if (message.author.id === OWNERID) {
            const args = message.content.split(" ").slice(1);
            try {
                const code = args.join(" ");
                let evaled = eval(code);
          
                if (typeof evaled !== "string")
                    evaled = require("util").inspect(evaled);
          
                embed.setColor('#00ff00');
                embed.setTitle('Success');
                embed.setDescription('\`\`\`xl\n' + clean(evaled) + '\`\`\`');
                message.channel.send({ embed });
              } catch (err) {
                    embed.setColor('#ff0000');
                    embed.setTitle('ERROR');
                    embed.setDescription(`\`\`\`xl\n${clean(err)}\n\`\`\``);
                    message.channel.send({ embed });
              }
        } else return;
    } else if (message.content.startsWith(SET_GAME)) { //setgame
        if ((message.author.id === OWNERID) || (message.author.id === LUCASID)) {
            var input = message.content;
            var clientInput = input.substr(9);
            client.user.setPresence({ game: { name: clientInput, type: 0 } });
        } else {
            message.channel.send('You are not authorized to use this command.');
        }
    } else if (message.content.startsWith(SET_AVATAR)) { //setavatar
        if ((message.author.id === OWNERID) || (message.author.id === LUCASID)) {
            var input = message.content;
            var clientInput = input.substr(11);
            client.user.setAvatar(clientInput);
        } else {
            message.channel.send('You are not authorized to use this command.');
        }
    } else if (message.content.startsWith(SET_STATUS)) { //setstatus
        if ((message.author.id === OWNERID) || (message.author.id === LUCASID)) {
            var input = message.content;
            var clientInput = input.substr(11);
            if(clientInput === ('dnd') || ('online') || ('idle') || ('invisible')){
                client.user.setStatus(clientInput);
            } else {
            message.channel.send('Wrong input. Please use `online`, `idle`, `dnd`, or `invisible`.');
            }
        } else {
            message.channel.send('You are not authorized to use this command.');
        }
    } else if (message.content.startsWith(RESTART)) { //restart
        if ((message.author.id === OWNERID) || (message.author.id === LUCASID)) {
            message.channel.send('Restarting...');
            setTimeout(function(){ process.exit(); }, 1000);
        } else {
            message.channel.send('You are not authorized to use this command.');
        }
    } else if (message.content.startsWith(SHUTDOWN)) { //shutdown
        if ((message.author.id === OWNERID) || (message.author.id === LUCASID)) {
            message.channel.send('Shutting down...');
            client.destroy((err) => {
                logToChannel("Error", err, message.author.username, message.author.displayAvatarURL);
            });
            process.exitCode = 1;
        } else {
            message.channel.send('You are not authorized to use this command.');
        }
    } else if (message.content.startsWith(DELETE)) { //delete
        if ((message.member.permissions.hasPermission('ADMINISTRATOR')) || (message.author.id === OWNERID) || (message.author.id === OWNERID)) {
            if (message.channel.type == 'text') {
                var input = message.content;
                var clientInput = input.substr(8);
                let messagecount = parseInt(clientInput);
                if(isNaN(messagecount)){
                    message.channel.send('Could not delete messages. Please enter a valid number.');
                    return;
                } else {
                    messagecount = messagecount + 1;
                    message.channel.fetchMessages({ limit: messagecount })
                        .then(messages => message.channel.bulkDelete(messages));
                    message.channel.send({embed: {
                    color: 3447003,
                    description: "You deleted: " + (messagecount-1) +" message(s)"}})
                        .then(sent => sent.delete(5000));
                    logToChannel("Information", "Deleted Messages.\nCount: **" + (messagecount-1) +"**", message.author.username, message.author.displayAvatarURL);
                }
            } 
        } else {
            message.channel.send('You are not authorized to use this command.');
        }
    } else if (message.content.startsWith(PURGE)) { //purge
        if ((message.member.permissions.hasPermission('ADMINISTRATOR')) || (message.author.id === OWNERID) || (message.author.id === OWNERID)) {
            if (message.channel.type == 'text') {
                message.channel.fetchMessages()
                    .then(messages => {
                        message.channel.bulkDelete(messages);
                        messagesDeleted = messages.array().length; // number of messages deleted
                        // Logging the number of messages deleted on both the channel and console.
                        message.channel.send({embed: {
                            color: 3447003,
                            description: "You deleted: " + messagesDeleted +" message(s)"}})
                                .then(sent => sent.delete(5000));
                        logToChannel("Information", "Deletion of messages successful. Total messages deleted: " + messagesDeleted, message.author.username, message.author.displayAvatarURL);
                    })
                    .catch(err => {
                        logToChannel("Error", err, message.author.username, message.author.displayAvatarURL);
                    });
            }
        } else {
            message.channel.send('You are not authorized to use this command.');
        }
    } else if (message.content.startsWith(MEMORY)) { //memory
        if ((message.author.id === OWNERID) || (message.author.id === LUCASID)) {
            const used = process.memoryUsage();
            for (let key in used) {
                message.channel.send(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
            }
        }
    } else if (message.content.startsWith(`${PREFIX}ping`)) { //ping
        message.channel.send('**PONG**' + ' `' + Math.floor(client.ping.toString()) + 'ms`');
    } else if (message.content.startsWith(`${PREFIX}vn`)) { //vn
        embed.setTitle('Vape Nation');
        embed.setColor('#29ff00');
        embed.setImage('https://carboncostume.com/wordpress/wp-content/uploads/2016/04/vapenation.jpg');
        message.channel.send({ embed });
    } else if (message.content.startsWith(`${PREFIX}snus`)) { //snus
        embed.setTitle('Die Uhrzeit');
        embed.setColor('BLACK');
        embed.setImage('http://www.odenssnus.eu/public/img/user/1026.png');
        message.channel.send({ embed });
    } else if (message.content === `${PREFIX}ziit`) { //ziit
        if (message.author.id === OWNERID) {
            embed.setTitle('Vape Nation');
            embed.setColor('#29ff00');
            embed.setImage('https://carboncostume.com/wordpress/wp-content/uploads/2016/04/vapenation.jpg');
            message.channel.send({ embed });
        } else {
            embed.setTitle('Die Uhrzeit');
            embed.setColor('BLACK');
            embed.setImage('http://www.odenssnus.eu/public/img/user/1026.png');
            message.channel.send({ embed });
        }
    } else if (message.content.startsWith(`${PREFIX}echo`)) { //echo
        var input = message.content;
        var clientInput = input.substr(6);
        message.delete(200);
        setTimeout(function(){ message.channel.send(clientInput); }, 300);
    } else if (message.content.startsWith(`${PREFIX}tts`)) { //tts
        var input = message.content;
        var clientInput = input.substr(5);
        message.delete(200);
        setTimeout(function(){ message.channel.send(clientInput, {
            tts: true
        }); }, 300);
    } else if (message.content.startsWith(`${PREFIX}uptime`)) { //uptime
        message.channel.send({embed: {
            color: 3447003,
            description: "Uptime of the bot process:\n**" + format(process.uptime()) + "**"
            }}
        );
    } else if (message.content.startsWith(`${PREFIX}osuptime`)) { //os uptime
        message.channel.send({embed: {
            color: 3447003,
            description: "Uptime of the operating system:\n**" + format(require('os').uptime()) + "**"
            }}
        );
    } else if (message.content.startsWith(`${PREFIX}countdown`)) { //countdown
        var input = message.content;
        var clientInput = input.substr(11);
        let count = parseInt(clientInput);
        if(isNaN(count)){
            message.channel.send('Could not create countdown. Please enter a valid number.');
            return;
        } else {
            message.channel.send({embed: {
                color: 3447003,
                title: 'Countdown',
                description: 'Countdown started. This will take approximately **' + format(clientInput) + '**'
            }}).then(sentmsg => {
                var i = clientInput;
                var interval = setInterval(function() {
                    sentmsg.edit({embed: {
                        color: 3447003,
                        title: 'Countdown',
                        description: '```' + format(i) + '```'
                        }}
                    );
                }, 3000);
                (function fn() {
                    if (i > 0) {
                        setTimeout(function() {
                            fn(--i);
                        }, 1000);
                    }
                    if(i === 0) {
                        sentmsg.edit({embed: {
                            color: 3447003,
                            title: 'Countdown',
                            description: 'Countdown ended. Total time wasted: **' + format(clientInput) + '**'
                        }});
                        clearInterval(interval);
                    }
                }(clientInput));
            });
        }
    } else if (message.content.startsWith(`${PREFIX}hakai`)) { //hakai
        if (message.mentions.users.size == 0) return message.channel.send('Did not specify a user.');
        if (message.mentions.users.size == 1) return message.channel.send(message.mentions.members.first() + ' has been destroyed by <@' + message.author.id + '>.');
        if (message.mentions.users.size > 1) return message.channel.send('Specified too many users.');
        //You cannot destroy yourself, check if message.author.id same as mentioned
    } else if (message.content.startsWith(`${PREFIX}serverinfo`)) { //serverinfo
        const embed = new Discord.RichEmbed()
        .setColor(3447003)
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
        message.channel.send({ embed });
    } else if (message.content.startsWith(`${PREFIX}userinfo`)) { //userinfo
        const embed = new Discord.RichEmbed()
        .setColor(3447003)
        .setAuthor(message.author.username, message.author.avatarURL)
        .addField('Username', message.author.username)
        .addField('Discriminator', message.author.discriminator)
        .addField('ID', message.author.id)
        .setFooter('User created at: ' + message.author.createdAt);
        message.channel.send({ embed });
    } else if (message.content.startsWith(`${PREFIX}channelinfo`)) { //channelinfo
        const embed = new Discord.RichEmbed()
        .setColor(3447003)
        .setTimestamp()
        .setAuthor(message.channel.name, message.guild.iconURL)
        .addField('Name', message.channel.name)
        .addField('ID', message.channel.id)
        .addField('Topic', message.channel.topic)
        .addField('Type', message.channel.type)
        .addField('Created At', message.channel.createdAt)
        .addField('Position', message.channel.position);
        message.channel.send({ embed });
    } else if (message.content.startsWith(`${PREFIX}roles`)) { //roles
        const embed = new Discord.RichEmbed()
        .setColor(3447003)
        .setTimestamp()
        .setAuthor(message.guild.name, message.guild.iconURL)
        .addField('List of Roles', 'TBD');
        message.channel.send({ embed });
    } else if (message.content.startsWith(`${PREFIX}help`)) { //help
        message.channel.send('Help page is being worked on.');
    } else if (message.content.startsWith(`${PREFIX}1=0`)) { //1=0
        message.channel.send('1=0');
    } else if (message.content.startsWith(`${PREFIX}alina`)) { //alina
        message.channel.send('Daddy?');
    } else if ((message.content.startsWith(`${PREFIX}andy`)) || (message.content.startsWith(`${PREFIX}andi`))) { //andy/andi
        message.channel.send('De Andi füut sech elei in Bärn.');
    } else if (message.content.startsWith(`${PREFIX}autismus`)) { //autismus
        message.channel.send('Autismus ist eine weitverbreitete Krankheit, vor allem im schweizerischen Bubikon.');
    } else if (message.content.startsWith(`${PREFIX}autist`)) { //autist
        message.channel.send('Wüki?!?!?');
    } else if (message.content === `${PREFIX}baumi`) { //baumi
        message.channel.send('Try using `.baumi1`, `.baumi2`, `.baumi3`, or `.baumi4`!');
    } else if (message.content.startsWith(`${PREFIX}baumi1`)) { //baumi1
        message.channel.send("Cha de Alain scho d'Uhr lese?");
    } else if (message.content.startsWith(`${PREFIX}baumi2`)) { //baumi2
        message.channel.send('Wetsch es Zäpfli?');
    } else if (message.content.startsWith(`${PREFIX}baumi3`)) { //baumi3
        message.channel.send('<@'+LUCASID+'>, ab id Duschi');
    } else if (message.content.startsWith(`${PREFIX}baumi4`)) { //baumi4
        message.channel.send('Chopf im Sofa.');
    } else if (message.content.startsWith(`${PREFIX}bitte`)) { //bitte
        message.channel.send('**NEI**');
    } else if (message.content.startsWith(`${PREFIX}boogeyman`)) { //boogeyman
        message.channel.send('Kuka pelkää musta miestä?');
    } else if (message.content === `${PREFIX}claudio`) { //claudio
        message.channel.send('De Clö isch immer am schaffe.');
    } else if (message.content.startsWith(`${PREFIX}claudiolino`)) { //claudiolino
        message.channel.send('Clö, bitte, stfu.');
    } else if (message.content.startsWith(`${PREFIX}clö`)) { //clö
        message.channel.send('Ich ha gseit **NEI**.');
    } else if ((message.content.startsWith(`${PREFIX}danke`)) || (message.content.startsWith(`${PREFIX}merci`))) { //danke
        embed.setTitle('Merci viu mol');
        embed.setColor('#001fff');
        embed.setImage('https://t3.ftcdn.net/jpg/00/88/04/32/240_F_88043202_HGdQvy3vJoSYVznZXBx1n2JNvDhSk8Ss.jpg');
        message.channel.send({ embed });
    } else if (message.content.startsWith(`${PREFIX}dinimom`)) { //dinimom
        message.channel.send('WÜKI?!?!?!??');
    } else if (message.content.startsWith(`${PREFIX}doni`)) { //doni
        message.channel.send('Heb fressi oder ich küss dich.');
    } else if (message.content.startsWith(`${PREFIX}eine`)) { //eine
        message.channel.send('isch keine.');
    } else if (message.content.startsWith(`${PREFIX}eis`)) { //eis
        message.channel.send('isch keis.');
    } else if (message.content.startsWith(`${PREFIX}exit`)) { //exit
        message.channel.send('Selbstmordorganisation');
    } else if (message.content === `${PREFIX}fabio`) { //fabio
        message.channel.send('De Vabio isch en chline Memer.');
    } else if (message.content.startsWith(`${PREFIX}fabio2`)) { //fabio2
        message.channel.send('Wie isch d\'Matur? - Mis Lebe isch erfüllt.');
    } else if (message.content.startsWith(`${PREFIX}fabiocsgo`)) { //fabiocsgo
        message.channel.send('High risk - no reward.');
    } else if (message.content.startsWith(`${PREFIX}fige`)) { //fige
        message.channel.send('De Feliks het en usprägte Orientierigssinn.');
    } else if (message.content.startsWith(`${PREFIX}filip`)) { //filip
        message.channel.send('Uf de Chopf gheit.');
    } else if (message.content.startsWith(`${PREFIX}game`)) { //game
        message.channel.send('Gits eis?');
    } else if (message.content.startsWith(`${PREFIX}gschicht`)) { //gschicht
        message.channel.send('*glernt*');
    } else if (message.content.startsWith(`${PREFIX}hm`)) { //gschicht
        message.channel.send('Hm?');
    } else if (message.content === `${PREFIX}ich`) { //ich
        message.channel.send('***ICH*** stahn im __Mittelpunkt!!!111!!1!!1__');
    } else if (message.content.startsWith(`${PREFIX}ichi`)) { //ichi
        message.channel.send('Bruchsch hilf? **ICH** cha der helfe.');
    } else if (message.content.startsWith(`${PREFIX}interessiert`)) { //interessiert
        message.channel.send('Wie es Loch im Chopf.');
    } else if (message.content.startsWith(`${PREFIX}inyourfaculty`)) { //inyourfaculty
        message.channel.send('BECEASED!!!1!!!!111!!1!!!');
    } else if (message.content.startsWith(`${PREFIX}inyourfamily`)) { //inyourfamily
        message.channel.send('BECEASED!!!1!!!!111!!1!!!');
    } else if (message.content.startsWith(`${PREFIX}inyourname`)) { //inyourname
        message.channel.send('BECEASED!!!1!!!!111!!1!!!');
    } else if (message.content.startsWith(`${PREFIX}inyourspirit`)) { //inyourspirit
        message.channel.send('BECEASED!!!1!!!!111!!1!!!');
    } else if (message.content.startsWith(`${PREFIX}ivan`)) { //ivan
        message.channel.send('Hoi zämä, i bims, dr Ivam. I bi ä waschächtä Schwiizer wiä mr gseht. Wohne duän i ~~IM REICH~~ in Öschtriich, und cha ou nid Schwiizertüütsch. Ademerci.');
    } else if (message.content.startsWith(`${PREFIX}jacob`)) { //jacob
        message.channel.send('Jeg elsker dig ligesom du elsker min fugtig migmig.');
    } else if (message.content === `${PREFIX}jesus`) { //jesus
        message.channel.send('**IN THE NAAAAME OF JESUS!!!!!!**');
    } else if (message.content.startsWith(`${PREFIX}jesuschrist`)) { //jesuschrist
        message.channel.send('is my nigga.');
    } else if (message.content.startsWith(`${PREFIX}joel`)) { //joel
        message.channel.send('IcH bI dE jOeL uNd IcH gLaUb AlLeS wO mEr MiR sEiT.');
    } else if (message.content === `${PREFIX}kadder`) { //kadder
        message.channel.send('Ich ha gern Klobürschtene.');
    } else if (message.content.startsWith(`${PREFIX}kadder2`)) { //kadder2
        message.channel.send('Tüend sie Wasser löse?');
    } else if (message.content === `${PREFIX}lucas`) { //lucas
        message.channel.send('Dr Luckckas verdient viu a dr HSR.');
    } else if (message.content.startsWith(`${PREFIX}lucas2`)) { //lucas2
        message.channel.send('exit');
    } else if (message.content.startsWith(`${PREFIX}lucas3`)) { //lucas3
        message.channel.send('ICH chan auto fahre');
    } else if (message.content.startsWith(`${PREFIX}mila`)) { //mila
        message.channel.send('__**ACHT**__');
    } else if (message.content.startsWith(`${PREFIX}noah`)) { //noah
        message.channel.send('Wo isch de Noah?');
    } else if (message.content.startsWith(`${PREFIX}oli`)) { //oli
        message.channel.send('Ich bi sozial.');
    } else if (message.content.startsWith(`${PREFIX}ppap`)) { //ppap
        message.channel.send(':pen_fountain: :pineapple: :apple: :pen_fountain:');
    } else if (message.content.startsWith(`${PREFIX}pubg`)) { //pubg
        message.channel.send('1=0');
    } else if (message.content.startsWith(`${PREFIX}stfu`)) { //stfu
        message.channel.send('Bitte, stfu.');
    } else if (message.content.startsWith(`${PREFIX}thermos`)) { //thermos
        message.channel.send('Ich rauch mini Thermoschanne voll dure.');
    } else if (message.content.startsWith(`${PREFIX}toubi`)) { //toubi
        message.channel.send('Hallo, ich heisse Toubi.');
    } else if (message.content.startsWith(`${PREFIX}velo`)) { //velo
        message.channel.send('黒人が自転車を盗んだ');
    } else if (message.content.startsWith(`${PREFIX}weltbild`)) { //weltbild
        message.channel.send('"Du hesch es falsches Weltbild."');
    } else if (message.content.startsWith(`${PREFIX}zeit`)) { //zeit
        message.channel.send('Neun Uhr Achtzig.');
    } else if (message.content.startsWith(`${PREFIX}ziit?`)) { //ziit?
        message.channel.send('Ja, was isch denn für Ziit?');
    } else if (message.content.startsWith(`${PREFIX}zoel`)) { //zoel
        message.channel.send('Hoi zäme, ich bi de Zoel, freut mi.');
    }
});
