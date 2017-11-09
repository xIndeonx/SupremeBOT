// requirements
let constants = require('./modules/constants');
require('./modules/commands');
require('./modules/music');
require('./modules/custom');

// warn
constants.client.on('warn', console.warn);
// error
constants.client.on('error', console.error);

// ready
constants.client.on('ready', () => {
	constants.client.user.setPresence({
		game: {
			name: constants.GAME,
			type: 0
		}
	});
	logToChannel('Information', 'Bot successfully initialized.', constants.client.user.tag, constants.client.user.displayAvatarURL);
});

// disconnect
constants.client.on('disconnect', () => console.log('Bot has disconnected...'));

// reconnecting
constants.client.on('reconnecting', () => console.log('Bot is reconnecting...'));

// bot token login
constants.client.login(constants.TOKEN);

process.on('unhandledRejection', console.error);

commands();
customCommands();
musicCommands();

handleVideo = async function (video, message, voiceChannel, playlist = false) {
	const serverQueue = constants.queue.get(message.guild.id);
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
			volume: 5,
			playing: true
		};
		constants.queue.set(message.guild.id, queueConstruct);
		queueConstruct.songs.push(song);
		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(message.guild, queueConstruct.songs[0]);
		}
		catch (error) {
			console.error(`Could not join the voice channel: ${error}`);
			constants.airbrake.notify(error);
			constants.queue.delete(message.guild.id);
			return message.channel.send({
				embed: {
					description: `:bangbang: **Could not join the voice channel:** ${error}`,
					color: constants.red
				}
			});
		}
	}
	else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		if (playlist) return;
		else return message.channel.send({
			embed: {
				description: `:notes: **${song.title}** has been added to the queue!`,
				color: constants.blue
			}
		});
	}
	return;
};

play = function (guild, song) {
	const serverQueue = constants.queue.get(guild.id);
	if (!song) {
		serverQueue.voiceChannel.leave();
		constants.queue.delete(guild.id);
		return;
	}
	console.log(serverQueue.songs);
	const dispatcher = serverQueue.connection.playStream(constants.ytdl(song.url))
		.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended!');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
	serverQueue.textChannel.send({
		embed: {
			description: `:arrow_forward: Started playing: **${song.title}**`,
			color: constants.blue
		}
	})
		.then(sent => sent.delete(60000));
};

// message on member join
/* constants.client.on('guildMemberAdd', function (member) {
    // Send the message to a designated channel on a server
    const channel = member.guild.channels.find('name', 'announcements');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`Welcome to the server, ${member}!`);
});*/

// functions for correct time format
format = function (input) {
	function pad(s) {
		return (s < 10 ? '0' : '') + s;
	}
	var hours = Math.floor(input / (60 * 60));
	var minutes = Math.floor(input % (60 * 60) / 60);
	var seconds = Math.floor(input % 60);

	return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
};

msToTime = function (duration) {
	var milliseconds = Math.floor((duration % 1000) / 100),
		seconds = Math.floor((duration / 1000) % 60),
		minutes = Math.floor((duration / (1000 * 60)) % 60),
		hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

	hours = (hours < 10) ? '0' + hours : hours;
	minutes = (minutes < 10) ? '0' + minutes : minutes;
	seconds = (seconds < 10) ? '0' + seconds : seconds;

	return hours + ':' + minutes + ':' + seconds + '.' + milliseconds;
};

