const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require('./settings.json');
const embed = new Discord.RichEmbed();
const music = require('discord.js-music-v11');
const Manager = new Discord.ShardingManager('./bot.js', {totalShards: "auto", token: settings.token});
 
client.on('ready',() => {
  console.log('Bot ready.');
  client.user.setGame('Work in Progress');
  client.user.setStatus("dnd");
  const channel = client.channels.get(settings.channel);
  if (!channel) return;
  channel.send('Bot successfully initialized.');
});

//bot token login
client.login(settings.token);

//shards
//Manager.spawn();

//restart command
client.on('message', message => {
  if (message.content.startsWith(settings.prefix + 'restart')) {
    if ((message.author.id !== settings.ownerid) || (message.author.id !== settings.lucasid)) return;
      message.channel.send('Restarting...');
      process.exit();
  }
});

//shutdown command
client.on('message', message => {
  if (message.content.startsWith(settings.prefix + 'shutdown')) {
    if ((message.author.id !== settings.ownerid) || (message.author.id !== settings.lucasid)) return;
      message.channel.send('Shutting down... **Please end process in task manager `node.exe`**');
      client.destroy((err) => {
        console.log(err);
      });
      exec('pm2 stop bot.js');
  }
});

//music bot
music(client, {
  prefix: '.',
  global: false,
  maxQueueSize: 100,
  clearInvoker: false,
  anyoneCanSkip: false,
  volume: 8
});

//voice channel join & leave
client.on('message', message => {
  // Voice only works in guilds, if the message does not come from a guild,
  // we ignore it
  if (!message.guild) return;

  if (message.content.startsWith(settings.prefix + 'vcjoin')) {
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

  if (message.content.startsWith(settings.prefix + 'vcleave')) {
    if(message.member.voiceChannel) {
      message.member.voiceChannel.leave();
      message.channel.send('I have successfully disconnected from the channel!');
    }
  }
});

//message on member join
client.on('guildMemberAdd', member => {
  // Send the message to a designated channel on a server
  const channel = member.guild.channels.find('name', 'ext-logs');
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(`Welcome to the server, ${member}`);
});

//ping command
client.on('message', message => {
  if (message.content.startsWith(settings.prefix + 'ping')) {
    message.channel.send('**PONG**' + ' `' + client.ping.toString() + 'ms`');
  }
});

//vn command
client.on('message', function(message) {
  if(message.content.startsWith(settings.prefix + 'vn')) {
    embed.setTitle('Vape Nation');
    embed.setColor('#29ff00');
    message.channel.send(embed.setImage('https://carboncostume.com/wordpress/wp-content/uploads/2016/04/vapenation.jpg'));
}
});

//ziit command
client.on('message', function(message) {
  if(message.content.startsWith(settings.prefix + 'ziit')) {
    embed.setTitle('Die Uhrzeit');
    embed.setColor('BLACK');
    message.channel.send(embed.setImage('http://www.odenssnus.eu/public/img/user/1026.png'));
}
});

//help command
client.on('message', message => {
  if (message.content.startsWith(settings.prefix + 'help')) {
    message.channel.send('Help page is being worked on.');
  }
});

/*
client.on('message', message => {
  if (message.content.startsWith(settings.prefix + 'test')) {
    if (message.author.id !== settings.ownerid) return;
    console.log(settings.ownerid);
  }
});
*/

client.on('message', message => {
  if (message.content === '1=0') {
    message.channel.send('1=0');
  }
});

client.on('message', message => {
  if (message.content.startsWith(settings.prefix + '1')) {
    message.channel.send('1=0');
  }
});

client.on('message', message => {
  if (message.content.startsWith(settings.prefix + 'alina')) {
    message.channel.send('Daddy?');
  }
});

client.on('message', message => {
  if ((message.content.startsWith(settings.prefix + 'andy')) || (message.content.startsWith(settings.prefix + 'andi'))) {
    message.channel.send('De Andi füut sech elei in Bärn');
  }
});

client.on('message', message => {
  if (message.content.startsWith(settings.prefix + 'autismus')) {
    message.channel.send('Autismus ist eine weitverbreitete Krankheit, vor allem im schweizerischen Bubikon.');
  }
});

client.on('message', message => {
  if (message.content.startsWith(settings.prefix + 'autist')) {
    message.channel.send('Wüki?!?!?');
  }
});

client.on('message', message => {
  if (message.content.startsWith(settings.prefix + 'baumi')) {
    message.channel.send('Try using `.baumi1`, `.baumi2`, `.baumi3`, or `.baumi4`!');
  }
});

client.on('message', message => {
  if (message.content.startsWith(settings.prefix + 'baumi1')) {
    message.channel.send("Cha de Alain scho d'Uhr lese?");
  }
});

client.on('message', message => {
  if (message.content.startsWith(settings.prefix + 'baumi2')) {
    message.channel.send('Wetsch es Zäpfli?');
  }
});

client.on('message', message => {
  if (message.content.startsWith(settings.prefix + 'baumi3')) {
    message.channel.send('<@'+settings.lucasid+'>, ab id Duschi');
  }
});

client.on('message', message => {
  if (message.content.startsWith(settings.prefix + 'baumi4')) {
    message.channel.send('Chopf im Sofa');
  }
});
