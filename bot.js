require('dotenv').config({
	path: '.env',
});

// requirements
const constants = require('./modules/constants');
require('./modules/commands');
require('./modules/music');
require('./modules/custom');
require('./modules/help');
require('./modules/events');

// warn
constants.client.on('warn', (warning) => console.warn(`Client warning occurred.\nName: ${warning.name}\nMessage: ${warning.message}\nStack: ${warning.stack}`));

// error
constants.client.on('error', (error) => console.error(`Client error occurred.\nName: ${error.name}\nMessage: ${error.message}\nStack: ${error.stack}`));

// ready
constants.client.on('ready', () => {
	constants.client.user.setActivity(constants.GAME, {
		type: constants.type,
	});
	logToChannel('Information', 'Bot successfully initialized.', constants.client.user.tag, constants.client.user.displayAvatarURL());
});

// disconnect
constants.client.on('disconnect', () => console.log('Bot has disconnected...'));

// reconnecting
constants.client.on('reconnecting', () => console.log('Bot is reconnecting...'));

// bot token login
constants.client.login(constants.TOKEN);

// process listeners
process.on('unhandledRejection', (reason, p) => {
	constants.unhandledRejections.set(p, reason);
	logToChannel('Error', `Unhandled Rejection at: ${p}.\nReason: ${reason}`, 'unhandledRejection', constants.client.user.displayAvatarURL());
});

process.on('rejectionHandled', (p) => {
	constants.unhandledRejections.delete(p);
	logToChannel('Warning', p, 'rejectionHandled', constants.client.user.displayAvatarURL());
});

process.on('exit', (code) => console.log(`Process about to exit with code: ${code}`));

process.on('warning', (warning) => console.warn(`Process warning occurred.\nName: ${warning.name}\nMessage: ${warning.message}\nStack: ${warning.stack}`));

// get other files' content
commands();
customCommands();
musicCommands();
helpCommands();
events();

// music functions
handleVideo = async function (video, message, voiceChannel, playlist = false) {
	const serverQueue = constants.queue.get(message.guild.id);
	console.log(video);
	const song = {
		id: video.id,
		title: constants.Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`,
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 1,
			playing: true,
		};
		constants.queue.set(message.guild.id, queueConstruct);
		queueConstruct.songs.push(song);
		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(message.guild, queueConstruct.songs[0]);
		}
		catch (error) {
			logToChannel('Error', error, 'Could not join the voice channel', constants.client.user.displayAvatarURL());
			constants.queue.delete(message.guild.id);
			return message.channel.send({
				embed: {
					description: `‼ Could not join the voice channel: ${error}`,
					color: constants.red,
				},
			});
		}
	}
	else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		if (playlist) return;
		else return message.channel.send({
			embed: {
				description: `🎶 **[${song.title}](${song.url})** has been added to the queue!`,
				color: constants.blue,
			},
		});
	}
	return;
};

let messageID = null;
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
		.on('error', error => logToChannel('Error', error, 'Music error', constants.client.user.displayAvatarURL()));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
	if (messageID !== null) serverQueue.textChannel.messages.fetch(messageID).then(msg => msg.delete());
	serverQueue.textChannel.send({
		embed: {
			description: `▶ Started playing: **[${song.title}](${song.url})**`,
			color: constants.blue,
		},
	})
		.then(sent => {
			messageID = sent.id;
		});
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
		console.log(logMessage);
		constants.airbrake.notify(logMessage);
	}

	const embed = new constants.Discord.MessageEmbed()
		.setTitle(title)
		.setAuthor(messageAuthor)
		.setColor(color)
		.setDescription(logMessage)
		.setThumbnail(picture)
		.setTimestamp();
	constants.client.channels.get(constants.BOT_CHANNEL).send({
		embed,
	});

};

// functions for coinflip
coinFlip = function (coinFlipMessage) {
	const coinFlipErrorEmbed = new constants.Discord.MessageEmbed()
		.setTitle('Error')
		.setDescription(`\`${constants.PREFIX}coinflip firstCondition secondCondition\` **OR** \`${constants.PREFIX}coinflip\``)
		.setColor(constants.red);
	var clientInput = coinFlipMessage.split(' ');
	if (clientInput.length !== 3 && clientInput.length !== 1) {
		return coinFlipErrorEmbed;
	}
	else if (clientInput.length === 3) {
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
};

coinFlipEmbedF = function (description) {
	const coinFlipEmbed = new constants.Discord.MessageEmbed()
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
		if (userRPS === 'rock') {
			return 'DRAW';
		}
		else if (userRPS === 'scissor') {
			return 'BOT';
		}
		else {
			return 'USER';
		}
	}
	else if (botRPS === 'Paper') {
		if (userRPS === 'rock') {
			return 'BOT';
		}
		else if (userRPS === 'scissor') {
			return 'USER';
		}
		else {
			return 'DRAW';
		}
	}
	else if (botRPS === 'Scissor') {
		if (userRPS === 'rock') {
			return 'USER';
		}
		else if (userRPS === 'scissor') {
			return 'DRAW';
		}
		else {
			return 'BOT';
		}
	}
};

