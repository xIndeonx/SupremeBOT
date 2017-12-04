// requirements
const constants = require('./constants');
require('../bot');

// commands
helpCommands = function () {
	constants.client.on('message', function (message) {
		if (message.author.bot) return;
		if (!message.content.startsWith(constants.PREFIX)) return;
		if (!message.guild) return;
		const args = message.content.slice(constants.PREFIX.length).trim().split(/ +/g);
		const command = args.shift().toLowerCase();

		if (command.startsWith('custom')) {
			try {
				message.delete();
				const embed = new constants.Discord.MessageEmbed()
					.setColor(constants.blue)
					.setTimestamp()
					.setAuthor(constants.client.user.username, constants.client.user.displayAvatarURL())
					.setTitle('Custom Commands')
					.setDescription('This is a complete list of all custom commands.')
					.addField('A-E', `\`${constants.PREFIX}1=0\`\n\`${constants.PREFIX}ademerci\`\n\`${constants.PREFIX}aha\`\n\`${constants.PREFIX}alina\`\n\`${constants.PREFIX}andreas\`\n\`${constants.PREFIX}andi\`\n\`${constants.PREFIX}andy\`\n\`${constants.PREFIX}auä\`\n\`${constants.PREFIX}australia\`\n\`${constants.PREFIX}autismus\`\n\`${constants.PREFIX}autist\`\n\`${constants.PREFIX}baumi\`\n\`${constants.PREFIX}bitte\`\n\`${constants.PREFIX}boogeyman\`\n\`${constants.PREFIX}bzz\`\n\`${constants.PREFIX}claudio\`\n\`${constants.PREFIX}claudiolino\`\n\`${constants.PREFIX}clö\`\n\`${constants.PREFIX}danke\`\n\`${constants.PREFIX}doni\`\n\`${constants.PREFIX}eis\`\n`, true)
					.addField('E-K', `\`${constants.PREFIX}esgahtnöd\`\n\`${constants.PREFIX}fabio\`\n\`${constants.PREFIX}ffs\`\n\`${constants.PREFIX}fige\`\n\`${constants.PREFIX}filip\`\n\`${constants.PREFIX}gopfeteli\`\n\`${constants.PREFIX}gschicht\`\n\`${constants.PREFIX}hauptstadt\`\n\`${constants.PREFIX}hoi\`\n\`${constants.PREFIX}hm\`\n\`${constants.PREFIX}ich\`\n\`${constants.PREFIX}ichi\`\n\`${constants.PREFIX}iconic\`\n\`${constants.PREFIX}interessiert\`\n\`${constants.PREFIX}ivan\`\n\`${constants.PREFIX}jacob\`\n\`${constants.PREFIX}jaoder\`\n\`${constants.PREFIX}joel\`\n\`${constants.PREFIX}kadder\`\n\`${constants.PREFIX}ksh\`\n`, true)
					.addField('L-Z', `\`${constants.PREFIX}lucas\`\n\`${constants.PREFIX}merci\`\n\`${constants.PREFIX}noah\`\n\`${constants.PREFIX}oli\`\n\`${constants.PREFIX}ppap\`\n\`${constants.PREFIX}praise\`\n\`${constants.PREFIX}pubg\`\n\`${constants.PREFIX}rip\`\n\`${constants.PREFIX}snus\`\n\`${constants.PREFIX}sorry\`\n\`${constants.PREFIX}stfu\`\n\`${constants.PREFIX}toubi\`\n\`${constants.PREFIX}velo\`\n\`${constants.PREFIX}vn\`\n\`${constants.PREFIX}weltbild\`\n\`${constants.PREFIX}wiebitte\`\n\`${constants.PREFIX}zeit\`\n\`${constants.PREFIX}ziit\`\n\`${constants.PREFIX}zoel\`\n\`${constants.PREFIX}zollike\`\n`, true);

				if ((message.author.id === constants.OWNER_ID) || (message.author.id === constants.LUCAS_ID)) {
					return message.channel.send({
						embed,
					});
				}
				else {
					message.author.send({
						embed,
					});
					message.channel.send({
						embed: {
							title: 'Help',
							color: constants.green,
							description: `${message.author}, please check your Direct Messages!`,
						},
					})
						.then(sent => sent.delete({
							timeout: 10000,
						}))
						.catch(err => {
							logToChannel('Error', `Error with the \`${command}\` command:\n${err}`, `${message.author.tag} typed: "${message.content}"`, message.author.displayAvatarURL());
							message.channel.send({
								embed: {
									title: 'Error',
									color: constants.red,
									description: `An error occured with the \`${command}\` command.`,
								},
							});
							return;
						});
					return;
				}
			}
			catch (err) {
				logToChannel('Error', `Error with the \`${command}\` command:\n${err}`, `${message.author.tag} typed: "${message.content}"`, message.author.displayAvatarURL());
				message.channel.send({
					embed: {
						title: 'Error',
						color: constants.red,
						description: `An error occured with the \`${command}\` command.`,
					},
				});
				return;
			}
		}
		else if (command.startsWith('help')) {
			try {
				if (args[0] === 'eval') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'Can be used by owners to evaluate code directly in Discord.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]} <code>\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]} message.guild.id\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'restart') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'Can be used by owners to restart the bot.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]}\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]}\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'setavatar') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'Can be used by owners to change the avatar of the bot.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]} <url>\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]} https://discordapp.com/assets/2c21aeda16de354ba5334551a883b481.png\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'setactivity') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'Can be used by owners to change the activity of the bot.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]} <type> <activity>\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]} 0 with my cat\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'shutdown') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'Can be used by owners to shut down the bot.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]}\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]}\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'airhorn') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'Plays a loud airhorn sound.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]}\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]}\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'ban') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'Bans a user from the server.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]} <mention> <days> <reason>\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]} @Fabiolous#4960 7 Advertising\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'delete') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'Bulk deletes messages from the channel.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]} <amount>\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]} 30\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'kick') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'Kicks a user from the server.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]} <mention> <reason>\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]} @Raytlye#7182 He did not listen.\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'purge') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'Deletes 50 messages from the channel.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]}\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]}\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'vckick') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'Kicks a user from a voice channel.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]} <mention>\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]} @Fabiolous#4960\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'join') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'The bot joins the current voice channel.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]}\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]}\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'leave' || args[0] === 'stop') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'Stops the music and leaves the voice channel.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]}\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]}\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'np') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'Shows what\'s playing now.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]}\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]}\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'pause') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'Pauses the music.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]}\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]}\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'play') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'Adds music to the queue or starts playing music.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]} <url>\` or \`${constants.PREFIX}${args[0]} <song>\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]} https://www.youtube.com/watch?v=3M_5oYU-IsU\` or \`${constants.PREFIX}${args[0]} Big Shaq - Mans Not Hot\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'queue') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'Displays the current queue. Works with queue pages.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]}\` or \`${constants.PREFIX}${args[0]} <page>\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]}\` or \`${constants.PREFIX}${args[0]} 5\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'resume') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'Resumes the music.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]}\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]}\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'search') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'Searches YouTube for music.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]} <song>\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]} EDEN - drugs\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'skip') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'Skips the current song playing.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]}\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]}\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'vcleave') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'The bot leaves the voice channel.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]}\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]}\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'volume') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'Controls the volume of the music.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]}\` or \`${constants.PREFIX}${args[0]} <amount>\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]}\` or \`${constants.PREFIX}${args[0]} 3\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'channelinfo') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'Shows information about the current channel.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]}\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]}\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'channels') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'Shows a list of all channels on the server.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]}\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]}\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'custom') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'Shows a complete list of custom commands that can be used.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]}\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]}\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'help') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'Displays a complete list of all commands or details to a single command.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]}\` or \`${constants.PREFIX}${args[0]} <command>\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]}\` or \`${constants.PREFIX}${args[0]} play\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'memory') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'Shows the memory usage of the bot process.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]}\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]}\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'ping') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'Displays the connection/speed of the bot.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]}\` or \`${constants.PREFIX}${args[0]} <type>\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]}\` or \`${constants.PREFIX}${args[0]} actual\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'roles') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'Shows a list of all roles on the server.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]}\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]}\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'serverinfo') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'Displays information about the server.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]}\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]}\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'stats') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'An overview of the statistics of the bot.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]}\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]}\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'uptime') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'Shows the uptime of the bot or operating system.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]}\` or \`${constants.PREFIX}${args[0]} <type>\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]}\` or \`${constants.PREFIX}${args[0]} os\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'userinfo') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'Displays information about a user on the server. Also works with the ID of a user.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]}\` or \`${constants.PREFIX}${args[0]} <mention>\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]}\` or \`${constants.PREFIX}${args[0]} @Fabiolous#4960\``,
								inline: true,
							},
							{
								name: 'Aliases',
								value: `\`${constants.PREFIX}whois\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'whois') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'Displays information about a user on the server. Also works with the ID of a user.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]}\` or \`${constants.PREFIX}${args[0]} <mention>\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]}\` or \`${constants.PREFIX}${args[0]} @Fabiolous#4960\``,
								inline: true,
							},
							{
								name: 'Aliases',
								value: `\`${constants.PREFIX}userinfo\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === '8ball') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'Get a yes or no answer.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]} <question>\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]} Should I buy that?\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'cleverbot') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'Talk to Cleverbot!',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]} <text>\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]} How are you?\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'coinflip') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'Flip a coin or choose between two things.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]}\` or \`${constants.PREFIX}${args[0]} <arg1> <arg2>\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]}\` or \`${constants.PREFIX}${args[0]} StayHome GoOutside\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'countdown') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'Set a countdown in seconds. Up to 24 hours.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]} <seconds>\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]} 3600\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'echo') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'Input will be repeated by the bot.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]} <text>\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]} Hello there.\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'gay') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'Returns a GIF and the mentioned person.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]} <mention>\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]} @Raytlye#7182\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'hakai') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: '\'Destroys\' another user.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]} <mention>\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]} @Raytlye#7182\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'invite') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'Get an invite link for the bot.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]}\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]}\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'lotto') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'Play lotto with a random number between 1 to 50.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]} <number>\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]} 31\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'rps') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'Play rock, paper, scissor against the bot.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]} <decision>\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]} paper\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'tts') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'Input will be repeated by the bot with text-to-speech.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]} <text>\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]} Hello there.\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'urban') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'Searches the Urban Dictionary for a definition.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]} <word(s)>\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]} Train\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'urbanrandom') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'Searches the Urban Dictionary for a random word.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]}\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]}\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (args[0] === 'vapeio') {
					return message.channel.send({
						embed: {
							title: `${args[0]} command`,
							color: constants.blue,
							timestamp: Date.now(),
							description: 'Moves Vapeio to the "ICH." voice channel for five seconds.',
							fields: [{
								name: 'Usage',
								value: `\`${constants.PREFIX}${args[0]}\``,
								inline: true,
							},
							{
								name: '\u200b',
								value: '\u200b',
								inline: true,
							},
							{
								name: 'Example',
								value: `\`${constants.PREFIX}${args[0]}\``,
								inline: true,
							},
							],
						},
					});
				}
				else if (!args[0]) {
					message.delete();
					const embed = new constants.Discord.MessageEmbed()
						.setColor(constants.blue)
						.setTimestamp()
						.setAuthor(constants.client.user.username, constants.client.user.displayAvatarURL())
						.setTitle('Commands')
						.setDescription(`This is a complete list of commands currently available for the bot.\nFor a list of custom commands, use \`${constants.PREFIX}custom\``)
						.addField('Owner', `\`${constants.PREFIX}eval\`\n\`${constants.PREFIX}restart\`\n\`${constants.PREFIX}setavatar\`\n\`${constants.PREFIX}setactivity\`\n\`${constants.PREFIX}setstatus\`\n\`${constants.PREFIX}shutdown\`\n`, true)
						.addField('Admin', `\`${constants.PREFIX}ban\`\n\`${constants.PREFIX}delete\`\n\`${constants.PREFIX}kick\`\n\`${constants.PREFIX}purge\`\n\`${constants.PREFIX}vckick\`\n`, true)
						.addBlankField(true)
						.addField('Music', `\`${constants.PREFIX}join\`\n\`${constants.PREFIX}leave\`\n\`${constants.PREFIX}np\`\n\`${constants.PREFIX}pause\`\n\`${constants.PREFIX}play\`\n\`${constants.PREFIX}queue\`\n\`${constants.PREFIX}resume\`\n\`${constants.PREFIX}search\`\n\`${constants.PREFIX}skip\`\n\`${constants.PREFIX}stop\`\n\`${constants.PREFIX}vcleave\`\n\`${constants.PREFIX}volume\`\n`, true)
						.addField('Info', `\`${constants.PREFIX}channelinfo\`\n\`${constants.PREFIX}channels\`\n\`${constants.PREFIX}custom\`\n\`${constants.PREFIX}help\`\n\`${constants.PREFIX}invite\`\n\`${constants.PREFIX}memory\`\n\`${constants.PREFIX}ping\`\n\`${constants.PREFIX}roles\`\n\`${constants.PREFIX}serverinfo\`\n\`${constants.PREFIX}stats\`\n\`${constants.PREFIX}uptime\`\n\`${constants.PREFIX}userinfo\`\n`, true)
						.addField('Miscellaneous', `\`${constants.PREFIX}8ball\`\n\`${constants.PREFIX}airhorn\`\n\`${constants.PREFIX}cleverbot\`\n\`${constants.PREFIX}coinflip\`\n\`${constants.PREFIX}countdown\`\n\`${constants.PREFIX}echo\`\n\`${constants.PREFIX}gay\`\n\`${constants.PREFIX}hakai\`\n\`${constants.PREFIX}invite\`\n\`${constants.PREFIX}lotto\`\n\`${constants.PREFIX}rps\`\n\`${constants.PREFIX}tts\`\n\`${constants.PREFIX}urban\`\n\`${constants.PREFIX}urbanrandom\`\n\`${constants.PREFIX}vapeio\`\n`, true);

					if ((message.author.id === constants.OWNER_ID) || (message.author.id === constants.LUCAS_ID)) {
						return message.channel.send({
							embed,
						});
					}
					else {
						message.author.send({
							embed,
						});
						message.channel.send({
							embed: {
								title: 'Help',
								color: constants.green,
								description: `${message.author}, please check your Direct Messages!`,
							},
						})
							.then(sent => sent.delete({
								timeout: 10000,
							}))
							.catch(err => {
								logToChannel('Error', `Error with the \`${command}\` command:\n${err}`, `${message.author.tag} typed: "${message.content}"`, message.author.displayAvatarURL());
								message.channel.send({
									embed: {
										title: 'Error',
										color: constants.red,
										description: `An error occured with the \`${command}\` command.`,
									},
								});
								return;
							});
						return;
					}
				}
				else return message.channel.send({
					embed: {
						title: 'Error',
						color: constants.red,
						description: `There is no \`${args.join(' ')}\` command.`,
					},
				});
			}
			catch (err) {
				logToChannel('Error', `Error with the \`${command}\` command:\n${err}`, `${message.author.tag} typed: "${message.content}"`, message.author.displayAvatarURL());
				message.channel.send({
					embed: {
						title: 'Error',
						color: constants.red,
						description: `An error occured with the \`${command}\` command.`,
					},
				});
				return;
			}
		}
	});
};