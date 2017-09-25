const Discord = require('discord.js');
const { Client, Util } = require('discord.js');
const client = new Discord.Client({ disableEveryone: true });
const { TOKEN, PREFIX, CHANNEL, OWNERID, LUCASID, YT_API } = require('./config');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const embed = new Discord.RichEmbed();
const youtube = new YouTube(YT_API);
const queue = new Map();

//const for admin commands
const SET_GAME = `${PREFIX}setGame`;
const PURGE = `${PREFIX}purge`;
const SET_AVATER = `${PREFIX}setAvatar`;
const SET_STATUS = `${PREFIX}setStatus`;
const RESTART = `${PREFIX}restart`;
const SHUTDOWN = `${PREFIX}shutdown`
const DELETE = `${PREFIX}delete`


//warn
client.on('warn', console.warn);

//error
client.on('error', console.error);

//ready
client.on('ready',() => {
  client.user.setGame('Work in Progress | Prefix: .');
  const channel = client.channels.get(CHANNEL);
  if (!channel) return;
  channel.send('Bot successfully initialized.');
  console.log('Bot ready.');
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
  if (!message.content.startsWith(PREFIX)) return;
  const args = message.content.split(' ');
  const searchString = args.slice(1).join(' ');
  const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
  const serverQueue = queue.get(message.guild.id);

  if (message.content.startsWith(`${PREFIX}play`)) {
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
          const playlist = await youtube.getPlaylist(url);
          const videos = await playlist.getVideos();
          for (const video of Object.values(videos)) {
            const video2 = await youtube.getVideoByID(video.id);
            await handleVideo(video2, message, voiceChannel, true);
          }
          return message.channel.send(`Playlist **${playlist.title}** has been added to the queue!`);
      } else {
          try {
            var video = await youtube.getVideo(url);
          } catch (error) {
              try {
                var videos = await youtube.searchVideos(searchString, 1);
                var video = await youtube.getVideoByID(videos[0].id);
              } catch (err) {
                  console.error(err);
                  return message.channel.send(':bangbang: **Could not get search results.**');
              }
          }
        return handleVideo(video, message, voiceChannel);
      }
  } else if (message.content.startsWith(`${PREFIX}skip`)) {
      if (!message.member.voiceChannel) return message.channel.send(':bangbang: **You are not in a voice channel!**');
      if (!serverQueue) return message.channel.send(':bangbang: **There is nothing playing!**');
      serverQueue.connection.dispatcher.end('Skip command has been used.');
      message.channel.send(':track_next: **Skipping...**');
      return;
  } else if ((message.content.startsWith(`${PREFIX}stop`)) || (message.content.startsWith(`${PREFIX}leave`))) {
      if (!message.member.voiceChannel) return message.channel.send(':bangbang: **You are not in a voice channel!**');
      if (!serverQueue) return message.channel.send(':bangbang: **There is nothing playing!**');
      serverQueue.songs = [];
      serverQueue.connection.dispatcher.end('Stop command has been used.');
      message.channel.send(':stop_button: **Successfully stopped.**');
      return;
  } else if (message.content.startsWith(`${PREFIX}volume`)) {
      if (!message.member.voiceChannel) return message.channel.send(':bangbang: **You are not in a voice channel!**');
      if (!serverQueue) return message.channel.send(':bangbang: **There is nothing playing!**');
      if (!args[1]) return message.channel.send(`:loud_sound: The current volume is: **${serverQueue.volume}**.`);
      serverQueue.volume = args[1];
      serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
      return message.channel.send(`:loud_sound: Set the volume to: **${args[1]}**.`);
  } else if (message.content.startsWith(`${PREFIX}np`)) {
      if (!serverQueue) return message.channel.send(':bangbang: **There is nothing playing.**');
      return message.channel.send(`:notes: Now playing: **${serverQueue.songs[0].title}**`);
  } else if (message.content.startsWith(`${PREFIX}queue`)) {
      if (!serverQueue) return message.channel.send(':bangbang: **There is nothing playing.**');
      return message.channel.send(`
__**Queue:**__
${serverQueue.songs.map(song => `**:arrow_right_hook:** ${song.title}`).join('\n')}

:notes: Now playing: **${serverQueue.songs[0].title}**
      `);
  } else if (message.content.startsWith(`${PREFIX}pause`)) {
      if (serverQueue && serverQueue.playing) {
        serverQueue.playing = false;
        serverQueue.connection.dispatcher.pause();
        return message.channel.send(':pause_button: **Successfully paused.**');
      }
      return message.channel.send(':bangbang: **There is nothing playing.**');
  } else if (message.content.startsWith(`${PREFIX}resume`)) {
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
          volume: 5,
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
client.on('guildMemberAdd', function(member) {
  // Send the message to a designated channel on a server
  const channel = member.guild.channels.find('name', 'announcements');
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(`Welcome to the server, ${member}`);
});

//commands
client.on('message', function(message) {
  if (message.author.bot) return;
  if (message.content.startsWith(SET_GAME)) { //setGame
    if ((message.author.id === OWNERID) || (message.author.id === LUCASID)) {
      var input = message.content;
      var clientInput = input.substr(9);
      client.user.setPresence({ game: { name: clientInput, type: 0 } });
    } else {
      message.channel.send('You are not authorized to use this command.');
    }
  } else if (message.content === PURGE) { //purge Messages
      if ((message.author.id === OWNERID) || (message.author.id === LUCASID)) {
        if (message.channel.type == 'text') {
            message.channel.fetchMessages()
              .then(messages => {
                message.channel.bulkDelete(messages);
                messagesDeleted = messages.array().length; // number of messages deleted
    
                // Logging the number of messages deleted on both the channel and console.
                message.channel.sendMessage("Deletion of messages successful. Total messages deleted: "+messagesDeleted);
                console.log('Deletion of messages successful. Total messages deleted: '+messagesDeleted)
              })
              .catch(err => {
                console.log('Error while doing Bulk Delete');
                console.log(err);
              });
          }
      } else {
        message.channel.send('You are not authorized to use this command.');
    }
  } else if (message.content.startsWith(SET_AVATER)) { //setAvatar
      if ((message.author.id === OWNERID) || (message.author.id === LUCASID)) {
        var input = message.content;
        var clientInput = input.substr(11);
        client.user.setAvatar(clientInput);
      } else {
        message.channel.send('You are not authorized to use this command.');
    }
  } else if (message.content.startsWith(SET_STATUS)) { //setStatus
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
        process.exit();
      } else {
        message.channel.send('You are not authorized to use this command.');
      }
  } else if (message.content.startsWith(SHUTDOWN)) { //shutdown
      if ((message.author.id === OWNERID) || (message.author.id === LUCASID)) {
        message.channel.send('Shutting down... **Please end process in task manager `node.exe`**');
        client.destroy((err) => {
          console.log(err);
        });
        exec('pm2 stop bot.js');
      } else {
        message.channel.send('You are not authorized to use this command.');
      }
  } else if (message.content.startsWith(DELETE)) {
        if ((message.author.id === OWNERID) || (message.author.id === LUCASID)) {
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
            }
        } else {
            message.channel.send('You are not authorized to use this command.');
        }
  } else if (message.content.startsWith(`${PREFIX}ping`)) { //ping
      message.channel.send('**PONG**' + ' `' + client.ping.toString() + 'ms`');
  } else if (message.content.startsWith(`${PREFIX}vn`)) { //vn
      embed.setTitle('Vape Nation');
      embed.setColor('#29ff00');
      embed.setImage('https://carboncostume.com/wordpress/wp-content/uploads/2016/04/vapenation.jpg');
      message.channel.send({ embed });
  } else if (message.content === `${PREFIX}ziit`) { //ziit
      embed.setTitle('Die Uhrzeit');
      embed.setColor('BLACK');
      embed.setImage('http://www.odenssnus.eu/public/img/user/1026.png');
      message.channel.send({ embed });
  } else if (message.content.startsWith(`${PREFIX}echo`)) { //echo
      var input = message.content;
      var clientInput = input.substr(6);
      message.delete(200);
      setTimeout(function(){ message.channel.send(clientInput); }, 300);
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
  } else if (message.content.startsWith(`${PREFIX}eis`)) { //eis
      message.channel.send('isch keis.');
  } else if (message.content === `${PREFIX}fabio`) { //fabio
      message.channel.send('De Vabio isch en chline Memer.');
  } else if (message.content.startsWith(`${PREFIX}fabio2`)) { //fabio2
      message.channel.send('Wie isch d\'Matur? - Isch fein gsi.');
  } else if (message.content.startsWith(`${PREFIX}fabiocsgo`)) { //fabiocsgo
      message.channel.send('High risk - no reward.');
  } else if (message.content.startsWith(`${PREFIX}fige`)) { //fige
      message.channel.send('De Feliks het en usprägte Orientierigssinn.');
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
