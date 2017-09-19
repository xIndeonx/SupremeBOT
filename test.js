const Discord = require('discord.js');
const client = new Discord.Client();
 
client.on('ready', () => {
  console.log('I am ready!');
  client.user.setGame('Work in Progress');
  client.user.setStatus("dnd");
  //client.user.send('Bot successfully initialized.');
});
 
client.on('message', message => {
  if (message.content === '.ping') {
    message.channel.send('PONG!');
  }
});

client.on('message', function(message) {
  if (message.content === '.ziit') {
    client.sendFile(message, './vapenation.jpg', 'vapenation.jpg', null, (err, m) => {
          if (err) console.log(err);
    });
  }
});

client.login('');


client.on('message', message => {
  // Voice only works in guilds, if the message does not come from a guild,
  // we ignore it
  if (!message.guild) return;

  if (message.content === '.join') {
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

  if (message.content === '.leave') {
    if(message.member.voiceChannel) {
      message.member.voiceChannel.leave();
      message.channel.send('I have successfully disconnected from the channel!');
    }
  }
});

client.on('message', message => {
  if (message.content === '.play') {
    connection.playFile('C:\Users\StockerF\Music\GetRenai.mp3');
  }
});




/*
client.on('message', message => {
  if (message.content === '.shutdown') {
    message.channel.send('Shutting down...');
    client.destroy((err) => {
      console.log(err);
    });
  }
});
*/

//something

/*'use strict'

const Discord = require("discord.js")
const client = new Discord.Client()
var status = 'I am running however, I may be unstable since I am under development.'
const prefix = '?easy'

client.on('ready', () => {
  console.log('Bot ready!')
  //client.user.setPresence({ game: { name: client.guilds.size.toString(), type: 0 } }); // sets teh bots game
  //client.user.setPresence({ game: { name: `${client.guilds.size}`, type: 0 } }); // sets teh bots game
  //client.user.setPresence({ game: { name: ?easy | `${client.guilds.size}`, type: 0 } }); // sets teh bots game
  client.user.setPresence({ game: { name: `?easy | ${client.guilds.size} Servers`, type: 0 } }) // sets what game you are playing
})

client.on('message', (msg) => {

  if (msg.author.bot || !msg.content.startsWith(prefix)) {
    return
  }

  if (msg.content.startsWith(prefix + ' ping')) {
    msg.channel.send(status)
  }

  if (msg.content.startsWith(prefix + ' commands')) {
    msg.author.send('?easy ping: Shows status of the bot. ')
  }

})*/














/*
client.on('message', message => {
  if (message.content === '.help') {
    message.channel.send('Help page is being worked on');
  }
});

client.on('message', message => {
  if (message.content === '1=0') {
    message.channel.send('1=0');
  }
});

client.on('message', message => {
  if (message.content === '1') {
    message.channel.send('1=0');
  }
});

client.on('message', message => {
  if (message.content === 'alina') {
    message.channel.send('Daddy?');
  }
});

client.on('message', message => {
  if (message.content === 'andy') {
    message.channel.send('De Andi füut sech elei in Bärn');
  }
});

client.on('message', message => {
  if (message.content === 'autismus') {
    message.channel.send('Autismus ist eine weitverbreitete Krankheit, vor allem im schweizerischen Bubikon.');
  }
});

client.on('message', message => {
  if (message.content === 'autist') {
    message.channel.send('Wüki?!?!?');
  }
});

client.on('message', message => {
  if (message.content === 'baumi') {
    message.channel.send('Try using `baumi1`, `baumi2`, `baumi3`, or `baumi4`!');
  }
});

client.on('message', message => {
  if (message.content === 'baumi1') {
    message.channel.send("Cha de Alain scho d'Uhr lese?");
  }
});

client.on('message', message => {
  if (message.content === 'baumi2') {
    message.channel.send('Wetsch es Zäpfli?');
  }
});

client.on('message', message => {
  if (message.content === 'baumi3') {
    message.channel.send('ab id Duschi');
  }
});

client.on('message', message => {
  if (message.content === 'baumi4') {
    message.channel.send('');
  }
});
*/