rpsPrint = function (userRPS, usertag) {
	var botRPS = rpsGenerator();
	if (!userRPS) return 'Please enter a valid message! (Rock, Paper or Scissor)';
	else if (userRPS.toLowerCase() === 'rock' || userRPS.toLowerCase() === 'scissor' || userRPS.toLowerCase() === 'paper') {
		var rpsMessage = rpsBattle(botRPS, userRPS);
		switch (rpsMessage) {
		case 'USER':
			return usertag + ' won!';
		case 'BOT':
			return constants.client.user.toString() + ' won!';
		case 'DRAW':
			return 'Draw!';
		}
	}
	else return 'Please enter a valid message! (Rock, Paper or Scissor)';
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
let lottoNumber = Math.floor((Math.random() * 50) + 1);
lotto = function (userGuess) {
	if (!userGuess || isNaN(userGuess)) {
		return `Please use the command like this: \`${constants.PREFIX}lotto number\``;
	}
	else if (userGuess < 1 || userGuess > 50) {
		return 'Please enter a valid number between 1 and 50!';
	}
	else if (parseInt(userGuess) === lottoNumber) {
		lottoNumber = Math.floor((Math.random() * 50) + 1);
		return 'Congratulations, you guessed right! Here\'s a kiss from Doni! :kissing_closed_eyes:';
	}
	else {
		return 'You guessed wrong :pensive: Maybe next time...';
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

// function for client status
getStatus = function () {
	switch (constants.client.status) {
	case 0:
		return 'READY';
	case 1:
		return 'CONNECTING';
	case 2:
		return 'RECONNECTING';
	case 3:
		return 'IDLE';
	case 4:
		return 'NEARLY';
	case 5:
		return 'DISCONNECTED';
	default:
		return 'UNKNOWN';
	}
};

// function for region rename
getRegion = function (region) {
	switch (region) {
	case 'brazil':
		return 'Brazil';
	case 'eu-central':
		return 'Central Europe';
	case 'hongkong':
		return 'Hong Kong';
	case 'russia':
		return 'Russia';
	case 'singapore':
		return 'Singapore';
	case 'sydney':
		return 'Sydney';
	case 'us-central':
		return 'US Central';
	case 'us-east':
		return 'US East';
	case 'us-south':
		return 'US South';
	case 'us-west':
		return 'US West';
	case 'eu-west':
		return 'Western Europe';
	default:
		return region;
	}
};

// function for verification level
getVL = function (level) {
	switch (level) {
	case 0:
		return 'None';
	case 1:
		return 'Low';
	case 2:
		return 'Medium';
	case 3:
		return '(╯°□°）╯︵ ┻━┻';
	case 4:
		return '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻';
	default:
		return 'Unknown';
	}
};

// function for explicit content filter
getECF = function (filter) {
	switch (filter) {
	case 0:
		return 'Doesn\'t scan any messages';
	case 1:
		return 'Scans messages from members without a role';
	case 2:
		return 'Scans messages sent by all members';
	default:
		return 'Unknown';
	}
};

airhornCreate = async function (message, command) {
	try {
		message.channel.send({
			embed: {
				title: 'Information',
				color: constants.blue,
				description: 'There is no `airhorn` role. Do you want to create it now?',
				footer: {
					text: 'Please input yes or no.',
				},
			},
		});
		try {
			const authorid = message.author.id;
			const response = await message.channel.awaitMessages(msg2 => msg2.author.id === authorid && msg2.content.toLowerCase() === 'yes' || msg2.content.toLowerCase() === 'no', {
				max: 1,
				time: 30000,
				errors: ['time'],
			});
			const answer = response.first().content;
			if (answer === 'yes') {
				message.guild.createRole({
					data: {
						name: 'airhorn',
						hoist: false,
					},
					reason: 'Airhorn role for the airhorn command.',
				});
				return message.channel.send({
					embed: {
						description: 'Created role `airhorn` for the airhorn command.',
						color: constants.orange,
					},
				});
			}
			else return message.channel.send({
				embed: {
					description: 'Cancelled the command.',
					color: constants.orange,
				},
			});
		}
		catch (err) {
			return message.channel.send({
				embed: {
					description: 'No or invalid input.',
					color: constants.red,
				},
			});
		}
	}
	catch (err) {
		logToChannel('Error', `Error with the \`${constants.PREFIX}${command}\` command:\n${err}`, `${message.author.tag} typed: "${message.content}"`, message.author.displayAvatarURL());
		return message.channel.send({
			embed: {
				description: 'An error occured.',
				color: constants.red,
			},
		});
	}
};

airhornAssign = async function (message, command) {
	try {
		message.channel.send({
			embed: {
				title: 'Information',
				color: constants.blue,
				description: 'You do not have the role `airhorn`. Do you want to assign it to yourself now?',
				footer: {
					text: 'Please input yes or no.',
				},
			},
		});
		try {
			const authorid = message.author.id;
			const response = await message.channel.awaitMessages(msg2 => msg2.author.id === authorid && msg2.content.toLowerCase() === 'yes' || msg2.content.toLowerCase() === 'no', {
				max: 1,
				time: 30000,
				errors: ['time'],
			});
			const answer = response.first().content;
			if (answer === 'yes') {
				message.member.addRole(message.guild.roles.find('name', 'airhorn').id, 'Assigned airhorn role.');
				return message.channel.send({
					embed: {
						description: 'Assigned the role `airhorn` to you.',
						color: constants.orange,
					},
				});
			}
			else return message.channel.send({
				embed: {
					description: 'Cancelled the command.',
					color: constants.orange,
				},
			});
		}
		catch (err) {
			return message.channel.send({
				embed: {
					description: 'No or invalid input.',
					color: constants.red,
				},
			});
		}
	}
	catch (err) {
		logToChannel('Error', `Error with the \`${constants.PREFIX}${command}\` command:\n${err}`, `${message.author.tag} typed: "${message.content}"`, message.author.displayAvatarURL());
		return message.channel.send({
			embed: {
				description: 'An error occured.',
				color: constants.red,
			},
		});
	}
};

wolframAlpha = async function (query) {
	const DomParser = require('dom-parser');
	const parser = new DomParser();
	const fetch = require('node-fetch');

	return (fetch('https://api.wolframalpha.com/v2/query?input='
			+ encodeURIComponent(query)
			+ '&appid='
			+ encodeURIComponent(constants.WOLFRAM_APPID))
		.then(response => response.text())
		.then(html => {
			const parsed = parser.parseFromString(html);
			return parsed.getElementsByTagName('plaintext')
				.map(e => e.innerHTML);
		}));
};