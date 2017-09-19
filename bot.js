const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require('./settings.json');
const embed = new Discord.RichEmbed();
const music = require('discord.js-music-v11');
 
client.on('ready', () => {
  console.log('Bot ready.');
  client.user.setGame('Work in Progress');
  client.user.setStatus("dnd");
  //client.user.send('Bot successfully initialized.');
});
 
//ping command
client.on('message', message => {
  if (message.content.startsWith(settings.prefix + 'ping')) {
    message.channel.send('PONG!');
  }
});

//bot token login
client.login(settings.token);

//music bot
music(client, {
  prefix: '.',
  global: false,
  maxQueueSize: 100,
  clearInvoker: false,
  anyoneCanSkip: false,
  volume: 1
});

//voice channel join & leave
client.on('message', message => {
  // Voice only works in guilds, if the message does not come from a guild,
  // we ignore it
  if (!message.guild) return;

  if (message.content.startsWith(settings.prefix + 'join')) {
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

  if (message.content.startsWith(settings.prefix + 'leave')) {
    if(message.member.voiceChannel) {
      message.member.voiceChannel.leave();
      message.channel.send('I have successfully disconnected from the channel!');
    }
  }
});

client.on('guildMemberAdd', member => {
  // Send the message to a designated channel on a server
  const channel = member.guild.channels.find('name', 'ext-logs');
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(`Welcome to the server, ${member}`);
});

//vn command
client.on('message', function(message) {
  if(message.content.startsWith(settings.prefix + 'vn')) {
    embed.setColor('#29ff00');
    message.channel.send(embed.setImage('https://carboncostume.com/wordpress/wp-content/uploads/2016/04/vapenation.jpg'));
}
});
