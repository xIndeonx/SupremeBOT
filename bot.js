//const
let constants = require('./constants');
require('./commands');
//warn
constants.client.on('warn', console.warn);
//error
constants.client.on('error', console.error);

//ready
constants.client.on('ready', () => {
    constants.client.user.setPresence({
        game: {
            name: constants.GAME,
            type: 0
        }
    });
    logToChannel("Information", "Bot successfully initialized.", constants.client.user.tag, constants.client.user.displayAvatarURL);
});

//disconnect
constants.client.on('disconnect', () => console.log('Bot has disconnected...'));

//reconnecting
constants.client.on('reconnecting', () => console.log('Bot is reconnecting...'));

//bot token login
constants.client.login(constants.TOKEN);

//music stuff
constants.client.on('message', async message => {
    if (message.author.bot) return;
    if (!message.content.toUpperCase().startsWith(constants.PREFIX)) return;
    const args = message.content.split(' ');
    const searchString = args.slice(1).join(' ');
    const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
    const serverQueue = constants.queue.get(message.guild.id);

    if (message.content.toUpperCase().startsWith(constants.MUSIC_PLAY)) {
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
            const playlist = await constants.youtube.getPlaylist(url);
            const videos = await playlist.getVideos();
            for (const video of Object.values(videos)) {
                const video2 = await constants.youtube.getVideoByID(video.id);
                await handleVideo(video2, message, voiceChannel, true);
            }
            message.channel.stopTyping(true);
            return message.channel.send(`Playlist **${constants.playlist.title}** has been added to the queue!`);
        } else {
            try {
                var video = await constants.youtube.getVideo(url);
            } catch (error) {
                try {
                    var videos = await constants.youtube.searchVideos(searchString, 5);
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
                    var video = await constants.youtube.getVideoByID(videos[videoIndex - 1].id);
                } catch (err) {
                    console.error(err);
                    constants.airbrake.notify(err);
                    message.channel.stopTyping(true);
                    return message.channel.send(':bangbang: **Could not get search results.**');
                }
            }
            return handleVideo(video, message, voiceChannel);
        }
    } else if (message.content.toUpperCase().startsWith(constants.MUSIC_SKIP)) {
        if (!message.member.voiceChannel) return message.channel.send(':bangbang: **You are not in a voice channel!**');
        if (!serverQueue) return message.channel.send(':bangbang: **There is nothing playing!**');
        setTimeout(function () {
            serverQueue.connection.dispatcher.end('Skip command has been used.');
        }, 500);
        message.channel.send(':track_next: **Skipping...**');
        return;
    } else if ((message.content.toUpperCase().startsWith(constants.MUSIC_STOP)) || (message.content.toUpperCase().startsWith(`${constants.PREFIX}leave`))) {
        if (!message.member.voiceChannel) return message.channel.send(':bangbang: **You are not in a voice channel!**');
        if (!serverQueue) return message.channel.send(':bangbang: **There is nothing playing!**');
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end('Stop command has been used.');
        message.channel.send(':stop_button: **Successfully stopped.**');
        return;
    } else if (message.content.toUpperCase().startsWith(constants.MUSIC_VOLUME)) {
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
    } else if (message.content.toUpperCase().startsWith(constants.MUSIC_NP)) {
        if (!serverQueue) return message.channel.send(':bangbang: **There is nothing playing.**');
        return message.channel.send(`:notes: Now playing: **${serverQueue.songs[0].title}**`);
    } else if (message.content.toUpperCase().startsWith(MUSIC_QUEUE)) {
        if (!serverQueue) return message.channel.send(':bangbang: **There is nothing playing.**');
        let index = 0;
        var queuelist = `\n${serverQueue.songs.map(song => `${++index} - ${song.title}`).join('\n')}`;
        return message.channel.send({
            embed: {
                title: 'Queue',
                color: constants.blue,
                description: `\`\`\`xl
${queuelist}
            \`\`\``,
                footer: {
                    text: `Now playing: ${serverQueue.songs[0].title}`
                }
            }
        });
    } else if (message.content.toUpperCase().startsWith(constants.MUSIC_PAUSE)) {
        if (serverQueue && serverQueue.playing) {
            serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause();
            return message.channel.send(':pause_button: **Successfully paused.**');
        }
        return message.channel.send(':bangbang: **There is nothing playing.**');
    } else if (message.content.toUpperCase().startsWith(constants.MUSIC_RESUME)) {
        if (serverQueue && !serverQueue.playing) {
            serverQueue.playing = true;
            serverQueue.connection.dispatcher.resume();
            return message.channel.send(':arrow_forward: **Successfully resumed.**');
        }
        return message.channel.send(':bangbang: **There is nothing playing.**');
    }
    return;
});