// function for logging
logToChannel = function (title, logMessage, messageAuthor, picture) {

	switch (title) {
	case 'Information':
		color = constants.blue;
		console.log(logMessage);
		break;
	case 'Warning':
		color = constants.orange;
		console.warn(logMessage);
		break;
	case 'Error':
		color = constants.red;
		console.error(logMessage);
		constants.airbrake.notify(logMessage);
		break;
	default:
		color = constants.black;
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

};

// functions for coinflip
coinFlip = function (coinFlipMessage) {
	const coinFlipErrorEmbed = new constants.Discord.RichEmbed()
		.setTitle('Error')
		.setDescription(`\`${constants.PREFIX}coinflip firstCondition secondCondition\` **OR** \`${constants.PREFIX}coinflip\``)
		.setColor(constants.red);
	var clientInput = coinFlipMessage.split(' ');
	console.log(clientInput);
	if (clientInput.length !== 3 && clientInput.length !== 1) {
		return coinFlipErrorEmbed;
	}
	else {
		if (clientInput.length === 3) {
			var firstCondition = clientInput[1];
			var secondCondition = clientInput[2];
			var coin = Math.floor((Math.random() * 10) + 1);
			if (coin <= 5) return coinFlipEmbedF(firstCondition);
			else return coinFlipEmbedF(secondCondition);
		}
		else {
			var coin2 = Math.floor((Math.random() * 10) + 1);
			if (coin2 <= 5) return coinFlipEmbedF('Head');
			else return coinFlipEmbedF('Tails');
		}
	}
};

coinFlipEmbedF = function (description) {

	const coinFlipEmbed = new constants.Discord.RichEmbed()
		.setTitle('Result')
		.setDescription(description)
		.setColor(constants.blue);

	return coinFlipEmbed;

};

// functions for RPS
rpsGenerator = function () {

	var rps = Math.floor((Math.random() * 3) + 1);
	if (rps === 1) {
		return 'Rock';
	}
	else if (rps == 2) {
		return 'Paper';
	}
	else {
		return 'Scissor';
	}
};

rpsBattle = function (botRPS, userRPS) {

	if (botRPS === 'Rock') {

		if (userRPS === 'ROCK') {
			return 'DRAW';
		}
		else if (userRPS === 'SCISSOR') {
			return 'BOT';
		}
		else {
			return 'USER';
		}

	}
	else if (botRPS === 'Paper') {
		if (userRPS === 'ROCK') {
			return 'BOT';
		}
		else if (userRPS === 'SCISSOR') {
			return 'USER';
		}
		else {
			return 'DRAW';
		}

	}
	else if (botRPS === 'Scissor') {
		if (userRPS === 'ROCK') {
			return 'USER';
		}
		else if (userRPS === 'SCISSOR') {
			return 'DRAW';
		}
		else {
			return 'BOT';
		}

	}
};

rpsPrint = function (userRPS, usertag) {

	var botRPS = rpsGenerator();
	if (userRPS.toUpperCase() === 'ROCK' || userRPS.toUpperCase() === 'SCISSOR' || userRPS.toUpperCase() === 'PAPER' && userRPS) {
		var rpsMessage = rpsBattle(botRPS, userRPS);
		switch (rpsMessage) {
		case 'USER':
			return usertag + ' Won!';
		case 'BOT':
			return constants.client.user.toString() + ' Won!';
		case 'DRAW':
			return rpsMessage;
		}
	}
	else {
		return 'Please enter a valid message! (Rock, Paper or Scissor)';
	}

};

// functions for 8ball
eightball = function () {
	var answer = Math.floor((Math.random() * 10) + 1);
	var answerChoice = Math.floor((Math.random() * 8) + 1);
	if (answer <= 4) {
		constants.isYes = 'YES';
		switch (answerChoice) {
		case 1:
			return 'Definitiv.';
		case 2:
			return 'Uf jede Fall, ja.';
		case 3:
			return 'Mini Source seget mir das stimmt.';
		case 4:
			return 'Ja, aber nur will **ICH**s sege.';
		case 5:
			return 'Bin mir nöd 100% sicher, aber glaubs ja.';
		case 6:
			return 'Ich han googlet, es stimmt, ja.';
		case 7:
			return 'Ih dem Fall scho, ja.';
		case 8:
			return 'Ich wür scho sege, hä.';
		}
	}
	else if (answer > 4 && answer <= 8) {
		constants.isYes = 'NO';
		switch (answerChoice) {
		case 1:
			return 'Nö, sicher nöd.';
		case 2:
			return 'Bisch du behindert? **Nei**.';
		case 3:
			return 'Also wenn das stimmt, denn weissi au nöd.';
		case 4:
			return 'Also wenn du denksch, dass mini Antwort ja isch, denn hesch dich girrt.';
		case 5:
			return 'Hesch du wüki s\'Gfühl, dass ich ja sege? wtf';
		case 6:
			return 'Ich weiss du ghörsch es nöd gern, aber es isch es klars nei vo mir.';
		case 7:
			return 'Also wenn das `Britain\'s Got Talent` wär, hetsch fix 3 Mal nei becho.';
		case 8:
			return 'Wenns Wort ja **\'nei\'** heisse wür, wärs es ja.';
		}
	}
	else {
		constants.isYes = 'VAPEIO';
		return 'Ich bin de Vapeio und ich han kei Entscheidigsfähigkeit.';
	}

};

eightballColorDecider = function () {
	if (constants.isYes === 'YES') {
		return constants.green;
	}
	else if (constants.isYes === 'VAPEIO') {
		return constants.yellow;
	}
	else {
		return constants.red;
	}
};

// function for lotto
lotto = function (userGuess) {
	if (!userGuess || isNaN(userGuess)) {
		return `Please use the command like this: \`${constants.PREFIX}lotto number\``;
	}
	else if (userGuess < 1 || userGuess > 50) {
		return 'Please enter a valid number between 1 and 50!';
	}
	else {
		var lottoNumber = Math.floor((Math.random() * 50) + 1);
		if (userGuess === lottoNumber) {
			return 'Congratulations, you guessed right! Here\'s a kiss from Doni! :kissing_closed_eyes:';
		}
		else {
			return 'You guessed wrong :pensive: Maybe next time...';
		}
	}

};

// function for eval command
clean = function (text) {
	if (typeof (text) === 'string')
		return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
	else
		return text;
};

// function for user day creation
getDay = function (day) {
	switch (day) {
	case 0:
		return 'Sun';
	case 1:
		return 'Mon';
	case 2:
		return 'Tue';
	case 3:
		return 'Wed';
	case 4:
		return 'Thu';
	case 5:
		return 'Fri';
	case 6:
		return 'Sat';
	default:
		return '';
	}
};