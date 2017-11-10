// requirements
let constants = require('./constants');
require('../bot');

// commands
commands = function () {
	constants.client.on('message', function (message) {
		if (message.author.bot) return;
		if (!message.content.startsWith(constants.PREFIX)) return;
		if (!message.guild) return;
		const args = message.content.split(' ');
		if (message.content.toLowerCase().startsWith(constants.EVAL)) { // eval
			if ((message.author.id === constants.OWNERID) || (message.author.id === constants.LUCASID)) {
				const args = message.content.split(' ').slice(1);
				try {
					const code = args.join(' ');
					var now = require('performance-now');
					var start = now();
					let evaled = eval(code);
					var end = now();

					if (typeof evaled !== 'string') {
						evaled = require('util').inspect(evaled);
					}

					message.channel.send({
						embed: {
							color: constants.green,
							title: 'Success',
							description: '```xl\n' + clean(evaled) + '```Took `' + (end - start).toFixed(3) + 'ms`'
						}
					});
				}
				catch (err) {
					message.channel.send({
						embed: {
							color: constants.red,
							title: 'Error',
							description: `\`\`\`xl\n${clean(err)}\n\`\`\``
						}
					});
				}
			}
			else {
				return;
			}
		}
		else if (message.content.toLowerCase().startsWith(constants.SET_GAME)) { // setgame
			if ((message.author.id === constants.OWNERID) || (message.author.id === constants.LUCASID)) {
				try {
					var gameString = args.slice(1).join(' ');
					constants.client.user.setPresence({
						game: {
							name: gameString,
							type: 0
						}
					});
					message.delete();
					message.channel.send({
						embed: {
							title: 'Success',
							color: constants.green,
							description: `Successfully set game to \`${gameString}\`.`
						}
					})
						.then(sent => sent.delete(5000));
				}
				catch (err) {
					logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL);
				}
			}
			else {
				message.channel.send({
					embed: {
						title: 'Error',
						color: constants.red,
						description: 'You are not authorized to use this command.'
					}
				})
					.then(sent => sent.delete(5000));
			}
		}
		else if (message.content.toLowerCase().startsWith(constants.SET_AVATAR)) { // setavatar
			if ((message.author.id === constants.OWNERID) || (message.author.id === constants.LUCASID)) {
				try {
					var urlString = args.slice(1).join(' ');
					constants.client.user.setAvatar(urlString);
					message.delete();
					message.channel.send({
						embed: {
							title: 'Success',
							color: constants.green,
							description: 'Successfully set the avatar.',
							thumbnail: {
								url: urlString
							}
						}
					})
						.then(sent => sent.delete(5000));
				}
				catch (err) {
					logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL);
				}
			}
			else {
				message.delete(5000);
				message.channel.send({
					embed: {
						title: 'Error',
						color: constants.red,
						description: 'You are not authorized to use this command.'
					}
				})
					.then(sent => sent.delete(5000));
			}
		}
		else if (message.content.toLowerCase().startsWith(constants.SET_STATUS)) { // setstatus
			if ((message.author.id === constants.OWNERID) || (message.author.id === constants.LUCASID)) {
				try {
					var statusString = args.slice(1).join(' ');
					if (statusString === ('dnd') || statusString === ('online') || statusString === ('idle') || statusString === ('invisible')) {
						constants.client.user.setStatus(statusString);
						message.delete();
						message.channel.send({
							embed: {
								title: 'Success',
								color: constants.green,
								description: `Successfully set status to \`${statusString}\`.`
							}
						})
							.then(sent => sent.delete(5000));
					}
					else {
						message.delete(5000);
						return message.channel.send({
							embed: {
								title: 'Error',
								color: constants.red,
								description: 'Wrong input. Please use `online`, `idle`, `dnd`, or `invisible`.'
							}
						})
							.then(sent => sent.delete(5000));
					}
				}
				catch (err) {
					logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL);
				}
			}
			else {
				message.channel.send({
					embed: {
						title: 'Error',
						color: constants.red,
						description: 'You are not authorized to use this command.'
					}
				})
					.then(sent => sent.delete(5000));
			}
		}
		else if (message.content.toLowerCase().startsWith(constants.RESTART)) { // restart
			if ((message.author.id === constants.OWNERID) || (message.author.id === constants.LUCASID)) {
				try {
					message.channel.send('Restarting...');
					setTimeout(function () {
						process.exit();
					}, 1000);
				}
				catch (err) {
					logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL);
				}
			}
			else {
				message.delete();
				message.channel.send({
					embed: {
						title: 'Error',
						color: constants.red,
						description: 'You are not authorized to use this command.'
					}
				})
					.then(sent => sent.delete(5000));
			}
		}
		else if (message.content.toLowerCase().startsWith(constants.SHUTDOWN)) { // shutdown
			if ((message.author.id === constants.OWNERID) || (message.author.id === constants.LUCASID)) {
				try {
					message.channel.send('Shutting down...');
					constants.client.destroy((err) => {
						logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL);
					});
					process.exitCode = 1;
				}
				catch (err) {
					logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL);
				}
			}
			else {
				message.delete();
				message.channel.send({
					embed: {
						title: 'Error',
						color: constants.red,
						description: 'You are not authorized to use this command.'
					}
				})
					.then(sent => sent.delete(5000));
			}
		}
		else if (message.content.toLowerCase().startsWith(constants.DELETE)) { // delete
			if ((message.member.permissions.has('ADMINISTRATOR')) || (message.author.id === constants.OWNERID) || (message.author.id === constants.LUCASID)) {
				try {
					if (message.channel.type == 'text') {
						var input = args.slice(1).join(' ');
						let messagecount = parseInt(input);
						if (isNaN(messagecount)) {
							return message.channel.send({
								embed: {
									title: 'Error',
									color: constants.red,
									description: 'Could not delete messages. Please enter a valid number.'
								}
							});
						}
						else {
							messagecount = messagecount + 1;
							message.channel.fetchMessages({
								limit: messagecount
							})
								.then(messages => message.channel.bulkDelete(messages));
							message.channel.send({
								embed: {
									title: 'Success',
									color: constants.green,
									description: 'You deleted: ' + (messagecount - 1) + ' message(s)'
								}
							})
								.then(sent => sent.delete(5000));
							logToChannel('Information', 'Guild Name: *' + message.guild.name + '*\nGuild ID: *' + message.guild.id + '*\nChannel Name: *' + message.channel.name + '*\nChannel ID: *' + message.channel.id + '*\n\nDeleted Messages.\nCount: **' + (messagecount - 1) + '**', message.author.tag, message.author.displayAvatarURL);
						}
					}
				}
				catch (err) {
					logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL);
				}
			}
			else {
				message.channel.send({
					embed: {
						title: 'Error',
						color: constants.red,
						description: 'You are not authorized to use this command.'
					}
				});
			}
		}
		else if (message.content.toLowerCase().startsWith(constants.PURGE)) { // purge
			if ((message.member.permissions.has('ADMINISTRATOR')) || (message.author.id === constants.OWNERID) || (message.author.id === constants.LUCASID)) {
				try {
					if (message.channel.type == 'text') {
						message.channel.fetchMessages()
							.then(messages => {
								message.channel.bulkDelete(messages);
								messagesDeleted = messages.array().length; // number of messages deleted
								// Logging the number of messages deleted on both the channel and console.
								message.channel.send({
									embed: {
										title: 'Success',
										color: constants.green,
										description: 'Purge successful: ' + messagesDeleted + ' message(s) fetched and deleted.'
									}
								})
									.then(sent => sent.delete(5000));
								logToChannel('Information', 'Guild Name: *' + message.guild.name + '*\nGuild ID: *' + message.guild.id + '*\nChannel Name: *' + message.channel.name + '*\nChannel ID: *' + message.channel.id + '*\n\nPurge successful: **' + messagesDeleted + '**', message.author.tag, message.author.displayAvatarURL);
							})
							.catch(err => {
								logToChannel('Error', 'Guild Name: *' + message.guild.name + '*\nGuild ID: *' + message.guild.id + '*\nChannel Name: *' + message.channel.name + '*\nChannel ID: *' + message.channel.id + '*\n\nError:\n' + err, message.author.tag, message.author.displayAvatarURL);
							});
					}
				}
				catch (err) {
					logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL);
				}
			}
			else {
				message.channel.send({
					embed: {
						title: 'Error',
						color: constants.red,
						description: 'You are not authorized to use this command.'
					}
				});
			}
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}8ball`)) { // 8ball
			message.channel.send({
				embed: {
					title: 'The magic 8ball says...',
					description: eightball(),
					color: eightballColorDecider()
				}
			})
				.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}ban`)) { // ban
			if ((message.member.permissions.has('ADMINISTRATOR')) || (message.member.permissions.has('BAN_MEMBERS')) || (message.author.id === constants.OWNERID) || (message.author.id === constants.LUCASID)) {
				const member = message.mentions.members.first();
				if(!message.guild.me.permissions.has('BAN_MEMBERS')) {
					return message.channel.send({
						embed: {
							title: 'Error',
							color: constants.red,
							description: 'I don\'t have the `Ban Members` permission.'
						}
					});
				}
				if (!member) {
					return message.channel.send({
						embed: {
							title: 'Error',
							color: constants.red,
							description: 'Please mention a valid member of this server.'
						}
					});
				}
				if (!member.bannable) {
					return message.channel.send({
						embed: {
							title: 'Error',
							color: constants.red,
							description: 'I cannot ban this user. Do they have a higher role?'
						}
					});
				}
				const reason = args.slice(2).join(' ');
				if (!reason) {
					return message.channel.send({
						embed: {
							title: 'Error',
							color: constants.red,
							description: 'Please indicate a reason for the ban.'
						}
					});
				}
				member.ban(reason)
					.catch(error => message.channel.send({
						embed: {
							title: 'Error',
							color: constants.red,
							description: `Sorry ${message.author}, I couldn't ban the user.\n **Error**: ${error}`
						}
					}));
				message.react('✅');
			}
			else {
				return message.channel.send({
					embed: {
						title: 'Error',
						color: constants.red,
						description: 'Sorry, you don\'t have permission to use this command. You need the `Ban Members` permission.'
					}
				});
			}
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}channelinfo`)) { // channelinfo
			try {
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
			}
			catch (err) {
				logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL);
			}
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}channels`)) { // channels
			try {
				const channels = message.guild.channels.map(c => c.name);
				const embed = new constants.Discord.RichEmbed()
					.setColor(constants.blue)
					.setTimestamp()
					.setAuthor(message.guild.name, message.guild.iconURL)
					.addField('List of Channels', '```\n' + channels.join('\n') + '```');
				message.channel.send({
					embed
				});
			}
			catch (err) {
				logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL);
			}
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}cleverbot`)) { // cleverbot
			const CleverbotAPI = require('cleverbot-api');
			const cleverbot = new CleverbotAPI(constants.CLEVERBOT_KEY);

			var queryString = args.slice(1).join(' ');
			message.channel.startTyping();
			cleverbot.getReply({
				input: queryString
			}, (error, response) => {
				if (error) {
					message.channel.stopTyping(true);
					throw error + message.channel.send({
						embed: {
							color: constants.red,
							title: 'Error',
							description: error
						}
					})
						.then(logToChannel('Error', error, message.author.tag, message.author.displayAvatarURL))
						.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
				}
				message.channel.stopTyping(true);
				message.channel.send({
					embed: {
						color: constants.blue,
						title: 'Cleverbot says...',
						description: response.output,
					}
				})
					.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
			});
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}coinflip`)) { // coinflip
			message.channel.send({
				embed: coinFlip(message.content)
			})
				.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}countdown`)) { // countdown
			if (constants.isRunning === true) {
				message.channel.send({
					embed: {
						title: 'Error',
						color: constants.red,
						description: 'Could not create countdown. A countdown is already running.'
					}
				});
				return;
			}
			else {
				try {
					var countString = args.slice(1).join(' ');
					let count = parseInt(countString);
					if (isNaN(count)) {
						message.channel.send({
							embed: {
								title: 'Error',
								color: constants.red,
								description: 'Could not create countdown. Please enter a valid number.'
							}
						});
						return;
					}
					else if (count > 86400) {
						message.channel.send({
							embed: {
								title: 'Error',
								color: constants.red,
								description: 'Could not create countdown. The maximum is 24 hours (86400 seconds).'
							}
						});
						return;
					}
					else {
						constants.isRunning = true;
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
									constants.isRunning = false;
								}
							}(countString));
						});
					}
				}
				catch (err) {
					logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL);
				}
			}
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}custom`)) { // custom
			try {
				message.delete();
				const embed = new constants.Discord.RichEmbed()
					.setColor(constants.red)
					.setTimestamp()
					.setAuthor(constants.client.user.username, constants.client.user.displayAvatarURL)
					.setTitle('Custom Commands')
					.setDescription('This is a complete list of all custom commands.')
					.addField('A-D', `\`${constants.PREFIX}1=0\`\n\`${constants.PREFIX}ademerci\`\n\`${constants.PREFIX}aha\`\n\`${constants.PREFIX}alina\`\n\`${constants.PREFIX}andreas\`\n\`${constants.PREFIX}andi\`\n\`${constants.PREFIX}andy\`\n\`${constants.PREFIX}auä\`\n\`${constants.PREFIX}australia\`\n\`${constants.PREFIX}autismus\`\n\`${constants.PREFIX}autist\`\n\`${constants.PREFIX}baumi\`\n\`${constants.PREFIX}bitte\`\n\`${constants.PREFIX}boogeyman\`\n\`${constants.PREFIX}bzz\`\n\`${constants.PREFIX}claudio\`\n\`${constants.PREFIX}claudiolino\`\n\`${constants.PREFIX}clö\`\n\`${constants.PREFIX}danke\`\n\`${constants.PREFIX}doni\`\n`, true)
					.addField('E-K', `\`${constants.PREFIX}eis\`\n\`${constants.PREFIX}esgahtnöd\`\n\`${constants.PREFIX}fabio\`\n\`${constants.PREFIX}ffs\`\n\`${constants.PREFIX}fige\`\n\`${constants.PREFIX}filip\`\n\`${constants.PREFIX}gopfeteli\`\n\`${constants.PREFIX}gschicht\`\n\`${constants.PREFIX}hoi\`\n\`${constants.PREFIX}hm\`\n\`${constants.PREFIX}ich\`\n\`${constants.PREFIX}ichi\`\n\`${constants.PREFIX}interessiert\`\n\`${constants.PREFIX}ivan\`\n\`${constants.PREFIX}jacob\`\n\`${constants.PREFIX}jaoder\`\n\`${constants.PREFIX}joel\`\n\`${constants.PREFIX}kadder\`\n\`${constants.PREFIX}kadder2\`\n`, true)
					.addField('K-Z', `\`${constants.PREFIX}ksh\`\n\`${constants.PREFIX}lucas\`\n\`${constants.PREFIX}merci\`\n\`${constants.PREFIX}noah\`\n\`${constants.PREFIX}oli\`\n\`${constants.PREFIX}ppap\`\n\`${constants.PREFIX}praise\`\n\`${constants.PREFIX}pubg\`\n\`${constants.PREFIX}rip\`\n\`${constants.PREFIX}snus\`\n\`${constants.PREFIX}sorry\`\n\`${constants.PREFIX}stfu\`\n\`${constants.PREFIX}toubi\`\n\`${constants.PREFIX}velo\`\n\`${constants.PREFIX}vn\`\n\`${constants.PREFIX}weltbild\`\n\`${constants.PREFIX}zeit\`\n\`${constants.PREFIX}ziit\`\n\`${constants.PREFIX}zoel\`\n`, true);

				if ((message.author.id === constants.OWNERID) || (message.author.id === constants.LUCASID)) {
					message.channel.send({
						embed
					})
						.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
				}
				else {
					message.author.send({
						embed
					})
						.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
					message.channel.send({
						embed: {
							title: 'Help',
							color: constants.green,
							description: `${message.author}, please check your Direct Messages!`
						}
					})
						.then(sent => sent.delete(10000)).catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
				}
			}
			catch (err) {
				logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL);
			}
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}echo`)) { // echo
			try {
				var string = args.slice(1).join(' ');
				message.delete(200);
				setTimeout(function () {
					message.channel.send(string);
				}, 300);
				logToChannel('Information', 'Guild Name: *' + message.guild.name + '*\nGuild ID: *' + message.guild.id + '*\n\nEcho command has been used:\n"' + string + '"', message.author.tag, message.author.displayAvatarURL);
			}
			catch (err) {
				logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL);
			}
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}hakai`)) { // hakai
			try {
				if (message.mentions.users.size == 0) return message.channel.send({
					embed: {
						title: 'Error',
						color: constants.red,
						description: 'Did not specify a user.'
					}
				});
				if (message.mentions.users.size == 1) {
					if (message.mentions.users.first() != message.author.toString()) {
						return message.channel.send({
							embed: {
								title: 'Hakai',
								color: constants.blue,
								description: `${message.mentions.users.first()} has been destroyed by ${message.author}`
							}
						});
					}
					else {
						return message.channel.send({
							embed: {
								title: 'Error',
								color: constants.red,
								description: `You cannot destroy yourself, ${message.author}`
							}
						});
					}
				}
				if (message.mentions.users.size > 1) return message.channel.send({
					embed: {
						title: 'Error',
						color: constants.red,
						description: 'Specified too many users.'
					}
				});
			}
			catch (err) {
				logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL);
			}
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}help`)) { // help
			try {
				message.delete();
				const embed = new constants.Discord.RichEmbed()
					.setColor(constants.red)
					.setTimestamp()
					.setAuthor(constants.client.user.username, constants.client.user.displayAvatarURL)
					.setTitle('Commands')
					.setDescription(`This is a complete list of commands currently available for the bot.\nFor a list of custom commands, use \`${constants.PREFIX}custom\``)
					.addField('Owner', `\`${constants.PREFIX}eval\`\n\`${constants.PREFIX}restart\`\n\`${constants.PREFIX}setavatar\`\n\`${constants.PREFIX}setgame\`\n\`${constants.PREFIX}setstatus\`\n\`${constants.PREFIX}shutdown\`\n\`${constants.PREFIX}wolfram\`\n`, true)
					.addField('Admin', `\`${constants.PREFIX}ban\`\n\`${constants.PREFIX}delete\`\n\`${constants.PREFIX}kick\`\n\`${constants.PREFIX}purge\`\n\`${constants.PREFIX}vckick\`\n`, true)
					.addBlankField(true)
					.addField('Music', `\`${constants.PREFIX}join\`\n\`${constants.PREFIX}leave\`\n\`${constants.PREFIX}np\`\n\`${constants.PREFIX}pause\`\n\`${constants.PREFIX}play\`\n\`${constants.PREFIX}queue\`\n\`${constants.PREFIX}resume\`\n\`${constants.PREFIX}search\`\n\`${constants.PREFIX}skip\`\n\`${constants.PREFIX}stop\`\n\`${constants.PREFIX}vcleave\`\n\`${constants.PREFIX}volume\`\n`, true)
					.addField('Info', `\`${constants.PREFIX}channelinfo\`\n\`${constants.PREFIX}channels\`\n\`${constants.PREFIX}custom\`\n\`${constants.PREFIX}help\`\n\`${constants.PREFIX}memory\`\n\`${constants.PREFIX}ping\`\n\`${constants.PREFIX}roles\`\n\`${constants.PREFIX}serverinfo\`\n\`${constants.PREFIX}uptime\`\n\`${constants.PREFIX}userinfo\`\n\`${constants.PREFIX}whois\`\n`, true)
					.addField('Miscellaneous', `\`${constants.PREFIX}8ball\`\n\`${constants.PREFIX}cleverbot\`\n\`${constants.PREFIX}coinflip\`\n\`${constants.PREFIX}countdown\`\n\`${constants.PREFIX}echo\`\n\`${constants.PREFIX}hakai\`\n\`${constants.PREFIX}invite\`\n\`${constants.PREFIX}lotto\`\n\`${constants.PREFIX}rps\`\n\`${constants.PREFIX}tts\`\n\`${constants.PREFIX}urban\`\n\`${constants.PREFIX}urbanrandom\`\n\`${constants.PREFIX}vapeio\`\n`, true);

				if ((message.author.id === constants.OWNERID) || (message.author.id === constants.LUCASID)) {
					message.channel.send({
						embed
					})
						.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
				}
				else {
					message.author.send({
						embed
					})
						.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
					message.channel.send({
						embed: {
							title: 'Help',
							color: constants.green,
							description: `${message.author}, please check your Direct Messages!`
						}
					})
						.then(sent => sent.delete(10000))
						.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
				}
			}
			catch (err) {
				logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL);
			}
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}invite`)) { // invite
			constants.client.generateInvite(['ADMINISTRATOR'])
				.then(link => {
					message.channel.send({
						embed: {
							color: constants.blue,
							title: 'Invite',
							description: `[Click here to invite me](${link})`
						}
					});
				})
				.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}join`)) { // join
			try {
				if (message.member.voiceChannel) {
					message.member.voiceChannel.join();
					message.react('✅');
				}
				else {
					message.channel.send({
						embed: {
							title: 'Error',
							color: constants.red,
							description: '‼ You need to join a voice channel first!'
						}
					});
				}
			}
			catch (err) {
				logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL);
			}
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}kick`)) { // kick
			if ((message.member.permissions.has('ADMINISTRATOR')) || (message.member.permissions.has('KICK_MEMBERS')) || (message.author.id === constants.OWNERID) || (message.author.id === constants.LUCASID)) {
				const member = message.mentions.members.first();
				if(!message.guild.me.permissions.has('KICK_MEMBERS')) {
					return message.channel.send({
						embed: {
							title: 'Error',
							color: constants.red,
							description: 'I don\'t have the `Kick Members` permission.'
						}
					});
				}
				if (!member) {
					return message.channel.send({
						embed: {
							title: 'Error',
							color: constants.red,
							description: 'Please mention a valid member of this server.'
						}
					});
				}
				if (!member.kickable) {
					return message.channel.send({
						embed: {
							title: 'Error',
							color: constants.red,
							description: 'I cannot kick this user. Do they have a higher role?'
						}
					});
				}
				const reason = args.slice(2).join(' ');
				if (!reason) {
					return message.channel.send({
						embed: {
							title: 'Error',
							color: constants.red,
							description: 'Please indicate a reason for the kick.'
						}
					});
				}
				member.kick(reason)
					.catch(error => message.channel.send({
						embed: {
							title: 'Error',
							color: constants.red,
							description: `Sorry ${message.author}, I couldn't kick the user.\n **Error**: ${error}`
						}
					}));
				message.react('✅');
			}
			else {
				return message.channel.send({
					embed: {
						title: 'Error',
						color: constants.red,
						description: 'Sorry, you don\'t have permission to use this command. You need the `Kick Members` permission.'
					}
				});
			}
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}lotto`)) { // lotto
			try {
				message.channel.send({
					embed: {
						title: 'Lotto',
						color: constants.blue,
						description: lotto(args[1])
					}
				});
			}
			catch (err) {
				logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL);
			}
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}memory`)) { // memory
			try {
				const used = process.memoryUsage();
				var usage = [];
				for (let key in used) {
					var output = `${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB\n`;
					var output = `${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`;
					usage.push(output);
				}
				message.channel.send({
					embed: {
						title: 'Memory Usage',
						color: constants.blue,
						description: usage.toString(),
						description: usage.join('\n')
					}
				});
			}
			catch (err) {
				logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL);
			}
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}ping`)) { // ping
			var string = args.slice(1).join(' ');
			if (string === 'realtime' || string === 'rt') {
				message.channel.send('**PONG**' + ' `' + (Date.now() - message.createdTimestamp) + 'ms`')
					.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
			}
			else {
				message.channel.send('**PONG**' + ' `' + Math.floor(constants.client.ping.toString()) + 'ms`')
					.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
			}
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}roles`)) { // roles
			try {
				const roles = message.guild.roles.map(r => r.name);
				const embed = new constants.Discord.RichEmbed()
					.setColor(constants.blue)
					.setTimestamp()
					.setAuthor(message.guild.name, message.guild.iconURL)
					.addField('List of Roles', '```\n' + roles.join('\n') + '```');
				message.channel.send({
					embed
				});
			}
			catch (err) {
				logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL);
			}
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}rps`)) { // rps
			try {
				var string = args.slice(1).join(' ');
				message.channel.send({
					embed: {
						title: 'Result',
						color: constants.blue,
						description: rpsPrint(string, message.author.toString())
					}
				});
			}
			catch (err) {
				logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL);
			}
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}serverinfo`)) { // serverinfo
			try {
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
			}
			catch (err) {
				logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL);
			}
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}tts`)) { // tts
			if (message.member.permissions.has('SEND_TTS_MESSAGES')) {
				try {
					var string = args.slice(1).join(' ');
					message.delete(200);
					setTimeout(function () {
						message.channel.send(string, {
							tts: true
						});
					}, 300);
					logToChannel('Information', 'Guild Name: *' + message.guild.name + '*\nGuild ID: *' + message.guild.id + '*\n\nTTS command has been used:\n**"**' + string + '**"**', message.author.tag, message.author.displayAvatarURL);
				}
				catch (err) {
					logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL);
				}
			}
			else {
				message.channel.send({
					embed: {
						title: 'Error',
						color: constants.red,
						description: 'You need the `Send TTS Messages` permission to use this command.'
					}
				});
			}
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}uptime`)) { // uptime
			var type = args.slice(1).join(' ');

			if (type === 'process') {
				message.channel.send({
					embed: {
						title: 'Uptime',
						color: constants.blue,
						description: 'Uptime of the bot process:\n**' + format(process.uptime()) + '**'
					}
				})
					.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
			}
			else if (type === 'os') {
				message.channel.send({
					embed: {
						title: 'Uptime',
						color: constants.blue,
						description: 'Uptime of the operating system:\n**' + format(require('os').uptime()) + '**'
					}
				})
					.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
			}
			else {
				message.channel.send({
					embed: {
						title: 'Uptime',
						color: constants.blue,
						description: 'Uptime:\n**' + msToTime(constants.client.uptime) + '**'
					}
				})
					.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
			}
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}urbanrandom`)) { // urbanrandom
			try {
				var urban = require('urban-dictionary');
				urban.random(function (error, entry) {
					if (error) {
						const errorEmbed = new constants.Discord.RichEmbed()
							.setTitle('Error')
							.setDescription('`' + error.message + '`')
							.setColor(constants.red);
						message.channel.send({
							embed: errorEmbed
						});
						console.error(error.message);
					}
					else {
						var link = entry.permalink;
						var pic = 'https://pbs.twimg.com/profile_images/838627383057920000/m5vutv9g_400x400.jpg';
						const embed = new constants.Discord.RichEmbed()
							.setTitle(entry.word)
							.addField('Definition', entry.definition)
							.addField('Example', entry.example + `\n\n[Link to this word](${link})`)
							.setFooter('Up: ' + entry.thumbs_up + ' | Down: ' + entry.thumbs_down)
							.setColor(constants.blue)
							.setThumbnail(pic);
						message.channel.send({
							embed
						});
					}
				});
			}
			catch (err) {
				logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL);
			}
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}urban`)) { // urban
			try {
				var urban = require('urban-dictionary');
				var string = args.slice(1).join(' ');
				urban.term(string, function (error, entries, tags, sounds) {
					if (error) {
						const errorEmbed = new constants.Discord.RichEmbed()
							.setTitle('Error')
							.setDescription('`' + error.message + '`')
							.setColor(constants.red);
						message.channel.send({
							embed: errorEmbed
						});
						console.error(error.message);
					}
					else {
						var link = entries[0].permalink;
						var pic = 'https://pbs.twimg.com/profile_images/838627383057920000/m5vutv9g_400x400.jpg';
						const embed = new constants.Discord.RichEmbed()
							.setTitle(entries[0].word)
							.addField('Definition', entries[0].definition)
							.addField('Example', entries[0].example + `\n\n[Link to this word](${link})`)
							.setFooter('Up: ' + entries[0].thumbs_up + ' | Down: ' + entries[0].thumbs_down)
							.setColor(constants.blue)
							.setThumbnail(pic);
						message.channel.send({
							embed
						});
					}
				});
			}
			catch (err) {
				logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL);
			}
		}
		else if ((message.content.toLowerCase().startsWith(`${constants.PREFIX}userinfo`)) || (message.content.toLowerCase().startsWith(`${constants.PREFIX}whois`))) { // userinfo / whois
			try {
				var member = message.mentions.members.first();
				if (member) {
					const embed = new constants.Discord.RichEmbed()
						.setColor(constants.blue)
						.setAuthor(member.user.username, member.user.displayAvatarURL)
						.addField('Username', member.user.username, true)
						.addField('Discriminator', member.user.discriminator, true)
						.addField('ID', member.user.id, true)
						.setFooter('User created: ' + getDay(member.user.createdAt.getDay()) + ' ' + member.user.createdAt.getMonth() + '/' + member.user.createdAt.getDate() + '/' + member.user.createdAt.getFullYear() + ' at ' + member.user.createdAt.getHours() + 'H ' + member.user.createdAt.getMinutes() + 'M');
					message.channel.send({
						embed
					});
				}
				else {
					var string = args.slice(1).join(' ');
					var user;
					if (string.toLowerCase() === 'ich' || string.toLowerCase() === 'me') {
						user = message.author;
					}
					else if (string) {
						user = constants.client.users.get(string);
					}
					else {
						user = message.author;
					}
					if (user) {
						const embed = new constants.Discord.RichEmbed()
							.setColor(constants.blue)
							.setAuthor(user.username, user.displayAvatarURL)
							.addField('Username', user.username, true)
							.addField('Discriminator', user.discriminator, true)
							.addField('ID', user.id, true)
							.setFooter('User created: ' + getDay(user.createdAt.getDay()) + ' ' + user.createdAt.getMonth() + '/' + user.createdAt.getDate() + '/' + user.createdAt.getFullYear() + ' at ' + user.createdAt.getHours() + 'H ' + user.createdAt.getMinutes() + 'M');
						message.channel.send({
							embed
						});
					}
					else {
						message.channel.send({
							embed: {
								title: 'Error',
								color: constants.red,
								description: `User not found. Try \`${constants.PREFIX}userinfo [mention]\` **OR** \`${constants.PREFIX}whois user_id\``
							}
						});
					}
				}
			}
			catch (err) {
				logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL);
			}
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}vapeio`)) { // vapeio
			if (message.author.id != constants.OWNERID) {
				if (message.member.voiceChannel) {
					var vapeio = message.guild.members.find('id', constants.OWNERID);
					if (vapeio.voiceChannel) {
						if (vapeio.voiceChannelID === '340961232695853068') {
							return message.channel.send({
								embed: {
									title: 'Error',
									color: constants.red,
									description: 'De Vapeio isch leider scho verschobe worde.'
								}
							});
						}
						else {
							vapeio.setVoiceChannel('340961232695853068');
							message.react('✅');
							return;
						}
					}
					else {
						return message.channel.send({
							embed: {
								title: 'Error',
								color: constants.red,
								description: 'De Vapeio isch leider am vape und nöd da.'
							}
						});
					}
				}
				else {
					return message.channel.send({
						embed: {
							title: 'Error',
							color: constants.red,
							description: 'You need to be in a voice channel to use this command.'
						}
					});
				}
			}
			else {
				return message.channel.send({
					embed: {
						title: 'Error',
						color: constants.red,
						description: 'Nei Vapeio, du chasch dich nöd selber verschiebe.'
					}
				});
			}
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}vckick`)) { // vckick

			if ((message.member.permissions.has('ADMINISTRATOR')) || (message.author.id === constants.OWNERID) || (message.author.id === constants.LUCASID)) {
				var server = message.guild;
				var user = message.mentions.members.first();
				if (user.voiceChannel) {
					server.createChannel('kick', 'voice').then(function () {
						const kickChannel = server.channels.find('name', 'kick');
						user.setVoiceChannel(kickChannel);
						setTimeout(function () {
							kickChannel.delete()
								.then()
								.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
						}, 500);
					});
					message.react('✅');

				}
				else message.channel.send({
					embed: {
						title: 'Error',
						color: constants.red,
						description: 'User not found.'
					}
				});
			}
			else message.channel.send({
				embed: {
					title: 'Error',
					color: constants.red,
					description: 'You do not have the permission to use this command.'
				}
			});

		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}vcleave`)) { // vcleave
			try {
				if (message.member.voiceChannel) {
					message.member.voiceChannel.leave();
					message.react('✅');
				}
				else {
					message.channel.send({
						embed: {
							title: 'Error',
							color: constants.red,
							description: '‼ You are not in a voice channel!'
						}
					});
				}
			}
			catch (err) {
				logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL);
			}
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}wolfram`)) { // wolfram
			if ((message.author.id === constants.OWNERID) || (message.author.id === constants.LUCASID)) {
				try {
					var wajs = require('wajs');
					var waClient = new wajs(constants.WOLFRAM_APPID);

					var queryString = args.slice(1).join(' ');

					waClient.query(queryString)
						.then(function (resp) {
							message.channel.send({
								embed: {
									color: constants.blue,
									title: queryString,
									description: resp
								}
							})
								.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
						})
						.catch(function (err) {
							logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL);
							message.channel.send({
								embed: {
									title: 'Error',
									color: constants.red,
									description: 'An error has occured.\n\nError:\n' + err
								}
							})
								.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
						});
				}
				catch (err) {
					logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL);
				}
			}
		}
	});
};