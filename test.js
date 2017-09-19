const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '.'
 
client.on('ready', () => {
  console.log('I am ready!');
  client.user.setGame('Work in Progress');
  client.user.setStatus("dnd");
  //client.user.send('Bot successfully initialized.');
});
 
//ping command
client.on('message', message => {
  if (message.content.startsWith(prefix + 'ping')) {
    message.channel.send('PONG!');
  }
});

//bot token login
client.login('<token here>');

//voice channel join & leave
client.on('message', message => {
  // Voice only works in guilds, if the message does not come from a guild,
  // we ignore it
  if (!message.guild) return;

  if (message.content.startsWith(prefix + 'join')) {
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

  if (message.content.startsWith(prefix + 'leave')) {
    if(message.member.voiceChannel) {
      message.member.voiceChannel.leave();
      message.channel.send('I have successfully disconnected from the channel!');
    }
  }
});

//play local music file in voice channel
client.on('message', message => {
  if (message.content.startsWith(prefix + 'play')) {
    if (message.member.voiceChannel) {
      connection.playFile('C:\Users\Fabio\Music\GetRenai.mp3');
    }
    else {
      message.channel.send("Error");
    }
  }
});

/*client.on('message', function(message) {
  if (message.content.startsWith(prefix + 'ziit')) {
    client.sendFile(message, './vapenation.jpg', 'vapenation.jpg', null, (err, m) => {
          if (err) console.log(err);
    });
  }
});*/

/*
client.on('message', message => {
  if (message.content.startsWith(prefix + 'shutdown')) {
    message.channel.send('Shutting down...');
    client.destroy((err) => {
      console.log(err);
    });
  }
});
*/