handleVideo = async function(video, message, voiceChannel, playlist = false) {
    const serverQueue = queue.get(message.guild.id);
    console.log(video);
    const song = {
        id: video.id,
        title: constants.Util.escapeMarkdown(video.title),
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
        constants.queue.set(message.guild.id, queueConstruct);
        queueConstruct.songs.push(song);
        try {
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            play(message.guild, queueConstruct.songs[0]);
        } catch (error) {
            console.error(`:bangbang: **Could not join the voice channel:** ${error}`);
            constants.airbrake.notify(error);
            constants.queue.delete(message.guild.id);
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

play = function(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        constants.queue.delete(guild.id);
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
constants.client.on('guildMemberAdd', function (member) {
    // Send the message to a designated channel on a server
    const channel = member.guild.channels.find('name', 'announcements');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`Welcome to the server, ${member}!`);
});

//function for correct time format
format = function(seconds) {
    function pad(s) {
        return (s < 10 ? '0' : '') + s;
    }
    var hours = Math.floor(seconds / (60 * 60));
    var minutes = Math.floor(seconds % (60 * 60) / 60);
    var seconds = Math.floor(seconds % 60);

    return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
}

//function for logging
logToChannel = function(title, logMessage, messageAuthor, picture) {

    switch (title) {
        case "Information":
            color = constants.blue;
            console.log(logMessage);
            break;
        case "Warning":
            color = constants.orange;
            console.warn(logMessage);
            break;
        case "Error":
            color = constants.red;
            console.error(logMessage);
            constants.airbrake.notify(logMessage);
            break;
        default:
            color = black;
    }

    const embed = new constants.Discord.RichEmbed()
        .setTitle(title)
        .setAuthor(messageAuthor)
        .setColor(color)
        .setDescription(logMessage)
        .setThumbnail(picture)
        .setTimestamp();
    constants.client.channels.get(constants.BOT_CHANNEL).send({
        embed
    });

}

//function for coinflip
coinFlip = function(coinFlipMessage) {
    const coinflipEmbed = new constants.Discord.RichEmbed()
        .setDescription(`${constants.PREFIX}coinflip firstCondition secondCondition **OR** ${constants.PREFIX}coinflip`)
        .setColor(constants.blue);
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
rpsGenerator = function() {

    var rps = Math.floor((Math.random() * 3) + 1);
    if (rps == 1) {
        return "Rock";
    } else if (rps == 2) {
        return "Paper";
    } else {
        return "Scissor";
    }
}

rpsBattle = function(botRPS, userRPS) {

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

rpsPrint = function(userRPS, usertag) {

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
eightball = function() {

    var answer = Math.floor((Math.random() * 10) + 1);
    var answerChoice = Math.floor((Math.random() * 8) + 1);
    if (answer <= 5) {
        constants.isYes = "YES";
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
        constants.isYes = "NO";
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

eightballColorDecider = function() {
    if (constants.isYes == "YES") {
        return constants.green;
    } else if (constants.isYes == "VAPEIO") {
        return constants.yellow;
    } else {
        return constants.red;
    }
}

//function for lotto
lotto = function(userGuess) {
    if (!userGuess || isNaN(userGuess)) {
        return `Please use the command like this: \`${constants.PREFIX}lotto number\``;
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

//function for blackjack
blackJack = function() {

    var value1 = blackJackCardGenerator();
    var value2 = blackJackCardGenerator();
    var result = value1 + value2;
    var drewThis = "You drew: " + value1 + " and " + value2 + " = " + result;
    if (result > 21) {
        return drewThis + "\n" + "You're **OUT**";
    } else if (result === 21) {
        return drewThis + "\n" + "**BLACKJACK**";
    } else {
        return drewThis + "\n" + "Do you wish to draw another card? Y/N";
    }
}

blackJackCardGenerator = function() {

    var cardNumber = Math.floor((Math.random() * 15));
    return cardValues[cardNumber];

}

//function for eval command
clean = function(text) {
    if (typeof (text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}

commands();