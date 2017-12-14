// requirements
const constants = require('./constants');
require('../bot');

// events
events = function () {
	constants.client.on('guildMemberAdd', member => {
		member.guild.channels.get(constants.BOT_CHANNEL).send({
			embed: {
				color: constants.green,
				description: `${member} has joined **${member.guild.name}**.`,
				fields: [{
					name: 'Tag',
					value: `${member.user.tag}`,
					inline: true,
				},
				{
					name: 'ID',
					value: `\`${member.id}\``,
					inline: true,
				},
				],
				timestamp: Date.now(),
			},
		});
	});

	constants.client.on('guildMemberRemove', member => {
		member.guild.channels.get(constants.BOT_CHANNEL).send({
			embed: {
				color: constants.red,
				description: `${member.user.tag} has left **${member.guild.name}**.`,
				fields: [{
					name: 'ID',
					value: `\`${member.id}\``,
					inline: true,
				},
				],
				timestamp: Date.now(),
			},
		});
	});
};