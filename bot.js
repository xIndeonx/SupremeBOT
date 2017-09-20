const Discord = require('discord.js');
const client = new Discord.Client({ disableEveryone: true });
const embed = new Discord.RichEmbed();

const { Client } = require('discord.js');
const { TOKEN, PREFIX, CHANNEL, OWNERID, LUCASID } = require('./config');
const ytdl = require('ytdl-core');

const queue = new Map();
//const Manager = new Discord.ShardingManager('./bot.js', {totalShards: "auto", token: settings.token});

client.on('warn', console.warn);

client.on('error', console.error);

client.on('ready',() => {
  console.log('Bot ready.');
  client.user.setGame('Work in Progress');
  client.user.setStatus("dnd");
  const channel = client.channels.get(CHANNEL);
  if (!channel) return;
  channel.send('Bot successfully initialized.');
});

client.on('disconnect', () => console.log('Bot has disconnected from the channel!'));

client.on('reconnecting', () => console.log('Bot is reconnecting!'));

//bot token login
client.login(TOKEN);

//shards
//Manager.spawn();

//restart command
client.on('message', function(message) {
  if (message.author.bot) return;
  if (message.content.startsWith(`${PREFIX}restart`)) {
    if ((message.author.id === OWNERID) || (message.author.id === LUCASID)) {
      message.channel.send('Restarting...');
      process.exit();
    } else {
      message.channel.send('You are not authorized to use this command.');
    }
  }
});

//shutdown command
client.on('message', function(message) {
  if (message.author.bot) return;
  if (message.content.startsWith(`${PREFIX}shutdown`)) {
    if ((message.author.id === OWNERID) || (message.author.id === LUCASID)) {
      message.channel.send('Shutting down... **Please end process in task manager `node.exe`**');
      client.destroy((err) => {
        console.log(err);
      });
      exec('pm2 stop bot.js');
    } else {
      message.channel.send('You are not authorized to use this command.');
    }
  }
});

//voice channel join & leave
client.on('message', function(message) {
  // Voice only works in guilds, if the message does not come from a guild,
  // we ignore it
  if (!message.guild) return;

  if (message.content.startsWith(`${PREFIX}vcjoin`)) {
    // Only try to join the sender's voice channel if they are in one themselves
    if (message.member.voiceChannel) {
      message.member.voiceChannel.join()
        .then(connection => { // Connection is an instance of VoiceConnection
          message.channel.send('I have successfully connected to the channel!');
        })
        .catch(console.log);
    } else {
      message.channel.send('You need to join a voice channel first!');
    }
  }

  if (message.content.startsWith(`${PREFIX}vcleave`)) {
    if(message.member.voiceChannel) {
      message.member.voiceChannel.leave();
      message.channel.send('I have successfully disconnected from the channel!');
    }
  }
});

client.on('message', async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;
  const args = message.content.split(' ');
  const serverQueue = queue.get(message.guild.id);

  if (message.content.startsWith(`${PREFIX}play`)) {
      const voiceChannel = message.member.voiceChannel;
      if (!voiceChannel) return message.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
      const permissions = voiceChannel.permissionsFor(message.client.user);
      if (!permissions.has('CONNECT')) {
          return message.channel.send('I cannot connect to your voice channel!');
      }
      if (!permissions.has('SPEAK')) {
          return message.channel.send('I cannot speak in your voice channel!');
      }

      const songInfo = await ytdl.getInfo(args[1]);
      const song = {
          title: songInfo.title,
          url: songInfo.video_url
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
              console.error(`I could not join the voice channel: ${error}`);
              queue.delete(message.guild.id);
              return message.channel.send(`I could not join the voice channel: ${error}`);
          }
      } else {
          serverQueue.songs.push(song);
          console.log(serverQueue.songs);
          return message.channel.send(`**${song.title}** has been added to the queue!`);
      }

      return;
  } else if (message.content.startsWith(`${PREFIX}skip`)) {
      if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
      if (!serverQueue) return message.channel.send('There is nothing playing that I could skip for you.');
      serverQueue.connection.dispatcher.end();
      return;
  } else if (message.content.startsWith(`${PREFIX}stop`)) {
      if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
      if (!serverQueue) return message.channel.send('There is nothing playing that I could stop for you.');
      serverQueue.songs = [];
      serverQueue.connection.dispatcher.end();
      return;
  }

  return;
});

