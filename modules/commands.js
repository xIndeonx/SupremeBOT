//requirements
let constants = require('./constants');
require('../bot');

//commands
customCommands = function () {
    constants.client.on('message', function (message) {
        if (message.author.bot) return;
        if (!message.content.toUpperCase().startsWith(constants.PREFIX)) return;
        if (!message.guild) return;
        if (message.content.toUpperCase().startsWith(`${constants.PREFIX}JOIN`)) {
            if (message.member.voiceChannel) {
                message.member.voiceChannel.join()
                    .then(connection => { // Connection is an instance of VoiceConnection
                        message.channel.send(':white_check_mark: I have successfully connected to the channel!');
                    })
                    .catch(console.log);
            } else {
                message.channel.send(':bangbang: You need to join a voice channel first!');
            }
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}VCLEAVE`)) {
            if (message.member.voiceChannel) {
                message.member.voiceChannel.leave();
                message.channel.send(':white_check_mark: I have successfully disconnected from the channel!');
            } else {
                message.channel.send(':bangbang: You are not in a voice channel!');
            }
        } else if (message.content.toUpperCase().startsWith(constants.EVAL)) { //eval
            if ((message.author.id === constants.OWNERID) || (message.author.id === constants.LUCASID)) {
                const args = message.content.split(' ').slice(1);
                try {
                    const code = args.join(' ');
                    var now = require('performance-now');
                    var start = now();
                    let evaled = eval(code);
                    var end = now();

                    if (typeof evaled !== 'string')
                        evaled = require('util').inspect(evaled);

                    message.channel.send({
                        embed: {
                            color: constants.green,
                            title: 'Success',
                            description: '\`\`\`xl\n' + clean(evaled) + '\`\`\`Took `' + (end - start).toFixed(3) + 'ms`'
                        }
                    });
                } catch (err) {
                    message.channel.send({
                        embed: {
                            color: constants.red,
                            title: 'ERROR',
                            description: `\`\`\`xl\n${clean(err)}\n\`\`\``
                        }
                    });
                }
            } else return;
        } else if (message.content.toUpperCase().startsWith(constants.SET_GAME)) { //setgame
            if ((message.author.id === constants.OWNERID) || (message.author.id === constants.LUCASID)) {
                var args = message.content.split(' ');
                var gameString = args.slice(1).join(' ');
                constants.client.user.setPresence({
                    game: {
                        name: gameString,
                        type: 0
                    }
                });
                message.delete(200);
                message.channel.send({
                        embed: {
                            color: constants.blue,
                            description: 'Successfully set game to \`' + gameString + '\`'
                        }
                    })
                    .then(sent => sent.delete(5000));
            } else {
                message.channel.send('You are not authorized to use this command.');
            }
        } else if (message.content.toUpperCase().startsWith(constants.SET_AVATAR)) { //setavatar
            if ((message.author.id === constants.OWNERID) || (message.author.id === constants.LUCASID)) {
                var args = message.content.split(' ');
                var urlString = args.slice(1).join(' ');
                constants.client.user.setAvatar(urlString);
                message.delete(200);
                message.channel.send({
                        embed: {
                            color: constants.blue,
                            description: 'Successfully set the avatar.'
                        }
                    })
                    .then(sent => sent.delete(5000));
            } else {
                message.channel.send('You are not authorized to use this command.');
            }
        } else if (message.content.toUpperCase().startsWith(constants.SET_STATUS)) { //setstatus
            if ((message.author.id === constants.OWNERID) || (message.author.id === constants.LUCASID)) {
                var args = message.content.split(' ');
                var statusString = args.slice(1).join(' ');
                if (statusString === ('dnd') || statusString === ('online') || statusString === ('idle') || statusString === ('invisible')) {
                    constants.client.user.setStatus(statusString);
                    message.delete(200);
                    message.channel.send({
                            embed: {
                                color: constants.blue,
                                description: 'Successfully set status to \`' + statusString + '\`.'
                            }
                        })
                        .then(sent => sent.delete(5000));
                } else return message.channel.send('Wrong input. Please use `online`, `idle`, `dnd`, or `invisible`.');
            } else {
                message.channel.send('You are not authorized to use this command.');
            }
        } else if (message.content.toUpperCase().startsWith(constants.RESTART)) { //restart
            if ((message.author.id === constants.OWNERID) || (message.author.id === constants.LUCASID)) {
                message.channel.send('Restarting...');
                setTimeout(function () {
                    process.exit();
                }, 1000);
            } else {
                message.channel.send('You are not authorized to use this command.');
            }
        } else if (message.content.toUpperCase().startsWith(constants.SHUTDOWN)) { //shutdown
            if ((message.author.id === constants.OWNERID) || (message.author.id === constants.LUCASID)) {
                message.channel.send('Shutting down...');
                constants.client.destroy((err) => {
                    logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL);
                });
                process.exitCode = 1;
            } else {
                message.channel.send('You are not authorized to use this command.');
            }
        } else if (message.content.toUpperCase().startsWith(constants.DELETE)) { //delete
            if ((message.member.permissions.has('ADMINISTRATOR')) || (message.author.id === constants.OWNERID) || (message.author.id === constants.OWNERID)) {
                if (message.channel.type == 'text') {
                    var args = message.content.split(' ');
                    var input = args.slice(1).join(' ');
                    let messagecount = parseInt(input);
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
                                    color: constants.blue,
                                    description: 'You deleted: ' + (messagecount - 1) + ' message(s)'
                                }
                            })
                            .then(sent => sent.delete(5000));
                        logToChannel('Information', 'Guild Name: *' + message.guild.name + '*\nGuild ID: *' + message.guild.id + '*\n\nDeleted Messages.\nCount: **' + (messagecount - 1) + '**', message.author.tag, message.author.displayAvatarURL);
                    }
                }
            } else {
                message.channel.send('You are not authorized to use this command.');
            }
        } else if (message.content.toUpperCase().startsWith(constants.PURGE)) { //purge
            if ((message.member.permissions.has('ADMINISTRATOR')) || (message.author.id === constants.OWNERID) || (message.author.id === constants.OWNERID)) {
                if (message.channel.type == 'text') {
                    message.channel.fetchMessages()
                        .then(messages => {
                            message.channel.bulkDelete(messages);
                            messagesDeleted = messages.array().length; // number of messages deleted
                            // Logging the number of messages deleted on both the channel and console.
                            message.channel.send({
                                    embed: {
                                        color: constants.blue,
                                        description: 'Purge successful: ' + messagesDeleted + ' message(s) fetched and deleted.'
                                    }
                                })
                                .then(sent => sent.delete(5000));
                            logToChannel('Information', 'Guild Name: *' + message.guild.name + '*\nGuild ID: *' + message.guild.id + '*\n\nPurge successful: **' + messagesDeleted + '**', message.author.tag, message.author.displayAvatarURL);
                        })
                        .catch(err => {
                            logToChannel('Error', 'Guild Name: *' + message.guild.name + '*\nGuild ID: *' + message.guild.id + '*\n\nError:\n' + err, message.author.tag, message.author.displayAvatarURL);
                        });
                }
            } else {
                message.channel.send('You are not authorized to use this command.');
            }
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}1=0`)) { //1=0
            message.channel.send('1=0');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}8BALL`)) { //8ball
            message.channel.send({
                embed: {
                    title: 'The magic 8ball says...',
                    description: eightball(),
                    color: eightballColorDecider()
                }
            });
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}ADEMERCI`)) { //ademerci
            message.channel.send('Ademerci');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}AHA`)) { //aha
            message.channel.send('Aha');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}ALINA`)) { //alina
            message.channel.send('Daddy?');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}ANDREAS`)) { //andreas
            message.channel.send('I heisse Andreas, nöd Oliver.');
        } else if ((message.content.toUpperCase().startsWith(`${constants.PREFIX}ANDY`)) || (message.content.toUpperCase().startsWith(`${constants.PREFIX}ANDI`))) { //andy / andi
            message.channel.send('De Andi füut sech elei in Bärn.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}AUÄ`)) { //auä
            message.channel.send('Auä!');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}AUTISMUS`)) { //autismus
            message.channel.send('Autismus ist eine weitverbreitete Krankheit, vor allem im schweizerischen Bubikon.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}AUTIST`)) { //autist
            message.channel.send('Wüki?!?!?');
        } else if (message.content.toUpperCase() === `${constants.PREFIX}BAUMI`) { //baumi
            message.channel.send('Try using `.baumi1`, `.baumi2`, `.baumi3`, or `.baumi4`!');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}BAUMI1`)) { //baumi1
            message.channel.send("Cha de Alain scho d'Uhr lese?");
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}BAUMI2`)) { //baumi2
            message.channel.send('Wetsch es Zäpfli?');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}BAUMI3`)) { //baumi3
            message.channel.send('<@' + LUCASID + '>, ab id Duschi');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}BAUMI4`)) { //baumi4
            message.channel.send('Chopf im Sofa.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}BITTE`)) { //bitte
            message.channel.send('Bitte gerngscheh.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}BOOGEYMAN`)) { //boogeyman
            message.channel.send('Kuka pelkää musta miestä?');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}BZZ`)) { //bzz
            message.channel.send('Bescht Schuel vom Kanton Horge.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}CHANNELINFO`)) { //channelinfo
            const embed = new constants.Discord.RichEmbed()
                .setColor(constants.blue)
                .setAuthor(message.channel.name, message.guild.iconURL)
                .addField('Name', message.channel.name, true)
                .addField('ID', message.channel.id, true)
                .addField('Topic', message.channel.topic, true)
                .addField('Type', message.channel.type, true)
                .addField('Position', message.channel.position, true)
                .addBlankField(true)
                .setFooter('Channel created: ' + getDay(message.channel.createdAt.getDay()) + ' ' + message.channel.createdAt.getMonth() + '/' + message.channel.createdAt.getDate() + '/' + message.channel.createdAt.getFullYear() + ' at ' + message.channel.createdAt.getHours() + 'H ' + message.channel.createdAt.getMinutes() + 'M');
            message.channel.send({
                embed
            });
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}CHANNELS`)) { //channels
            const embed = new constants.Discord.RichEmbed()
                .setColor(constants.blue)
                .setTimestamp()
                .setAuthor(message.guild.name, message.guild.iconURL)
                .addField('List of Channels', 'TBD');
            message.channel.send({
                embed
            });
        } else if (message.content.toUpperCase() === `${constants.PREFIX}CLAUDIO`) { //claudio
            message.channel.send('De Clö isch immer am schaffe.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}CLAUDIOLINO`)) { //claudiolino
            message.channel.send('Clö, bitte, stfu.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}CLÖ`)) { //clö
            message.channel.send('Ich ha gseit **NEI**.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}COINFLIP`)) { //coinflip
            var result = coinFlip(message.content);
            message.channel.send({
                embed: {
                    title: 'Result',
                    color: constants.blue,
                    description: result
                }
            });
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}COUNTDOWN`)) { //countdown
            var args = message.content.split(' ');
            var countString = args.slice(1).join(' ');
            let count = parseInt(countString);
            if (isNaN(count)) {
                message.channel.send('Could not create countdown. Please enter a valid number.');
                return;
            } else {
                message.channel.send({
                    embed: {
                        color: constants.blue,
                        title: 'Countdown',
                        description: 'Countdown started. This will take approximately **' + format(countString) + '**'
                    }
                }).then(sentmsg => {
                    var i = countString;
                    var interval = setInterval(function () {
                        sentmsg.edit({
                            embed: {
                                color: constants.blue,
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
                                    color: constants.blue,
                                    title: 'Countdown',
                                    description: 'Countdown ended. Total time wasted: **' + format(countString) + '**'
                                }
                            });
                            clearInterval(interval);
                        }
                    }(countString));
                });
            }
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}CUSTOM`)) { //custom
            const embed = new constants.Discord.RichEmbed()
                .setColor(constants.red)
                .setTimestamp()
                .setAuthor(constants.client.user.username, constants.client.user.displayAvatarURL)
                .setTitle('Custom Commands')
                .setDescription('This is a complete list of all custom commands.')
                .addField('A-E', '\`' + constants.PREFIX + '1=0\`\n' + '\`' + constants.PREFIX + 'ademerci\`\n' + '\`' + constants.PREFIX + 'aha\`\n' + '\`' + constants.PREFIX + 'alina\`\n' + '\`' + constants.PREFIX + 'andreas\`\n' + '\`' + constants.PREFIX + 'andi\`\n' + '\`' + constants.PREFIX + 'andy\`\n' + '\`' + constants.PREFIX + 'auä\`\n' + '\`' + constants.PREFIX + 'autismus\`\n' + '\`' + constants.PREFIX + 'autist\`\n' + '\`' + constants.PREFIX + 'baumi\`\n' + '\`' + constants.PREFIX + 'baumi1\`\n' + '\`' + constants.PREFIX + 'baumi2\`\n' + '\`' + constants.PREFIX + 'baumi3\`\n' + '\`' + constants.PREFIX + 'baumi4\`\n' + '\`' + constants.PREFIX + 'bitte\`\n' + '\`' + constants.PREFIX + 'boogeyman\`\n' + '\`' + constants.PREFIX + 'bzz\`\n' + '\`' + constants.PREFIX + 'claudio\`\n' + '\`' + constants.PREFIX + 'claudiolino\`\n' + '\`' + constants.PREFIX + 'clö\`\n' + '\`' + constants.PREFIX + 'danke\`\n' + '\`' + constants.PREFIX + 'dinimom\`\n' + '\`' + constants.PREFIX + 'doni\`\n' + '\`' + constants.PREFIX + 'eine\`\n' + '\`' + constants.PREFIX + 'eis\`\n', true)
                .addField('E-J', '\`' + constants.PREFIX + 'esgahtnöd\`\n' + '\`' + constants.PREFIX + 'exit\`\n' + '\`' + constants.PREFIX + 'fabio\`\n' + '\`' + constants.PREFIX + 'fabio2\`\n' + '\`' + constants.PREFIX + 'fabiocsgo\`\n' + '\`' + constants.PREFIX + 'fige\`\n' + '\`' + constants.PREFIX + 'filip\`\n' + '\`' + constants.PREFIX + 'game\`\n' + '\`' + constants.PREFIX + 'getshiton\`\n' + '\`' + constants.PREFIX + 'gopfeteli\`\n' + '\`' + constants.PREFIX + 'gschicht\`\n' + '\`' + constants.PREFIX + 'hoi\`\n' + '\`' + constants.PREFIX + 'hm\`\n' + '\`' + constants.PREFIX + 'ich\`\n' + '\`' + constants.PREFIX + 'ichi\`\n' + '\`' + constants.PREFIX + 'interessiert\`\n' + '\`' + constants.PREFIX + 'inyourfaculty\`\n' + '\`' + constants.PREFIX + 'inyourfamily\`\n' + '\`' + constants.PREFIX + 'inyourname\`\n' + '\`' + constants.PREFIX + 'inyourspirit\`\n' + '\`' + constants.PREFIX + 'ivan\`\n' + '\`' + constants.PREFIX + 'jacob\`\n' + '\`' + constants.PREFIX + 'jesus\`\n' + '\`' + constants.PREFIX + 'jesuschrist\`\n' + '\`' + constants.PREFIX + 'joel\`\n', true)
                .addField('K-Z', '\`' + constants.PREFIX + 'kadder\`\n' + '\`' + constants.PREFIX + 'kadder2\`\n' + '\`' + constants.PREFIX + 'ksh\`\n' + '\`' + constants.PREFIX + 'lucas\`\n' + '\`' + constants.PREFIX + 'lucas2\`\n' + '\`' + constants.PREFIX + 'lucas3\`\n' + '\`' + constants.PREFIX + 'merci\`\n' + '\`' + constants.PREFIX + 'mila\`\n' + '\`' + constants.PREFIX + 'noah\`\n' + '\`' + constants.PREFIX + 'oli\`\n' + '\`' + constants.PREFIX + 'ppap\`\n' + '\`' + constants.PREFIX + 'pubg\`\n' + '\`' + constants.PREFIX + 'rip\`\n' + '\`' + constants.PREFIX + 'snus\`\n' + '\`' + constants.PREFIX + 'sorry\`\n' + '\`' + constants.PREFIX + 'stfu\`\n' + '\`' + constants.PREFIX + 'thermos\`\n' + '\`' + constants.PREFIX + 'toubi\`\n' + '\`' + constants.PREFIX + 'velo\`\n' + '\`' + constants.PREFIX + 'vn\`\n' + '\`' + constants.PREFIX + 'weltbild\`\n' + '\`' + constants.PREFIX + 'zeit\`\n' + '\`' + constants.PREFIX + 'ziit\`\n' + '\`' + constants.PREFIX + 'ziit?\`\n' + '\`' + constants.PREFIX + 'zoel\`\n', true)
            message.channel.send({
                embed
            });
        } else if ((message.content.toUpperCase().startsWith(`${constants.PREFIX}DANKE`)) || (message.content.toUpperCase().startsWith(`${constants.PREFIX}MERCI`))) { //danke / merci
            const embed = new constants.Discord.RichEmbed()
                .setTitle('Merci viu mol')
                .setColor(constants.blue)
                .setImage('https://t3.ftcdn.net/jpg/00/88/04/32/240_F_88043202_HGdQvy3vJoSYVznZXBx1n2JNvDhSk8Ss.jpg')
            message.channel.send({
                embed
            });
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}DINIMOM`)) { //dinimom
            message.channel.send('WÜKI?!?!?!??');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}DONI`)) { //doni
            message.channel.send('Heb fressi oder ich küss dich.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}ECHO`)) { //echo
            var args = message.content.split(' ');
            var string = args.slice(1).join(' ');
            message.delete(200);
            setTimeout(function () {
                message.channel.send(string);
            }, 300);
            logToChannel("Information", "Guild Name: *" + message.guild.name + "*\nGuild ID: *" + message.guild.id + "*\n\nEcho command has been used:\n**\"**" + string + "**\"**", message.author.tag, message.author.displayAvatarURL);
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}EINE`)) { //eine
            message.channel.send('isch keine.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}EIS`)) { //eis
            message.channel.send('isch keis.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}ESGAHTNÖD`)) { //esgahtnöd
            message.channel.send('Es gaaaaaaaht nöööd.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}EXIT`)) { //exit
            message.channel.send('Selbstmordorganisation');
        } else if (message.content.toUpperCase() === `${constants.PREFIX}FABIO`) { //fabio
            message.channel.send('De Vabio isch en chline Memer.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}FABIO2`)) { //fabio2
            message.channel.send('Wie isch d\'Matur? - Mis Lebe isch erfüllt.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}FABIOCSGO`)) { //fabiocsgo
            message.channel.send('High risk - no reward.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}FIGE`)) { //fige
            message.channel.send('De Feliks het en usprägte Orientierigssinn.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}FILIP`)) { //filip
            message.channel.send('Uf de Chopf gheit.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}GAME`)) { //game
            message.channel.send('Gits eis?');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}GETSHITON`)) { //getshiton
            message.channel.send('Catch it hard!');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}GOPFETELI`)) { //gopfeteli
            message.channel.send('Gopfeteli');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}GSCHICHT`)) { //gschicht
            message.channel.send('*glernt*');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}HAKAI`)) { //hakai
            if (message.mentions.users.size == 0) return message.channel.send('Did not specify a user.');
            if (message.mentions.users.size == 1) {
                if (message.mentions.users.first() != message.author.toString()) {
                    return message.channel.send(message.mentions.users.first() + ' has been destroyed by ' + message.author.toString());
                } else return message.channel.send("You cannot destroy yourself, " + message.author.toString());
            }
            if (message.mentions.users.size > 1) return message.channel.send('Specified too many users.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}HELP`)) { //help
            const embed = new constants.Discord.RichEmbed()
                .setColor(constants.red)
                .setTimestamp()
                .setAuthor(constants.client.user.username, constants.client.user.displayAvatarURL)
                .setTitle('Commands')
                .setDescription('This is a complete list of commands currently available for the bot.\nFor a list of custom commands, use \`' + constants.PREFIX + 'custom\`')
                .addField('Owner', '\`' + constants.PREFIX + 'eval\`\n' + '\`' + constants.PREFIX + 'restart\`\n' + '\`' + constants.PREFIX + 'setavatar\`\n' + '\`' + constants.PREFIX + 'setgame\`\n' + '\`' + constants.PREFIX + 'setstatus\`\n' + '\`' + constants.PREFIX + 'shutdown\`\n', true)
                .addField('Admin', '\`' + constants.PREFIX + 'delete\`\n' + '\`' + constants.PREFIX + 'purge\`\n', true)
                .addBlankField(true)
                .addField('Music', '\`' + constants.PREFIX + 'join\`\n' + '\`' + constants.PREFIX + 'leave\`\n' + '\`' + constants.PREFIX + 'np\`\n' + '\`' + constants.PREFIX + 'pause\`\n' + '\`' + constants.PREFIX + 'play\`\n' + '\`' + constants.PREFIX + 'queue\`\n' + '\`' + constants.PREFIX + 'resume\`\n' + '\`' + constants.PREFIX + 'skip\`\n' + '\`' + constants.PREFIX + 'stop\`\n' + '\`' + constants.PREFIX + 'vcleave\`\n' + '\`' + constants.PREFIX + 'volume\`\n', true)
                .addField('Info', '\`' + constants.PREFIX + 'channelinfo\`\n' + '\`' + constants.PREFIX + 'channels\`\n' + '\`' + constants.PREFIX + 'custom\`\n' + '\`' + constants.PREFIX + 'help\`\n' + '\`' + constants.PREFIX + 'memory\`\n' + '\`' + constants.PREFIX + 'osuptime\`\n' + '\`' + constants.PREFIX + 'ping\`\n' + '\`' + constants.PREFIX + 'roles\`\n' + '\`' + constants.PREFIX + 'serverinfo\`\n' + '\`' + constants.PREFIX + 'uptime\`\n' + '\`' + constants.PREFIX + 'userinfo\`\n', true)
                .addField('Miscellaneous', '\`' + constants.PREFIX + '8ball\`\n' + '\`' + constants.PREFIX + 'coinflip\`\n' + '\`' + constants.PREFIX + 'countdown\`\n' + '\`' + constants.PREFIX + 'echo\`\n' + '\`' + constants.PREFIX + 'hakai\`\n' + '\`' + constants.PREFIX + 'lotto\`\n' + '\`' + constants.PREFIX + 'rps\`\n' + '\`' + constants.PREFIX + 'tts\`\n', true)
            message.channel.send({
                embed
            });
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}HOI`)) { //hoi
            message.channel.send('Sali.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}HM`)) { //hm
            message.channel.send('Hm?');
        } else if (message.content.toUpperCase() === `${constants.PREFIX}ICH`) { //ich
            message.channel.send('***ICH*** stahn im __Mittelpunkt!!!111!!1!!1__');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}ICHI`)) { //ichi
            message.channel.send('Bruchsch hilf? **ICH** cha der helfe.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}INTERESSIERT`)) { //interessiert
            message.channel.send('Wie es Loch im Chopf.');
        } else if ((message.content.toUpperCase().startsWith(`${constants.PREFIX}INYOURFACULTY`)) || (message.content.toUpperCase().startsWith(`${constants.PREFIX}INYOURFAMILY`)) || (message.content.toUpperCase().startsWith(`${constants.PREFIX}INYOURNAME`)) || (message.content.toUpperCase().startsWith(`${constants.PREFIX}INYOURSPIRIT`))) { //inyour... commands
            message.channel.send('BECEASED!!!1!!!!111!!1!!!');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}IVAN`)) { //ivan
            message.channel.send('Hoi zämä, i bims, dr Ivam. I bi ä waschächtä Schwiizer wiä mr gseht. Wohne duän i ~~IM REICH~~ in Öschtriich, und cha ou nid Schwiizertüütsch. Ademerci.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}JACOB`)) { //jacob
            message.channel.send('Jeg elsker dig ligesom du elsker min fugtig migmig.');
        } else if (message.content === `${constants.PREFIX}JESUS`) { //jesus
            message.channel.send('**IN THE NAAAAME OF JESUS!!!!!!**');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}JESUSCHRIST`)) { //jesuschrist
            message.channel.send('is my nigga.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}JOEL`)) { //joel
            message.channel.send('IcH bI dE jOeL uNd IcH gLaUb AlLeS wO mEr MiR sEiT.');
        } else if (message.content === `${constants.PREFIX}KADDER`) { //kadder
            message.channel.send('Ich ha gern Klobürschtene.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}KADDER2`)) { //kadder2
            message.channel.send('Tüend sie Wasser löse?');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}KSH`)) { //ksh
            message.channel.send('Da lernsch vil, und Matur beschtahsch grad.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}LOTTO`)) { //lotto
            var input = message.content;
            var guess = input.split(" ");
            message.channel.send(lotto(guess[1]));
        } else if (message.content.toUpperCase() === `${constants.PREFIX}LUCAS`) { //lucas
            message.channel.send('Dr Luckckas verdient viu a dr HSR.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}LUCAS2`)) { //lucas2
            message.channel.send('exit');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}LUCAS3`)) { //lucas3
            message.channel.send('ICH chan auto fahre');
        } else if (message.content.toUpperCase().startsWith(constants.MEMORY)) { //memory
            const used = process.memoryUsage();
            var usage = [];
            for (let key in used) {
                var output = `${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB\n`;
                var output = `${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`;
                usage.push(output);
            }
            message.channel.send({
                embed: {
                    color: constants.blue,
                    description: usage.toString(),
                    description: usage.join("\n")
                }
            });
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}MILA`)) { //mila
            message.channel.send('__**ACHT**__');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}NOAH`)) { //noah
            message.channel.send('Wo isch de Noah?');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}OLI`)) { //oli
            message.channel.send('Ich bi sozial.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}OSUPTIME`)) { //osuptime
            message.channel.send({
                embed: {
                    color: constants.blue,
                    description: 'Uptime of the operating system:\n**' + format(require('os').uptime()) + '**'
                }
            });
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}PING`)) { //ping
            message.channel.send('**PONG**' + ' `' + Math.floor(constants.client.ping.toString()) + 'ms`');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}PPAP`)) { //ppap
            message.channel.send(':pen_fountain: :pineapple: :apple: :pen_fountain:');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}PUBG`)) { //pubg
            message.channel.send('1=0');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}RIP`)) { //rip
            message.channel.send('Rest In Peace.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}ROLES`)) { //roles
            const embed = new constants.Discord.RichEmbed()
                .setColor(constants.blue)
                .setTimestamp()
                .setAuthor(message.guild.name, message.guild.iconURL)
                .addField('List of Roles', 'TBD');
            message.channel.send({
                embed
            });
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}RPS`)) { //rps
            var args = message.content.split(' ');
            var string = args.slice(1).join(' ');
            message.channel.send({
                embed: {
                    title: 'Result',
                    color: constants.blue,
                    description: rpsPrint(string, message.author.toString())
                }
            });
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}SERVERINFO`)) { //serverinfo
            const embed = new constants.Discord.RichEmbed()
                .setColor(constants.blue)
                .setAuthor(message.guild.name, message.guild.iconURL)
                .addField('Name', message.guild.name, true)
                .addField('ID', message.guild.id, true)
                .addField('Owner', message.guild.owner.user.tag, true)
                .addField('Member Count', message.guild.memberCount, true)
                .addField('Region', message.guild.region, true)
                .addField('Verification Level', message.guild.verificationLevel, true)
                .addField('Channels', message.guild.channels.size, true)
                .addField('Roles', message.guild.roles.size, true)
                .addField('Emojis', message.guild.emojis.size, true)
                .setFooter('Guild created: ' + getDay(message.guild.createdAt.getDay()) + ' ' + message.guild.createdAt.getMonth() + '/' + message.guild.createdAt.getDate() + '/' + message.guild.createdAt.getFullYear() + ' at ' + message.guild.createdAt.getHours() + 'H ' + message.guild.createdAt.getMinutes() + 'M');
            message.channel.send({
                embed
            });
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}SNUS`)) { //snus
            const embed = new constants.Discord.RichEmbed()
                .setTitle('Die Uhrzeit')
                .setColor(constants.black)
                .setImage('http://www.odenssnus.eu/public/img/user/1026.png')
            message.channel.send({
                embed
            });
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}SORRY`)) { //sorry
            message.channel.send('Sorry?');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}STFU`)) { //stfu
            message.channel.send('Bitte, stfu.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}THERMOS`)) { //thermos
            message.channel.send('Ich rauch mini Thermoschanne voll dure.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}TOUBI`)) { //toubi
            message.channel.send('Hallo, ich heisse Toubi.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}TTS`)) { //tts
            var args = message.content.split(' ');
            var string = args.slice(1).join(' ');
            message.delete(200);
            setTimeout(function () {
                message.channel.send(string, {
                    tts: true
                });
            }, 300);
            logToChannel('Information', 'Guild Name: *' + message.guild.name + '*\nGuild ID: *' + message.guild.id + '*\n\nTTS command has been used:\n**\"**' + string + '**\"**', message.author.tag, message.author.displayAvatarURL);
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}UPTIME`)) { //uptime
            message.channel.send({
                embed: {
                    color: constants.blue,
                    description: 'Uptime of the bot process:\n**' + format(process.uptime()) + '**'
                }
            });
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}USERINFO`)) { //userinfo
            const embed = new constants.Discord.RichEmbed()
                .setColor(constants.blue)
                .setAuthor(message.author.username, message.author.avatarURL)
                .addField('Username', message.author.username, true)
                .addField('Discriminator', message.author.discriminator, true)
                .addField('ID', message.author.id, true)
                .setFooter('User created: ' + getDay(message.author.createdAt.getDay()) + ' ' + message.author.createdAt.getMonth() + '/' + message.author.createdAt.getDate() + '/' + message.author.createdAt.getFullYear() + ' at ' + message.author.createdAt.getHours() + 'H ' + message.author.createdAt.getMinutes() + 'M');
            message.channel.send({
                embed
            });
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}VELO`)) { //velo
            message.channel.send('黒人が自転車を盗んだ');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}VN`)) { //vn
            const embed = new constants.Discord.RichEmbed()
                .setTitle('Vape Nation')
                .setColor(constants.green)
                .setImage('https://carboncostume.com/wordpress/wp-content/uploads/2016/04/vapenation.jpg')
            message.channel.send({
                embed
            });
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}WELTBILD`)) { //weltbild
            message.channel.send('"Du hesch es falsches Weltbild."');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}ZEIT`)) { //zeit
            message.channel.send('Neun Uhr Achtzig.');
        } else if (message.content.toUpperCase() === `${constants.PREFIX}ZIIT`) { //ziit
            if (message.author.id === constants.OWNERID) {
                const embed = new constants.Discord.RichEmbed()
                    .setTitle('Vape Nation')
                    .setColor(constants.green)
                    .setImage('https://carboncostume.com/wordpress/wp-content/uploads/2016/04/vapenation.jpg')
                message.channel.send({
                    embed
                });
            } else {
                const embed = new constants.Discord.RichEmbed()
                    .setTitle('Die Uhrzeit')
                    .setColor(constants.black)
                    .setImage('http://www.odenssnus.eu/public/img/user/1026.png')
                message.channel.send({
                    embed
                });
            }
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}ZIIT?`)) { //ziit?
            message.channel.send('Ja, was isch denn für Ziit?');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}ZOEL`)) { //zoel
            message.channel.send('Hoi zäme, ich bi de Zoel, freut mi.');
        }
    });
}