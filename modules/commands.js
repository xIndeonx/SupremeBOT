// requirements
const constants = require('./constants');
require('../bot');

// commands
commands = function () {
	constants.client.on('message', function (message) {
		if (message.author.bot) return;
		if (!message.content.startsWith(constants.PREFIX)) return;
		if (!message.guild) return;
		const args = message.content.slice(constants.PREFIX.length).trim().split(/ +/g);
		const command = args.shift().toLowerCase();

		if (command.startsWith('eval')) {
			if ((message.author.id === constants.OWNER_ID) || (message.author.id === constants.LUCAS_ID)) {
				try {
					const code = args.join(' ');
					var now = require('performance-now');
					var start = now();
					let evaled = eval(code);
					var end = now();

					if (typeof evaled !== 'string') {
						evaled = require('util').inspect(evaled);
					}
					console.log(clean(evaled));
					if (clean(evaled).length > 2000) {
						return message.channel.send({
							embed: {
								color: constants.red,
								title: 'Error',
								description: 'Evaluated code too long to display. Please check the console for the full evaluated code.',
							},
						});
					}
					return message.channel.send({
						embed: {
							color: constants.green,
							title: 'Success',
							description: '```xl\n' + clean(evaled) + '```Took `' + (end - start).toFixed(3) + 'ms`',
						},
					});
				}
				catch (err) {
					return message.channel.send({
						embed: {
							color: constants.red,
							title: 'Error',
							description: `\`\`\`xl\n${clean(err)}\n\`\`\``,
						},
					});
				}
			}
			else return;
		}
		else if (command.startsWith('setactivity')) {
			try {
				if ((message.author.id === constants.OWNER_ID) || (message.author.id === constants.LUCAS_ID)) {
					var type = parseInt(args[0]);
					var activityString = args.slice(1).join(' ');
					if (!args[0]) {
						message.delete();
						return message.channel.send({
							embed: {
								title: 'Error',
								color: constants.red,
								description: 'Could not set activity. Make sure you used the correct parameters.',
							},
						})
							.then(sent => sent.delete({
								timeout: 5000,
							}));
					}
					else {
						constants.client.user.setActivity(activityString, {
							type: type,
						});
						message.delete();
						return message.channel.send({
							embed: {
								title: 'Success',
								color: constants.green,
								description: `Successfully set activity to \`${activityString}\` with type \`${type}\`.`,
							},
						})
							.then(sent => sent.delete({
								timeout: 5000,
							}));
					}
				}
				else return;
			}
			catch (err) {
				logToChannel('Error', `Error with the \`${command}\` command:\n${err}`, `${message.author.tag} typed: "${message.content}"`, message.author.displayAvatarURL());
				message.channel.send({
					embed: {
						title: 'Error',
						color: constants.red,
						description: `An error occured with the \`${command}\` command.`,
					},
				})
					.then(sent => sent.delete({
						timeout: 5000,
					}));
				return;
			}
		}
		else if (command.startsWith('setavatar')) {
			try {
				if ((message.author.id === constants.OWNER_ID) || (message.author.id === constants.LUCAS_ID)) {
					var urlString = args.join(' ');
					if (!args[0]) {
						message.delete();
						return message.channel.send({
							embed: {
								title: 'Error',
								color: constants.red,
								description: 'Could not set avatar. Make sure you used the correct parameters.',
							},
						})
							.then(sent => sent.delete({
								timeout: 5000,
							}));
					}
					else if (urlString === 'reset') {
						constants.client.user.setAvatar();
						message.delete();
						return message.channel.send({
							embed: {
								title: 'Success',
								color: constants.green,
								description: 'Successfully reset the avatar.',
							},
						})
							.then(sent => sent.delete({
								timeout: 5000,
							}));
					}
					else {
						constants.client.user.setAvatar(urlString);
						message.delete();
						return message.channel.send({
							embed: {
								title: 'Success',
								color: constants.green,
								description: 'Successfully set the avatar.',
								thumbnail: {
									url: urlString,
								},
							},
						})
							.then(sent => sent.delete({
								timeout: 5000,
							}));
					}
				}
				else return;
			}
			catch (err) {
				logToChannel('Error', `Error with the \`${command}\` command:\n${err}`, `${message.author.tag} typed: "${message.content}"`, message.author.displayAvatarURL());
				message.channel.send({
					embed: {
						title: 'Error',
						color: constants.red,
						description: `An error occured with the \`${command}\` command.`,
					},
				})
					.then(sent => sent.delete({
						timeout: 5000,
					}));
				return;
			}
		}
		else if (command.startsWith('setstatus')) {
			try {
				if ((message.author.id === constants.OWNER_ID) || (message.author.id === constants.LUCAS_ID)) {
					if (args[0].toLowerCase() === 'dnd' || args[0].toLowerCase() === 'online' || args[0].toLowerCase() === 'idle' || args[0].toLowerCase() === 'invisible') {
						constants.client.user.setStatus(args[0].toLowerCase());
						message.delete();
						return message.channel.send({
							embed: {
								title: 'Success',
								color: constants.green,
								description: `Successfully set status to \`${args[0]}\`.`,
							},
						})
							.then(sent => sent.delete({
								timeout: 5000,
							}));
					}
					else {
						message.delete({
							timeout: 5000,
						});
						return message.channel.send({
							embed: {
								title: 'Error',
								color: constants.red,
								description: 'Wrong input. Please use `online`, `idle`, `dnd`, or `invisible`.',
							},
						})
							.then(sent => sent.delete({
								timeout: 5000,
							}));
					}
				}
				else return;
			}
			catch (err) {
				logToChannel('Error', `Error with the \`${command}\` command:\n${err}`, `${message.author.tag} typed: "${message.content}"`, message.author.displayAvatarURL());
				message.channel.send({
					embed: {
						title: 'Error',
						color: constants.red,
						description: `An error occured with the \`${command}\` command.`,
					},
				})
					.then(sent => sent.delete({
						timeout: 5000,
					}));
				return;
			}
		}
		else if (command.startsWith('restart')) {
			try {
				if ((message.author.id === constants.OWNER_ID) || (message.author.id === constants.LUCAS_ID)) {
					message.channel.send('Restarting...');
					setTimeout(function () {
						process.exit();
					}, 1000);
					return;
				}
				else return;
			}
			catch (err) {
				logToChannel('Error', `Error with the \`${command}\` command:\n${err}`, `${message.author.tag} typed: "${message.content}"`, message.author.displayAvatarURL());
				message.channel.send({
					embed: {
						title: 'Error',
						color: constants.red,
						description: `An error occured with the \`${command}\` command.`,
					},
				})
					.then(sent => sent.delete({
						timeout: 5000,
					}));
				return;
			}
		}
		else if (command.startsWith('shutdown')) {
			try {
				if ((message.author.id === constants.OWNER_ID) || (message.author.id === constants.LUCAS_ID)) {
					message.channel.send('Shutting down...');
					constants.client.destroy((err) => {
						logToChannel('Error', `Error while destroying the client:\n${err}`, message.author.tag, message.author.displayAvatarURL());
					});
					process.exitCode = 1;
				}
				else return;
			}
			catch (err) {
				logToChannel('Error', `Error with the \`${command}\` command:\n${err}`, `${message.author.tag} typed: "${message.content}"`, message.author.displayAvatarURL());
				message.channel.send({
					embed: {
						title: 'Error',
						color: constants.red,
						description: `An error occured with the \`${command}\` command.`,
					},
				})
					.then(sent => sent.delete({
						timeout: 5000,
					}));
				return;
			}
		}
		else if (command.startsWith('delete')) {
			try {
				if ((message.member.permissions.has('ADMINISTRATOR')) || (message.member.permissions.has('MANAGE_MESSAGES')) || (message.author.id === constants.OWNER_ID) || (message.author.id === constants.LUCAS_ID)) {
					if (message.channel.type === 'text') {
						let messagecount = parseInt(args[0]);
						if (isNaN(messagecount)) {
							return message.channel.send({
								embed: {
									title: 'Error',
									color: constants.red,
									description: 'Could not delete messages. Please enter a valid number.',
								},
							});
						}
						if (messagecount > 99) {
							return message.channel.send({
								embed: {
									title: 'Error',
									color: constants.red,
									description: 'Could not delete messages. Please enter a number lower than or equal to 99.',
								},
							});
						}
						messagecount = messagecount + 1;
						message.channel.messages.fetch({
							limit: messagecount,
						})
							.then(messages => message.channel.bulkDelete(messages));
						message.channel.send({
							embed: {
								title: 'Success',
								color: constants.green,
								description: 'You deleted: ' + (messagecount - 1) + ' message(s)',
							},
						})
							.then(sent => sent.delete({
								timeout: 5000,
							}));
						logToChannel('Information', 'Guild: ' + message.guild.name + '\nChannel: ' + message.channel.name + '\n\nDeleted Messages.\nCount: **' + (messagecount - 1) + '**', message.author.tag, message.author.displayAvatarURL());
						return;
					}
					else return;
				}
				else {
					return message.channel.send({
						embed: {
							title: 'Error',
							color: constants.red,
							description: 'You are not authorized to use this command.',
						},
					});
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
				})
					.then(sent => sent.delete({
						timeout: 5000,
					}));
				return;
			}
		}
		else if (command.startsWith('purge')) {
			try {
				if ((message.member.permissions.has('ADMINISTRATOR')) || (message.member.permissions.has('MANAGE_MESSAGES')) || (message.author.id === constants.OWNER_ID) || (message.author.id === constants.LUCAS_ID)) {
					if (message.channel.type === 'text') {
						message.channel.messages.fetch()
							.then(messages => {
								message.channel.bulkDelete(messages);
								var messagesDeleted = messages.array().length;
								message.channel.send({
									embed: {
										title: 'Success',
										color: constants.green,
										description: 'Purge successful: ' + messagesDeleted + ' message(s) fetched and deleted.',
									},
								})
									.then(sent => sent.delete({
										timeout: 5000,
									}));
								logToChannel('Information', 'Guild: ' + message.guild.name + '\nChannel: ' + message.channel.name + '\n\nPurge successful: **' + messagesDeleted + '**', message.author.tag, message.author.displayAvatarURL());
							})
							.catch(err => {
								logToChannel('Error', `Error while purging messages:\n${err}`, message.author.tag, message.author.displayAvatarURL());
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
					else return;
				}
				else {
					return message.channel.send({
						embed: {
							title: 'Error',
							color: constants.red,
							description: 'You are not authorized to use this command.',
						},
					});
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
				})
					.then(sent => sent.delete({
						timeout: 5000,
					}));
				return;
			}
		}
		else if (command.startsWith('8ball')) {
			try {
				return message.channel.send({
					embed: {
						title: 'The magic 8ball says...',
						description: eightball(),
						color: eightballColorDecider(),
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
		else if (command.startsWith('airhorn')) {
			try {
				const role = message.guild.roles.find('name', 'airhorn');
				if (!role) {
					if (message.member.permissions.has('MANAGE_ROLES')) {
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
							title: 'Error',
							description: 'Could not create the role `airhorn`. You need the `Manage Roles` permission.',
							color: constants.red,
						},
					});
				}
				else if (constants.queue.get(message.guild.id)) {
					return message.channel.send({
						embed: {
							title: 'Error',
							description: 'Can\'t play the airhorn right now...',
							color: constants.red,
						},
					});
				}
				else if (message.member.roles.exists('name', 'airhorn')) {
					const voiceChannel = message.member.voiceChannel;
					if (!voiceChannel) {
						return message.channel.send({
							embed: {
								description: '‼ You need to be in a voice channel!',
								color: constants.red,
							},
						});
					}
					else {
						if (args[0] === 'mlg') {
							voiceChannel.join()
								.then(connection => {
									const dispatcher = connection.playFile(constants.MLGAIRHORN_PATH);
									dispatcher.on('end', () => {
										voiceChannel.leave();
									});
									dispatcher.on('error', e => {
										console.log(e);
									});
									return;
								});
							return message.react('✅');
						}
						voiceChannel.join()
							.then(connection => {
								const dispatcher = connection.playFile(constants.AIRHORN_PATH);
								dispatcher.on('end', () => {
									voiceChannel.leave();
								});
								dispatcher.on('error', e => {
									console.log(e);
								});
								return;
							});
						return message.react('✅');
					}
				}
				else return message.channel.send({
					embed: {
						title: 'Error',
						color: constants.red,
						description: 'You need the `airhorn` role to use this command.',
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
		else if (command.startsWith('ban')) {
			try {
				if ((message.member.permissions.has('ADMINISTRATOR')) || (message.member.permissions.has('BAN_MEMBERS')) || (message.author.id === constants.OWNER_ID) || (message.author.id === constants.LUCAS_ID)) {
					const member = message.mentions.members.first();
					if (!message.guild.me.permissions.has('BAN_MEMBERS')) {
						return message.channel.send({
							embed: {
								title: 'Error',
								color: constants.red,
								description: 'I don\'t have the `Ban Members` permission.',
							},
						});
					}
					if (!member) {
						return message.channel.send({
							embed: {
								title: 'Error',
								color: constants.red,
								description: 'Please mention a valid member of this server.',
							},
						});
					}
					if (!member.bannable) {
						return message.channel.send({
							embed: {
								title: 'Error',
								color: constants.red,
								description: 'I cannot ban this user. Do they have a higher role?',
							},
						});
					}
					const days = parseInt(args[1]);
					const reason = args.slice(2).join(' ');
					if (!reason) {
						return message.channel.send({
							embed: {
								title: 'Error',
								color: constants.red,
								description: 'Please indicate a reason for the ban.',
							},
						});
					}
					if (isNaN(days)) {
						return message.channel.send({
							embed: {
								title: 'Error',
								color: constants.red,
								description: 'Please provide a valid day count for the ban.',
							},
						});
					}
					if (!days) {
						return message.channel.send({
							embed: {
								title: 'Error',
								color: constants.red,
								description: 'Please indicate a number of days for the ban.',
							},
						});
					}
					member.ban(days, reason)
						.catch(error => message.channel.send({
							embed: {
								title: 'Error',
								color: constants.red,
								description: `Sorry ${message.author}, I couldn't ban the user.\n **Error**: ${error}`,
							},
						}));
					logToChannel('Warning', `**${member}** has been banned from **${message.guild.name}**.\nDays: ${days}\nReason: ${reason}`, `Ban executed by ${message.author.tag}`, member.user.displayAvatarURL());
					return message.react('✅');
				}
				else {
					return message.channel.send({
						embed: {
							title: 'Error',
							color: constants.red,
							description: 'You are not authorized to use this command. You need the `Ban Members` permission.',
						},
					});
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
		else if (command.startsWith('channelinfo')) {
			try {
				let topic = message.channel.topic;
				if (message.channel.topic === null) {
					topic = 'None';
				}
				const embed = new constants.Discord.MessageEmbed()
					.setColor(constants.blue)
					.setAuthor(message.channel.name, message.guild.iconURL())
					.addField('Name', message.channel.name, true)
					.addField('ID', `\`${message.channel.id}\``, true)
					.addField('Topic', topic, true)
					.setFooter('Channel created: ' + getDay(message.channel.createdAt.getDay()) + ' ' + message.channel.createdAt.getMonth() + '/' + message.channel.createdAt.getDate() + '/' + message.channel.createdAt.getFullYear() + ' at ' + message.channel.createdAt.getHours() + 'H ' + message.channel.createdAt.getMinutes() + 'M');
				return message.channel.send({
					embed,
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
		else if (command.startsWith('channels')) {
			try {
				if ((message.member.permissions.has('ADMINISTRATOR')) || (message.member.permissions.has('MANAGE_CHANNELS')) || (message.author.id === constants.OWNER_ID) || (message.author.id === constants.LUCAS_ID)) {
					const channels = message.guild.channels.map(c => c.name);
					const embed = new constants.Discord.MessageEmbed()
						.setColor(constants.blue)
						.setTimestamp()
						.setAuthor(message.guild.name, message.guild.iconURL())
						.addField('List of Channels', '```\n' + channels.join('\n') + '```');
					return message.channel.send({
						embed,
					});
				}
				else return message.channel.send({
					embed: {
						title: 'Error',
						color: constants.red,
						description: 'You need the `Manage Channels` permission to use this command.',
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
		else if (command.startsWith('cleverbot')) {
			try {
				const CleverbotAPI = require('cleverbot-api');
				const cleverbot = new CleverbotAPI(constants.CLEVERBOT_KEY);

				var queryString = args.join(' ');
				message.channel.startTyping();

				return cleverbot.getReply({
					input: queryString,
				}, (error, response) => {
					if (error) {
						message.channel.stopTyping(true);
						throw error + message.channel.send({
							embed: {
								color: constants.red,
								title: 'Error',
								description: error,
							},
						})
							.then(logToChannel('Error', `Error while executing the cleverbot command:\n${error}`, message.author.tag, message.author.displayAvatarURL()));
					}
					message.channel.stopTyping(true);
					message.channel.send({
						embed: {
							color: constants.blue,
							title: 'Cleverbot says...',
							description: response.output,
						},
					});
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
		else if (command.startsWith('coinflip')) {
			try {
				return message.channel.send({
					embed: coinFlip(message.content),
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
		else if (command.startsWith('countdown')) {
			try {
				if (constants.isRunning === true) {
					return message.channel.send({
						embed: {
							title: 'Error',
							color: constants.red,
							description: 'Could not create countdown. A countdown is already running.',
						},
					});
				}
				else {
					let count = parseInt(args[0]);
					if (isNaN(count)) {
						return message.channel.send({
							embed: {
								title: 'Error',
								color: constants.red,
								description: 'Could not create countdown. Please enter a valid number.',
							},
						});
					}
					else if (count > 86400) {
						return message.channel.send({
							embed: {
								title: 'Error',
								color: constants.red,
								description: 'Could not create countdown. The maximum is 24 hours (86400 seconds).',
							},
						});
					}
					else {
						constants.isRunning = true;
						message.channel.send({
							embed: {
								color: constants.blue,
								title: 'Countdown',
								description: 'Countdown started. This will take approximately **' + format(args[0]) + '**',
							},
						}).then(sentmsg => {
							var i = args[0];
							var interval = setInterval(function () {
								sentmsg.edit({
									embed: {
										color: constants.blue,
										title: 'Countdown',
										description: '```' + format(i) + '```',
									},
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
											description: 'Countdown ended. Total time wasted: **' + format(args[0]) + '**',
										},
									});
									clearInterval(interval);
									constants.isRunning = false;
								}
							}(args[0]));
						});
						return;
					}
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
		else if (command.startsWith('echo')) {
			try {
				if (!args[0]) {return;}
				else {
					var string = args.join(' ');
					message.delete();
					setTimeout(function () {
						message.channel.send(string);
					}, 300);
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
		else if (command.startsWith('gay')) {
			try {
				if (!message.mentions.users.first()) {
					var string = args.join(' ');
					return message.channel.send({
						embed: {
							description: `**${string}, HA! GAYYYYYYYYYYY!**`,
							color: constants.blue,
							image: {
								url: 'https://media.giphy.com/media/26xBI0mwTQj8IL6so/giphy.gif',
							},
						},
					});
				}
				else {
					if (message.mentions.users.size === 1) {
						if (message.mentions.users.first() != message.author) {
							return message.channel.send({
								embed: {
									description: `**${args.join(' ')}, HA! GAYYYYYYYYYYY!**`,
									color: constants.blue,
									image: {
										url: 'https://media.giphy.com/media/26xBI0mwTQj8IL6so/giphy.gif',
									},
								},
							});
						}
						else {
							return message.channel.send({
								embed: {
									title: 'Error',
									color: constants.red,
									description: `Are you really gay yourself, ${message.author}?`,
								},
							});
						}
					}
					if (message.mentions.users.size > 1) {
						return message.channel.send({
							embed: {
								title: 'Error',
								color: constants.red,
								description: 'Specified too many users.',
							},
						});
					}
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
		else if (command.startsWith('google')) {
			try {
				const googleImages = require('node-google-image-search');
				var search = args.join(' ');
				googleImages(search, callback, 0, 1);

				function callback(results) {
					const embed = new constants.Discord.MessageEmbed()
						.setImage(results[0].link);
					message.channel.send({
						embed
					});
				}
				return;
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
		else if (command.startsWith('hakai')) {
			try {
				if (message.mentions.users.size === 0) {
					return message.channel.send({
						embed: {
							title: 'Error',
							color: constants.red,
							description: 'Did not specify a user.',
						},
					});
				}
				if (message.mentions.users.size === 1) {
					if (message.mentions.users.first() != message.author) {
						return message.channel.send({
							embed: {
								title: 'Hakai',
								color: constants.blue,
								description: `${message.mentions.users.first()} has been destroyed by ${message.author}`,
							},
						});
					}
					else {
						return message.channel.send({
							embed: {
								title: 'Error',
								color: constants.red,
								description: `You cannot destroy yourself, ${message.author}`,
							},
						});
					}
				}
				if (message.mentions.users.size > 1) {
					return message.channel.send({
						embed: {
							title: 'Error',
							color: constants.red,
							description: 'Specified too many users.',
						},
					});
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
		else if (command.startsWith('invite')) {
			try {
				return constants.client.generateInvite(['ADMINISTRATOR'])
					.then(link => {
						message.channel.send({
							embed: {
								color: constants.blue,
								title: 'Invite',
								description: `[Click here to invite me](${link})`,
							},
						});
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
		else if (command.startsWith('join')) {
			try {
				if (message.member.voiceChannel) {
					message.member.voiceChannel.join();
					return message.react('✅');
				}
				else {
					return message.channel.send({
						embed: {
							title: 'Error',
							color: constants.red,
							description: '‼ You need to join a voice channel first!',
						},
					});
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
		else if (command.startsWith('kick')) {
			try {
				if ((message.member.permissions.has('ADMINISTRATOR')) || (message.member.permissions.has('KICK_MEMBERS')) || (message.author.id === constants.OWNER_ID) || (message.author.id === constants.LUCAS_ID)) {
					const member = message.mentions.members.first();
					if (!message.guild.me.permissions.has('KICK_MEMBERS')) {
						return message.channel.send({
							embed: {
								title: 'Error',
								color: constants.red,
								description: 'I don\'t have the `Kick Members` permission.',
							},
						});
					}
					if (!member) {
						return message.channel.send({
							embed: {
								title: 'Error',
								color: constants.red,
								description: 'Please mention a valid member of this server.',
							},
						});
					}
					if (!member.kickable) {
						return message.channel.send({
							embed: {
								title: 'Error',
								color: constants.red,
								description: 'I cannot kick this user. Do they have a higher role?',
							},
						});
					}
					const reason = args.slice(1).join(' ');
					if (!reason) {
						return message.channel.send({
							embed: {
								title: 'Error',
								color: constants.red,
								description: 'Please indicate a reason for the kick.',
							},
						});
					}
					member.kick(reason)
						.catch(error => message.channel.send({
							embed: {
								title: 'Error',
								color: constants.red,
								description: `Sorry ${message.author}, I couldn't kick the user.\n **Error**: ${error}`,
							},
						}));
					logToChannel('Warning', `**${member}** has been kicked from **${message.guild.name}**.\nReason: ${reason}`, `Kick executed by ${message.author.tag}`, member.user.displayAvatarURL());
					return message.react('✅');
				}
				else {
					return message.channel.send({
						embed: {
							title: 'Error',
							color: constants.red,
							description: 'You are not authorized to use this command. You need the `Kick Members` permission.',
						},
					});
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
		else if (command.startsWith('lotto')) {
			try {
				return message.channel.send({
					embed: {
						title: 'Lotto',
						color: constants.blue,
						description: lotto(args[0]),
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
		else if (command.startsWith('memory')) {
			try {
				const used = process.memoryUsage();
				var usage = [];
				for (let key in used) {
					var output = `${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB\n`;
					var output = `${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`;
					usage.push(output);
				}
				return message.channel.send({
					embed: {
						title: 'Memory Usage',
						color: constants.blue,
						description: usage.toString(),
						description: usage.join('\n'),
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
		else if (command.startsWith('ping')) { // ping
			try {
				if (args[0] === 'ws' || args[0] === 'websocket') {
					return message.channel.send('**PONG**' + ' `' + (Date.now() - message.createdTimestamp) + 'ms`');
				}
				else if (args[0] === 'actual' || args[0] === 'real' || args[0] === 'realtime' || args[0] === 'rt') {
					return message.channel.send('Processing...')
						.then(sent => sent.edit('**PONG**' + ' `' + (sent.createdTimestamp - message.createdTimestamp) + 'ms`'));
				}
				else if (args[0] === 'api' || !args[0]) {
					return message.channel.send('**PONG**' + ' `' + Math.floor(constants.client.ping) + 'ms`');
				}
				else if (args[0] > 0 && args[1] > 0) {
					const member = message.mentions.members.first();
					if (!member && (message.author.id === constants.OWNER_ID) || !member && (message.author.id === constants.LUCAS_ID)) {
						return message.channel.send({
							embed: {
								title: 'Error',
								color: constants.red,
								description: 'Not a valid mention.',
							},
						});
					}
					console.log(`${message.author.tag}: ${constants.PREFIX}${command} ${args[0]} ${args[1]} ${member.user.tag}`);
					if ((message.author.id === constants.OWNER_ID) || (message.author.id === constants.LUCAS_ID)) {
						const seconds = args[1] * 1000;
						message.delete();
						for (i = args[0]; i > 0; i--) {
							(function (ind) {
								setTimeout(function () {
									message.channel.send(`${member}, ping.`)
										.then(msg => msg.delete());
								}, 1000 + (seconds * ind));
							})(i);
						}
						return;
					}
					else return;
				}
				else return;
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
		else if (command.startsWith('roles')) { // roles
			try {
				if ((message.member.permissions.has('ADMINISTRATOR')) || (message.member.permissions.has('MANAGE_ROLES')) || (message.author.id === constants.OWNER_ID) || (message.author.id === constants.LUCAS_ID)) {
					const roles = message.guild.roles.filter(r => r.sort).map(r => r.name);
					const embed = new constants.Discord.MessageEmbed()
						.setColor(constants.blue)
						.setTimestamp()
						.setAuthor(message.guild.name, message.guild.iconURL())
						.addField('List of Roles', '```\n' + roles.join('\n') + '```');
					return message.channel.send({
						embed,
					});
				}
				else return message.channel.send({
					embed: {
						title: 'Error',
						color: constants.red,
						description: 'You need the `Manage Roles` permission to use this command.',
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
		else if (command.startsWith('rps')) { // rps
			try {
				return message.channel.send({
					embed: {
						title: 'Result',
						color: constants.blue,
						description: rpsPrint(args[0], message.author),
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
		else if (command.startsWith('say')) {
			try {
				if ((message.member.permissions.has('ADMINISTRATOR')) || (message.author.id === constants.OWNER_ID) || (message.author.id === constants.LUCAS_ID)) {
					if (!args[0]) {
						return message.channel.send({
							embed: {
								title: 'Error',
								color: constants.red,
								description: `Please enter valid arguments. See \`${constants.PREFIX}help ${command}\` for more info.`,
							},
						});
					}
					if (args[0].toLowerCase() !== 'true' && args[0].toLowerCase() !== 'false') {
						return message.channel.send({
							embed: {
								title: 'Error',
								color: constants.red,
								description: 'Invalid argument for text-to-speech. Please use `true` or `false`.',
							},
						});
					}

					const channel = message.guild.channels.find('name', args[1].toLowerCase());

					if (channel && !args[2]) {
						return message.channel.send({
							embed: {
								title: 'Error',
								color: constants.red,
								description: 'Did not specify a message.',
							},
						});
					}
					if (!args[1]) {
						return message.channel.send({
							embed: {
								title: 'Error',
								color: constants.red,
								description: 'Did not specify a channel or message.',
							},
						});
					}
					const string = args.slice(2).join(' ');

					if (!channel) {
						message.delete();
						if (args[0] === 'true') {
							if (message.member.permissions.has('SEND_TTS_MESSAGES')) {
								return message.channel.send(args.slice(1).join(' '), {
									tts: true,
								});
							}
							else {
								return message.channel.send({
									embed: {
										title: 'Error',
										color: constants.red,
										description: 'You are not authorized to use this command. You need the `Send TTS Messages` permission.',
									},
								});
							}
						}
						else if (args[0] === 'false') {
							return message.channel.send(args.slice(1).join(' '));
						}
					}
					if (channel.type !== 'text') {
						return message.channel.send({
							embed: {
								title: 'Error',
								color: constants.red,
								description: 'Must use a text channel.',
							},
						});
					}
					if (!message.guild.channels.get(channel.id).permissionsFor(constants.client.user.id).has('VIEW_CHANNEL')) {
						return message.channel.send({
							embed: {
								title: 'Error',
								color: constants.red,
								description: 'I do not have access to this channel.',
							},
						});
					}
					if (!message.guild.channels.get(channel.id).permissionsFor(constants.client.user.id).has('SEND_MESSAGES')) {
						return message.channel.send({
							embed: {
								title: 'Error',
								color: constants.red,
								description: 'I cannot send messages to this channel. I need the `Send Messages` permission.',
							},
						});
					}
					if (message.channel.id === channel.id) {
						if (args[0] === 'true') {
							if (message.member.permissions.has('SEND_TTS_MESSAGES')) {
								message.delete();
								return channel.send(string, {
									tts: true,
								});
							}
							else {
								return message.channel.send({
									embed: {
										title: 'Error',
										color: constants.red,
										description: 'You are not authorized to use this command. You need the `Send TTS Messages` permission.',
									},
								});
							}
						}
						else if (args[0] === 'false') {
							message.delete();
							return channel.send(string);
						}
						else {
							return message.channel.send({
								embed: {
									title: 'Error',
									color: constants.red,
									description: 'An error occured with the command.',
								},
							});
						}
					}
					else if (args[0] === 'true') {
						if (message.member.permissions.has('SEND_TTS_MESSAGES')) {
							channel.send(string, {
								tts: true,
							});
							return message.react('✅');
						}
						else {
							return message.channel.send({
								embed: {
									title: 'Error',
									color: constants.red,
									description: 'You are not authorized to use this command. You need the `Send TTS Messages` permission.',
								},
							});
						}
					}
					else if (args[0] === 'false') {
						channel.send(string);
						return message.react('✅');
					}
					else {
						return message.channel.send({
							embed: {
								title: 'Error',
								color: constants.red,
								description: 'An error occured with the command.',
							},
						});
					}
				}
				else {
					return message.channel.send({
						embed: {
							title: 'Error',
							color: constants.red,
							description: 'You are not authorized to use this command.',
						},
					});
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
		else if (command.startsWith('serverinfo')) { // serverinfo
			try {
				if ((message.author.id === message.guild.owner.id) || (message.member.permissions.has('ADMINISTRATOR'))) {
					const embed = new constants.Discord.MessageEmbed()
						.setColor(constants.blue)
						.setAuthor(message.guild.name, message.guild.iconURL())
						.addField('Name', message.guild.name, true)
						.addField('ID', `\`${message.guild.id}\``, true)
						.addField('Owner', message.guild.owner.user.tag, true)
						.addField('Member Count', `${message.guild.memberCount} (${message.guild.members.filter(m => m.user.bot).size} bots)`, true)
						.addField('Region', getRegion(message.guild.region), true)
						.addField('Verification Level', getVL(message.guild.verificationLevel), true)
						.addField('Channels', message.guild.channels.size, true)
						.addField('Roles', message.guild.roles.size, true)
						.addField('Emojis', message.guild.emojis.size, true)
						.addField('Explicit Content Filter', getECF(message.guild.explicitContentFilter), true)
						.setFooter('Guild created: ' + getDay(message.guild.createdAt.getDay()) + ' ' + message.guild.createdAt.getMonth() + '/' + message.guild.createdAt.getDate() + '/' + message.guild.createdAt.getFullYear() + ' at ' + message.guild.createdAt.getHours() + 'H ' + message.guild.createdAt.getMinutes() + 'M');
					return message.channel.send({
						embed,
					});
				}
				else {
					const embed = new constants.Discord.MessageEmbed()
						.setColor(constants.blue)
						.setAuthor(message.guild.name, message.guild.iconURL())
						.addField('Name', message.guild.name, true)
						.addField('ID', `\`${message.guild.id}\``, true)
						.addField('Owner', message.guild.owner.user.tag, true)
						.addField('Member Count', `${message.guild.memberCount} (${message.guild.members.filter(m => m.user.bot).size} bots)`, true)
						.addField('Region', getRegion(message.guild.region), true)
						.addField('Channels', message.guild.channels.size, true)
						.addField('Roles', message.guild.roles.size, true)
						.addField('Emojis', message.guild.emojis.size, true)
						.addBlankField(true)
						.setFooter('Guild created: ' + getDay(message.guild.createdAt.getDay()) + ' ' + message.guild.createdAt.getMonth() + '/' + message.guild.createdAt.getDate() + '/' + message.guild.createdAt.getFullYear() + ' at ' + message.guild.createdAt.getHours() + 'H ' + message.guild.createdAt.getMinutes() + 'M');
					return message.channel.send({
						embed,
					});
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
		else if (command.startsWith('stats')) { // stats
			try {
				return message.channel.send({
					embed: {
						color: constants.blue,
						author: {
							name: constants.client.user.username,
							iconURL: constants.client.user.displayAvatarURL(),
						},
						fields: [{
							name: 'Tag',
							value: constants.client.user.tag,
							inline: true,
						},
						{
							name: 'ID',
							value: `\`${constants.client.user.id}\``,
							inline: true,
						},
						{
							name: 'Owner',
							value: 'Fabiolous#4960',
							inline: true,
						},
						{
							name: 'Co-owner',
							value: 'Raytlye#7182',
							inline: true,
						},
						{
							name: 'Guilds',
							value: constants.client.guilds.size,
							inline: true,
						},
						{
							name: 'Users',
							value: constants.client.users.size,
							inline: true,
						},
						{
							name: 'Version',
							value: constants.version,
							inline: true,
						},
						{
							name: 'Connection',
							value: getStatus(),
							inline: true,
						},
						{
							name: 'Ping',
							value: `\`${Math.floor(constants.client.ping)}ms\``,
							inline: true,
						},
						{
							name: 'Uptime',
							value: format(process.uptime()),
							inline: true,
						},
						{
							name: 'Voice Connections',
							value: constants.client.voiceConnections.size,
							inline: true,
						},
						{
							name: 'Last updated',
							value: constants.update,
							inline: true,
						},
						],
						timestamp: Date.now(),
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
		else if (command.startsWith('tts')) {
			try {
				if ((message.member.permissions.has('SEND_TTS_MESSAGES')) || (message.author.id === constants.OWNER_ID) || (message.author.id === constants.LUCAS_ID)) {
					if (!args[0]) {return;}
					else {
						var string = args.join(' ');
						message.delete();
						setTimeout(function () {
							message.channel.send(string, {
								tts: true,
							});
						}, 300);
						return;
					}
				}
				else {
					return message.channel.send({
						embed: {
							title: 'Error',
							color: constants.red,
							description: 'You are not authorized to use this command. You need the `Send TTS Messages` permission.',
						},
					});
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
		else if (command.startsWith('uptime')) {
			try {
				if (args[0] === 'process') {
					return message.channel.send({
						embed: {
							title: 'Uptime',
							color: constants.blue,
							description: 'Uptime of the bot process:\n**' + format(process.uptime()) + '**',
						},
					});
				}
				else if (args[0] === 'os') {
					return message.channel.send({
						embed: {
							title: 'Uptime',
							color: constants.blue,
							description: 'Uptime of the operating system:\n**' + format(require('os').uptime()) + '**',
						},
					});
				}
				else {
					return message.channel.send({
						embed: {
							title: 'Uptime',
							color: constants.blue,
							description: 'Uptime:\n**' + msToTime(constants.client.uptime) + '**',
						},
					});
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
		else if (command.startsWith('urban')) {
			try {
				var urban = require('urban-dictionary');
				var string = args.join(' ');
				urban.term(string, function (error, entries) {
					if (error) {
						const errorEmbed = new constants.Discord.MessageEmbed()
							.setTitle('Error')
							.setDescription('`' + error.message + '`')
							.setColor(constants.red);
						message.channel.send({
							embed: errorEmbed,
						});
						logToChannel('Error', `Error at the built-in error catching in the \`${command}\` command:\n${error.message}`, `${message.author.tag} typed: "${message.content}"`, message.author.displayAvatarURL());
						return;
					}
					else {
						var link = entries[0].permalink;
						var pic = 'https://pbs.twimg.com/profile_images/838627383057920000/m5vutv9g_400x400.jpg';
						const embed = new constants.Discord.MessageEmbed()
							.setTitle(entries[0].word)
							.addField('Definition', entries[0].definition)
							.addField('Example', entries[0].example + `\n\n[Click here for more info on **${entries[0].word}**](${link})`)
							.setFooter('Up: ' + entries[0].thumbs_up + ' | Down: ' + entries[0].thumbs_down)
							.setColor(constants.blue)
							.setThumbnail(pic);
						return message.channel.send({
							embed,
						});
					}
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
		else if (command.startsWith('urbanrandom')) {
			try {
				var urban = require('urban-dictionary');
				urban.random(function (error, entry) {
					if (error) {
						const errorEmbed = new constants.Discord.MessageEmbed()
							.setTitle('Error')
							.setDescription('`' + error.message + '`')
							.setColor(constants.red);
						message.channel.send({
							embed: errorEmbed,
						});
						logToChannel('Error', `Error at the built-in error catching in the \`${command}\` command:\n${error.message}`, `${message.author.tag} typed: "${message.content}"`, message.author.displayAvatarURL());
						return;
					}
					else {
						var link = entry.permalink;
						var pic = 'https://pbs.twimg.com/profile_images/838627383057920000/m5vutv9g_400x400.jpg';
						const embed = new constants.Discord.MessageEmbed()
							.setTitle(entry.word)
							.addField('Definition', entry.definition)
							.addField('Example', entry.example + `\n\n[Click here for more info on **${entry.word}**](${link})`)
							.setFooter('Up: ' + entry.thumbs_up + ' | Down: ' + entry.thumbs_down)
							.setColor(constants.blue)
							.setThumbnail(pic);
						return message.channel.send({
							embed,
						});
					}
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
		else if (command.startsWith('userinfo') || command.startsWith('whois')) {
			try {
				var member = message.mentions.members.first();
				if (member) {
					var nick = message.guild.members.get(member.id).nickname;
					if (nick === undefined || nick === null) {
						nick = 'No nickname';
					}
					else {
						nick = message.guild.members.get(member.id).nickname;
					}
					const embed = new constants.Discord.MessageEmbed()
						.setColor(constants.blue)
						.setAuthor(member.user.username, member.user.displayAvatarURL())
						.addField('Username', member.user.username, true)
						.addField('Discriminator', member.user.discriminator, true)
						.addField('ID', `\`${member.user.id}\``, true)
						.addField('Nickname', nick, true)
						.setFooter('User created: ' + getDay(member.user.createdAt.getDay()) + ' ' + member.user.createdAt.getMonth() + '/' + member.user.createdAt.getDate() + '/' + member.user.createdAt.getFullYear() + ' at ' + member.user.createdAt.getHours() + 'H ' + member.user.createdAt.getMinutes() + 'M');
					return message.channel.send({
						embed,
					});
				}
				else {
					var string = args.join(' ');
					var user;
					if (args[0] === 'ich' || args[0] === 'me') {
						user = message.author;
					}
					else if (string) {
						user = constants.client.users.get(string);
					}
					else {
						user = message.author;
					}
					if (user) {
						var nick = message.guild.members.get(user.id).nickname;
						if (nick === undefined || nick === null) {
							nick = 'No nickname';
						}
						else {
							nick = message.guild.members.get(user.id).nickname;
						}
						const embed = new constants.Discord.MessageEmbed()
							.setColor(constants.blue)
							.setAuthor(user.username, user.displayAvatarURL())
							.addField('Username', user.username, true)
							.addField('Discriminator', user.discriminator, true)
							.addField('ID', `\`${user.id}\``, true)
							.addField('Nickname', nick, true)
							.setFooter('User created: ' + getDay(user.createdAt.getDay()) + ' ' + user.createdAt.getMonth() + '/' + user.createdAt.getDate() + '/' + user.createdAt.getFullYear() + ' at ' + user.createdAt.getHours() + 'H ' + user.createdAt.getMinutes() + 'M');
						return message.channel.send({
							embed,
						});
					}
					else {
						return message.channel.send({
							embed: {
								title: 'Error',
								color: constants.red,
								description: `User not found. Try \`${constants.PREFIX}userinfo [mention]\` **OR** \`${constants.PREFIX}whois user_id\``,
							},
						});
					}
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
		else if (command.startsWith('vapeio')) {
			try {
				if (message.author.id != constants.OWNER_ID) {
					if (message.member.voiceChannel) {
						var vapeio = message.guild.members.get(constants.OWNER_ID);
						var previousChannel = vapeio.voiceChannelID;
						if (vapeio.voiceChannel) {
							if (vapeio.voiceChannelID === '340961232695853068') {
								return message.channel.send({
									embed: {
										title: 'Error',
										color: constants.red,
										description: 'De Vapeio isch leider scho verschobe worde.',
									},
								});
							}
							else if (vapeio.voiceChannelID !== message.member.voiceChannelID) {
								return message.channel.send({
									embed: {
										title: 'Error',
										color: constants.red,
										description: 'Du muesch mit em Vapeio im gliiche Voice Channel sii.',
									},
								});
							}
							else {
								vapeio.setVoiceChannel('340961232695853068');
								message.react('✅');
								setTimeout(function () {
									vapeio.setVoiceChannel(previousChannel);
								}, 5000);
								return;
							}
						}
						else {
							return message.channel.send({
								embed: {
									title: 'Error',
									color: constants.red,
									description: 'De Vapeio isch leider am vape und nöd da.',
								},
							});
						}
					}
					else {
						return message.channel.send({
							embed: {
								title: 'Error',
								color: constants.red,
								description: 'You need to be in a voice channel to use this command.',
							},
						});
					}
				}
				else {
					return message.channel.send({
						embed: {
							title: 'Error',
							color: constants.red,
							description: 'Nei Vapeio, du chasch dich nöd selber verschiebe.',
						},
					});
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
		else if (command.startsWith('vckick')) {
			try {
				if ((message.member.permissions.has('ADMINISTRATOR')) || (message.member.permissions.has('MOVE_MEMBERS')) || (message.author.id === constants.OWNER_ID) || (message.author.id === constants.LUCAS_ID)) {
					if (!message.guild.me.permissions.has('MOVE_MEMBERS')) {
						return message.channel.send({
							embed: {
								title: 'Error',
								color: constants.red,
								description: 'I don\'t have the `Move Members` permission.',
							},
						});
					}
					if (!message.guild.me.permissions.has('MANAGE_CHANNELS')) {
						return message.channel.send({
							embed: {
								title: 'Error',
								color: constants.red,
								description: 'I don\'t have the `Manage Channels` permission.',
							},
						});
					}
					var server = message.guild;
					var user = message.mentions.members.first();
					if (!user) {
						return message.channel.send({
							embed: {
								title: 'Error',
								color: constants.red,
								description: 'User not found.',
							},
						});
					}
					if (user.voiceChannel) {
						server.createChannel('kick', 'voice').then(function () {
							const kickChannel = server.channels.find('name', 'kick');
							user.setVoiceChannel(kickChannel);
							setTimeout(function () {
								kickChannel.delete()
									.then()
									.catch(err => {
										logToChannel('Error', `Error while deleting the vckick channel:\n${err}`, message.author.tag, message.author.displayAvatarURL());
										message.channel.send({
											embed: {
												title: 'Error',
												color: constants.red,
												description: `An error occured with the \`${command}\` command.`,
											},
										});
										return;
									});
							}, 500);
						});
						return message.react('✅');
					}
					else {
						return message.channel.send({
							embed: {
								title: 'Error',
								color: constants.red,
								description: 'User is not in a voice channel.',
							},
						});
					}
				}
				else {
					return message.channel.send({
						embed: {
							title: 'Error',
							color: constants.red,
							description: 'You are not authorized to use this command.',
						},
					});
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
		else if (command.startsWith('vcleave')) {
			try {
				if (message.member.voiceChannel) {
					message.member.voiceChannel.leave();
					message.react('✅');
					return;
				}
				else {
					return message.channel.send({
						embed: {
							title: 'Error',
							color: constants.red,
							description: '‼ You are not in a voice channel!',
						},
					});
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
		else if (command.startsWith('wolfram')) {
			try {
				if ((message.author.id === constants.OWNER_ID) || (message.author.id === constants.LUCAS_ID)) {
					var queryString = args.join(' ');

					const result = wolframAlpha(queryString);
					return message.channel.send(result);
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
		return;
	});
};