function play(guild, song) {
  const serverQueue = queue.get(guild.id);

  if (!song) {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
  }
  console.log(serverQueue.songs);

  const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
      .on('end', () => {
          console.log('Song ended!');
          serverQueue.songs.shift();
          play(guild, serverQueue.songs[0]);
      })
      .on('error', error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
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

//setGame command
client.on('message', function(message) {
  if (message.author.bot) return;
  if (message.content.startsWith(`${PREFIX}setGame`)) {
    if ((message.author.id === OWNERID) || (message.author.id === LUCASID)) {
      var input = message.content;
      var clientInput = input.substr(9);
      client.user.setPresence({ game: { name: clientInput, type: 0 } });
    } else {
      message.channel.send('You are not authorized to use this command.');
    }
  }
});

//setAvatar command
client.on('message', function(message) {
  if (message.author.bot) return;
  if (message.content.startsWith(`${PREFIX}setAvatar`)) {
    if ((message.author.id === OWNERID) || (message.author.id === LUCASID)) {
      var input = message.content;
      var clientInput = input.substr(11);
      client.user.setAvatar(clientInput);
    } else {
      message.channel.send('You are not authorized to use this command.');
    }
  }
});

//setStatus command
client.on('message', function(message) {
  if (message.author.bot) return;
  if (message.content.startsWith(`${PREFIX}setStatus`)) {
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
  }
});

//ping command
client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}ping`)) {
    message.channel.send('**PONG**' + ' `' + client.ping.toString() + 'ms`');
  }
});

//vn command
client.on('message', function(message) {
  if(message.content.startsWith(`${PREFIX}vn`)) {
    embed.setTitle('Vape Nation');
    embed.setColor('#29ff00');
    message.channel.send(embed.setImage('https://carboncostume.com/wordpress/wp-content/uploads/2016/04/vapenation.jpg'));
}
});

//ziit command
client.on('message', function(message) {
  if(message.content === '.ziit') {
    embed.setTitle('Die Uhrzeit');
    embed.setColor('BLACK');
    message.channel.send(embed.setImage('http://www.odenssnus.eu/public/img/user/1026.png'));
}
});

//echo command
client.on('message', function(message) {
  if (message.author.bot) return;
  if (message.content.startsWith(`${PREFIX}echo`)) {
    var input = message.content;
    var clientInput = input.substr(6);
    message.delete(200);
    setTimeout(function(){ message.channel.send(clientInput); }, 300);
  }
});

//help command
client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}help`)) {
    message.channel.send('Help page is being worked on.');
  }
});

//more commands
client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}1=0`)) {
    message.channel.send('1=0');
  }
});

client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}alina`)) {
    message.channel.send('Daddy?');
  }
});

client.on('message', function(message) {
  if ((message.content.startsWith(`${PREFIX}andy`)) || (message.content.startsWith(`${PREFIX}andi`))) {
    message.channel.send('De Andi füut sech elei in Bärn.');
  }
});

client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}autismus`)) {
    message.channel.send('Autismus ist eine weitverbreitete Krankheit, vor allem im schweizerischen Bubikon.');
  }
});

client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}autist`)) {
    message.channel.send('Wüki?!?!?');
  }
});

client.on('message', function(message) {
  if (message.content === '.baumi') {
    message.channel.send('Try using `.baumi1`, `.baumi2`, `.baumi3`, or `.baumi4`!');
  }
});

client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}baumi1`)) {
    message.channel.send("Cha de Alain scho d'Uhr lese?");
  }
});

client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}baumi2`)) {
    message.channel.send('Wetsch es Zäpfli?');
  }
});

client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}baumi3`)) {
    message.channel.send('<@'+LUCASID+'>, ab id Duschi');
  }
});

client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}baumi4`)) {
    message.channel.send('Chopf im Sofa.');
  }
});

client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}bitte`)) {
    message.channel.send('**NEI**');
  }
});

client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}boogeyman`)) {
    message.channel.send('Kuka pelkää musta miestä?');
  }
});

client.on('message', function(message) {
  if (message.content === '.claudio') {
    message.channel.send('De Clö isch immer am schaffe.');
  }
});

client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}claudiolino`)) {
    message.channel.send('Clö, bitte, stfu.');
  }
});

client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}clö`)) {
    message.channel.send('Ich ha gseit **NEI**.');
  }
});

client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}danke`)) {
    embed.setTitle('Merci viu mol');
    embed.setColor('#001fff');
    message.channel.send(embed.setImage('https://t3.ftcdn.net/jpg/00/88/04/32/240_F_88043202_HGdQvy3vJoSYVznZXBx1n2JNvDhSk8Ss.jpg'));
  }
});

client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}dinimom`)) {
    message.channel.send('WÜKI?!?!?!??');
  }
});

