//requirements
let constants = require('./constants');
require('../bot');

//music stuff
musicCommands = function () {
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
                            var response = await message.channel.awaitMessages(msg2 => msg2.author.id === authorid && msg2.content > 0 && msg2.content < 6, {
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
        } else if (message.content.toUpperCase().startsWith(constants.MUSIC_QUEUE)) {
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
}