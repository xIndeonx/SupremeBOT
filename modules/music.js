// requirements
const constants = require('./constants');
require('../bot');

// music
musicCommands = function () {
	constants.client.on('message', async message => {
		if (message.author.bot) return;
		if (!message.content.startsWith(constants.PREFIX)) return;
		const args = message.content.slice(constants.PREFIX.length).trim().split(/ +/g);
		const command = args.shift().toLowerCase();
		const searchString = args.join(' ');
		const url = args[0] ? args[0].replace(/<(.+)>/g, '$1') : '';
		const serverQueue = constants.queue.get(message.guild.id);

		if (command.startsWith('play')) {
			try {
				const voiceChannel = message.member.voiceChannel;
				if (!voiceChannel) return message.channel.send({
					embed: {
						description: '‼ You need to be in a voice channel to play music!',
						color: constants.red,
					},
				});
				const permissions = voiceChannel.permissionsFor(message.client.user);
				if (!permissions.has('CONNECT')) return message.channel.send({
					embed: {
						description: '‼ Cannot connect to your voice channel!',
						color: constants.red,
					},
				});
				if (!permissions.has('SPEAK')) return message.channel.send({
					embed: {
						description: '‼ Cannot speak in your voice channel!',
						color: constants.red,
					},
				});

				if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
					message.channel.startTyping();
					const playlist = await constants.youtube.getPlaylist(url);
					const videos = await playlist.getVideos();
					for (const video of Object.values(videos)) {
						try {
							const video2 = await constants.youtube.getVideoByID(video.id);
							await handleVideo(video2, message, voiceChannel, true);
						}
						catch (err) {
							if (err instanceof TypeError) console.error(err);
							else logToChannel('Error', `Error with the \`${constants.PREFIX}${command}\` command:\n${err}`, `${message.author.tag} typed: "${message.content}"`, message.author.displayAvatarURL());
							continue;
						}
					}
					message.channel.stopTyping(true);
					return message.channel.send({
						embed: {
							title: 'Playlist added',
							description: `**[${playlist.title}](${playlist.url})** has been added to the queue!`,
							color: constants.blue,
						},
					});
				}
				else {
					try {
						var video = await constants.youtube.getVideo(url);
					}
					catch (error) {
						try {
							var videos = await constants.youtube.searchVideos(searchString, 1);
							var video = await constants.youtube.getVideoByID(videos[0].id);
						}
						catch (err) {
							logToChannel('Error', `Error with the \`${constants.PREFIX}${command}\` command:\n${err}`, `${message.author.tag} typed: "${message.content}"`, message.author.displayAvatarURL());
							message.channel.stopTyping(true);
							return message.channel.send({
								embed: {
									description: '‼ Could not get search results.',
									color: constants.red,
								},
							});
						}
					}
					return handleVideo(video, message, voiceChannel);
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
		else if (command.startsWith('search')) {
			try {
				const voiceChannel = message.member.voiceChannel;
				const authorid = message.author.id;
				if (!voiceChannel) return message.channel.send({
					embed: {
						description: '‼ You need to be in a voice channel to play music!',
						color: constants.red,
					},
				});
				const permissions = voiceChannel.permissionsFor(message.client.user);
				if (!permissions.has('CONNECT')) return message.channel.send({
					embed: {
						description: '‼ Cannot connect to your voice channel!',
						color: constants.red,
					},
				});
				if (!permissions.has('SPEAK')) return message.channel.send({
					embed: {
						description: '‼ Cannot speak in your voice channel!',
						color: constants.red,
					},
				});

				if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
					message.channel.startTyping();
					const playlist = await constants.youtube.getPlaylist(url);
					const videos = await playlist.getVideos();
					for (const video of Object.values(videos)) {
						try {
							const video2 = await constants.youtube.getVideoByID(video.id);
							await handleVideo(video2, message, voiceChannel, true);
						}
						catch (err) {
							if (err instanceof TypeError) console.error(err);
							else logToChannel('Error', `Error with the \`${constants.PREFIX}${command}\` command:\n${err}`, `${message.author.tag} typed: "${message.content}"`, message.author.displayAvatarURL());
							continue;
						}
					}
					message.channel.stopTyping(true);
					return message.channel.send({
						embed: {
							title: 'Playlist added',
							description: `**[${playlist.title}](${playlist.url})** has been added to the queue!`,
							color: constants.blue,
						},
					});
				}
				else {
					try {
						var video = await constants.youtube.getVideo(url);
					}
					catch (error) {
						try {
							var videos = await constants.youtube.searchVideos(searchString, 5);
							let index = 0;
							message.channel.send({
								embed: {
									title: 'Search results',
									color: constants.blue,
									description: `${videos.map(video2 => `${++index} - [${video2.title}](${video2.url})`).join('\n')}`,
									footer: {
										text: 'Please input the number of the song you want to play (1-5). 30 seconds until cancellation.',
									},
								},
							});

							try {
								var response = await message.channel.awaitMessages(msg2 => msg2.author.id === authorid && msg2.content > 0 && msg2.content < 6, {
									max: 1,
									time: 30000,
									errors: ['time'],
								});
							}
							catch (err) {
								return message.channel.send({
									embed: {
										description: 'No or invalid input, cancelling video selection.',
										color: constants.red,
									},
								});
							}
							const videoIndex = parseInt(response.first().content);
							var video = await constants.youtube.getVideoByID(videos[videoIndex - 1].id);
						}
						catch (err) {
							logToChannel('Error', `Error with the \`${constants.PREFIX}${command}\` command:\n${err}`, `${message.author.tag} typed: "${message.content}"`, message.author.displayAvatarURL());
							return message.channel.send({
								embed: {
									description: '‼ Could not get search results.',
									color: constants.red,
								},
							});
						}
					}
					return handleVideo(video, message, voiceChannel);
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
		else if (command.startsWith('skip')) {
			try {
				if (!message.member.voiceChannel) return message.channel.send({
					embed: {
						description: '‼ You are not in a voice channel!',
						color: constants.red,
					},
				});
				if (!serverQueue) return message.channel.send({
					embed: {
						description: '‼ There is nothing playing.',
						color: constants.red,
					},
				});
				setTimeout(function () {
					serverQueue.connection.dispatcher.end('Skip command has been used.');
				}, 500);
				return message.channel.send({
					embed: {
						description: '⏭ Skipping...',
						color: constants.blue,
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
		else if (command.startsWith('stop') || command.startsWith('leave')) {
			try {
				if (!message.member.voiceChannel) return message.channel.send({
					embed: {
						description: '‼ You are not in a voice channel!',
						color: constants.red,
					},
				});
				if (!serverQueue) return message.channel.send({
					embed: {
						description: '‼ There is nothing playing.',
						color: constants.red,
					},
				});
				serverQueue.songs = [];
				serverQueue.connection.dispatcher.end('Stop command has been used.');
				return message.channel.send({
					embed: {
						description: '⏹ Successfully stopped.',
						color: constants.blue,
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
		else if (command.startsWith('volume')) {
			try {
				if (!message.member.voiceChannel) return message.channel.send({
					embed: {
						description: '‼ You are not in a voice channel!',
						color: constants.red,
					},
				});
				else if (!serverQueue) return message.channel.send({
					embed: {
						description: '‼ There is nothing playing.',
						color: constants.red,
					},
				});
				else if (!args[0]) return message.channel.send({
					embed: {
						description: `🔊 The current volume is: **${serverQueue.volume}**.`,
						color: constants.blue,
					},
				});
				else if (args[0]) {
					if (parseInt(serverQueue.volume) === parseInt(args[0])) {
						return message.channel.send({
							embed: {
								description: `🔊 The volume is already on **${serverQueue.volume}**.`,
								color: constants.orange,
							},
						});
					}
					else if (args[0] > 5) {
						if (serverQueue.volume >= 5) {
							return message.channel.send({
								embed: {
									description: `🔊 The volume is already on **${serverQueue.volume}** (maximum).`,
									color: constants.orange,
								},
							});
						}
						else {
							serverQueue.volume = 5;
							serverQueue.connection.dispatcher.setVolumeLogarithmic(5 / 5);
							return message.channel.send({
								embed: {
									description: `🔊 Set the volume to the maximum: **${serverQueue.volume}**.`,
									color: constants.orange,
								},
							});
						}
					}
					else if (args[0] <= 5) {
						serverQueue.volume = args[0];
						serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 5);
						return message.channel.send({
							embed: {
								description: `🔊 Set the volume to: **${serverQueue.volume}**.`,
								color: constants.blue,
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
		else if (command.startsWith('np')) {
			try {
				if (!serverQueue) return message.channel.send({
					embed: {
						description: '‼ There is nothing playing.',
						color: constants.red,
					},
				});
				return message.channel.send({
					embed: {
						description: `🎶 Now playing: **[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})**`,
						color: constants.blue,
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
		else if (command.startsWith('queue')) {
			try {
				if (!serverQueue) return message.channel.send({
					embed: {
						description: '‼ There is nothing playing.',
						color: constants.red,
					},
				});
				let index = 0;
				const queuelist = `\n${serverQueue.songs.map(song => `${++index} - [${song.title}](${song.url})`).join('\n')}`;
				const res = queuelist.split('\n');
				let output;
				if(!args[0] || args[0] === 1) {
					output = res.slice(0, 7);
					args[0] = 1;
				}
				else if(res.length > args[0] * 6 - 6) {
					output = res.slice((args[0] * 6 - 6), (args[0] * 6 + 1));
				}
				else if(isNaN(args[0])) {
					return message.channel.send({
						embed: {
							color: constants.red,
							description: 'A numeric input is required!',
						}
					});
				}
				else {
					const page = Math.ceil(res.length / 6);
					output = res.slice((page * 6 - 6), (page * 6 + 1));
					args[0] = page;
				}
				if (output.length < 2000) {
					return message.channel.send({
						embed: {
							title: 'Queue ' + `Page: ${args[0]}/${Math.ceil(res.length / 6)}`,
							color: constants.blue,
							description: output.join('\n'),
							footer: {
								text: `Now playing: ${serverQueue.songs[0].title}`,
							},
						},
					});
				}
				else {
					return message.channel.send({
						embed: {
							color: constants.red,
							description: 'Queue is too long to show.',
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
		else if (command.startsWith('pause')) {
			try {
				if (serverQueue && serverQueue.playing) {
					serverQueue.playing = false;
					serverQueue.connection.dispatcher.pause();
					return message.channel.send({
						embed: {
							description: '⏸ Successfully paused.',
							color: constants.blue,
						},
					});
				}
				return message.channel.send({
					embed: {
						description: '‼ There is nothing playing.',
						color: constants.red,
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
		else if (command.startsWith('resume')) {
			try {
				if (serverQueue && !serverQueue.playing) {
					serverQueue.playing = true;
					serverQueue.connection.dispatcher.resume();
					return message.channel.send({
						embed: {
							description: '▶ Successfully resumed.',
							color: constants.blue,
						},
					});
				}
				return message.channel.send({
					embed: {
						description: '‼ There is nothing playing.',
						color: constants.red,
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
		return;
	});
};