client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}doni`)) {
    message.channel.send('Heb fressi oder ich küss dich.');
  }
});

client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}eis`)) {
    message.channel.send('isch keis.');
  }
});

client.on('message', function(message) {
  if (message.content === '.fabio') {
    message.channel.send('De Vabio isch en chline Memer.');
  }
});

client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}fabio2`)) {
    message.channel.send('Wie isch d\'Matur? - Isch fein gsi.');
  }
});

client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}fabiocsgo`)) {
    message.channel.send('High risk - no reward.');
  }
});

client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}fige`)) {
    message.channel.send('De Feliks het en usprägte Orientierigssinn.');
  }
});

client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}game`)) {
    message.channel.send('Gits eis?');
  }
});

client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}gschicht`)) {
    message.channel.send('*glernt*');
  }
});

client.on('message', function(message) {
  if (message.content === '.ich') {
    message.channel.send('***ICH*** stahn im __Mittelpunkt!!!111!!1!!1__');
  }
});

client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}ichi`)) {
    message.channel.send('Bruchsch hilf? **ICH** cha der helfe.');
  }
});

client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}interessiert`)) {
    message.channel.send('Wie es Loch im Chopf.');
  }
});

client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}inyourfaculty`)) {
    message.channel.send('BECEASED!!!1!!!!111!!1!!!');
  }
});

client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}inyourfamily`)) {
    message.channel.send('BECEASED!!!1!!!!111!!1!!!');
  }
});

client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}inyourname`)) {
    message.channel.send('BECEASED!!!1!!!!111!!1!!!');
  }
});

client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}inyourspirit`)) {
    message.channel.send('BECEASED!!!1!!!!111!!1!!!');
  }
});

client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}ivan`)) {
    message.channel.send('Hoi zämä, i bims, dr Ivam. I bi ä waschächtä Schwiizer wiä mr gseht. Wohne duän i ~~IM REICH~~ in Öschtriich, und cha ou nid Schwiizertüütsch. Ademerci.');
  }
});

client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}jacob`)) {
    message.channel.send('Jeg elsker dig ligesom du elsker min fugtig migmig.');
  }
});

client.on('message', function(message) {
  if (message.content === '.jesus') {
    message.channel.send('**IN THE NAAAAME OF JESUS!!!!!!**');
  }
});

client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}jesuschrist`)) {
    message.channel.send('is my nigga.');
  }
});

client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}joel`)) {
    message.channel.send('IcH bI dE jOeL uNd IcH gLaUb AlLeS wO mEr MiR sEiT.');
  }
});

client.on('message', function(message) {
  if (message.content === '.kadder') {
    message.channel.send('Ich ha gern Klobürschtene.');
  }
});

client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}kadder2`)) {
    message.channel.send('Tüend sie Wasser löse?');
  }
});

client.on('message', function(message) {
  if (message.content === '.lucas') {
    message.channel.send('Dr Luckckas verdient viu a dr HSR.');
  }
});

client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}lucas2`)) {
    message.channel.send('exit');
  }
});

client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}mila`)) {
    message.channel.send('__**ACHT**__');
  }
});

client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}noah`)) {
    message.channel.send('Wo isch de Noah?');
  }
});

client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}oli`)) {
    message.channel.send('Ich bi sozial.');
  }
});

client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}ppap`)) {
    message.channel.send(':pen_fountain: :pineapple: :apple: :pen_fountain:');
  }
});

client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}pubg`)) {
    message.channel.send('1=0');
  }
});

client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}stfu`)) {
    message.channel.send('Bitte, stfu.');
  }
});

client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}toubi`)) {
    message.channel.send('Hallo, ich heisse Toubi.');
  }
});

client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}velo`)) {
    message.channel.send('黒人が自転車を盗んだ');
  }
});

client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}weltbild`)) {
    message.channel.send('"Du hesch es falsches Weltbild."');
  }
});

client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}zeit`)) {
    message.channel.send('Neun Uhr Achtzig.');
  }
});

client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}ziit?`)) {
    message.channel.send('Ja, was isch denn für Ziit?');
  }
});

client.on('message', function(message) {
  if (message.content.startsWith(`${PREFIX}zoel`)) {
    message.channel.send('Hoi zäme, ich bi de Zoel, freut mi.');
  }
});
