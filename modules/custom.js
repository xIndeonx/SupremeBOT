// requirements
let constants = require('./constants');
require('../bot');

// commands
customCommands = function () {
	constants.client.on('message', function (message) {
		if (message.author.bot) return;
		if (!message.content.startsWith(constants.PREFIX)) return;
		if (!message.guild) return;
		const args = message.content.slice(constants.PREFIX.length).trim().split(/ +/g);
		const command = args.shift().toLowerCase();
		if (command.startsWith('australia')) {
			const embed = new constants.Discord.MessageEmbed()
				.setTitle('Australia in a nutshell')
				.setColor(constants.black)
				.setImage('https://cdn.discordapp.com/attachments/367644529773379586/370929924564975616/images.jpg');
			return message.channel.send({
				embed,
			})
				.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
		}
		if ((message.guild.id === constants.GUILD_ID) || (message.guild.id === '377743832449679362') || (message.author.id === constants.OWNERID) || (message.author.id === constants.LUCASID)) {
			if (command.startsWith('1=0')) {
				return message.channel.send('1=0');
			}
			else if (command.startsWith('ademerci')) {
				return message.channel.send('Ademerci');
			}
			else if (command.startsWith('aha')) {
				return message.channel.send('Aha');
			}
			else if (command.startsWith('alina')) {
				return message.channel.send('Daddy?');
			}
			else if (command.startsWith('andreas')) {
				return message.channel.send('I heisse Andreas, nöd Oliver.');
			}
			else if (command.startsWith('andy') || command.startsWith('andi')) {
				return message.channel.send('De Andi füut sech elei in Bärn.');
			}
			else if (command.startsWith('auä')) {
				return message.channel.send('Auä!');
			}
			else if (command.startsWith('autismus')) {
				return message.channel.send('Autismus ist eine weitverbreitete Krankheit, vor allem im schweizerischen Bubikon.');
			}
			else if (command.startsWith('autist')) {
				return message.channel.send('Wüki?!?!?');
			}
			else if (command.startsWith('baumi')) {
				if (args[0] === '1') return message.channel.send('Cha de Alain scho d\'Uhr lese?');
				else if (args[0] === '2') return message.channel.send('Wetsch es Zäpfli?');
				else if (args[0] === '3') return message.channel.send('<@' + constants.LUCASID + '>, ab id Duschi')
					.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
				else if (args[0] === '4') return message.channel.send('Chopf im Sofa.');
				return message.channel.send(`Try using parameters from \`1-4\`. Example: \`${constants.PREFIX + command} 1\``)
					.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
			}
			else if (command.startsWith('bitte')) {
				return message.channel.send('Bitte gerngscheh.');
			}
			else if (command.startsWith('boogeyman')) {
				return message.channel.send('Kuka pelkää musta miestä?');
			}
			else if (command.startsWith('bzz')) { // bzz
				return message.channel.send('Bescht Schuel vom Kanton Horge.');
			}
			else if (command === 'claudio') {
				return message.channel.send('De Clö isch immer am schaffe.');
			}
			else if (command.startsWith('claudiolino')) {
				return message.channel.send('Clö, bitte, stfu.');
			}
			else if (command.startsWith('clö')) {
				return message.channel.send('Ich ha gseit **NEI**.');
			}
			else if ((command.startsWith('danke')) || (command.startsWith('merci'))) {
				const embed = new constants.Discord.MessageEmbed()
					.setTitle('Merci viu mol')
					.setColor(constants.blue)
					.setImage('https://t3.ftcdn.net/jpg/00/88/04/32/240_F_88043202_HGdQvy3vJoSYVznZXBx1n2JNvDhSk8Ss.jpg');
				return message.channel.send({
					embed,
				})
					.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
			}
			else if (command.startsWith('doni')) {
				return message.channel.send('Heb fressi oder ich küss dich.');
			}
			else if (command.startsWith('eis')) {
				return message.channel.send('isch keis.');
			}
			else if (command.startsWith('esgahtnöd')) {
				return message.channel.send('Es gaaaaaaaht nöööd.');
			}
			else if (command.startsWith('fabio')) {
				if (args[0] === '1') return message.channel.send('De Vabio isch en chline Memer.');
				else if (args[0] === '2') return message.channel.send('Wie isch d\'Matur? - Mis Lebe isch erfüllt.');
				else if (args[0] === '3' || args[0] === 'csgo') return message.channel.send('High risk - no reward.');
				else if (args[0] === '4' || args[0] === 'csgo2') return message.channel.send('AWP Chlauer EFZ');
				return message.channel.send(`Try using parameters from \`1-4\`. Example: \`${constants.PREFIX + command} 1\``)
					.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
			}
			else if (command.startsWith('fige')) {
				return message.channel.send('De Feliks het en usprägte Orientierigssinn.');
			}
			else if (command.startsWith('filip')) {
				return message.channel.send('Uf de Chopf gheit.');
			}
			else if (command.startsWith('gopfeteli')) {
				return message.channel.send('Gopfeteli');
			}
			else if (command.startsWith('gschicht')) {
				return message.channel.send('*glernt*');
			}
			else if (command.startsWith('hauptstadt')) {
				if (args[0] === '1') return message.channel.send('D\' Hauptstadt, wie du sicherlich scho ghört und glernt hesch, isch **Männedorf**.');
				else if (args[0] === '2') return message.channel.send('Auso **ICH** ha ghört **Walliselle** seg bekanntlich d\'Hauptstadt.');
				return message.channel.send(`Try using parameters from \`1-2\`. Example: \`${constants.PREFIX + command} 1\``)
					.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
			}
			else if (command.startsWith('hoi')) {
				return message.channel.send('Sali.');
			}
			else if (command.startsWith('hm')) {
				return message.channel.send('Hm?');
			}
			else if (command === 'ich') {
				return message.channel.send('***ICH*** stahn im __Mittelpunkt!!!111!!1!!1__');
			}
			else if (command.startsWith('ichi')) {
				return message.channel.send('Bruchsch hilf? **ICH** cha der helfe.');
			}
			else if (command.startsWith('iconic')) {
				return message.channel.send('Fabio and bottomfragging. Name a more iconic duo.');
			}
			else if (command.startsWith('interessiert')) {
				return message.channel.send('Wie es Loch im Chopf.');
			}
			else if (command.startsWith('ivan')) {
				return message.channel.send('Hoi zämä, i bims, dr Ivam. I bi ä waschächtä Schwiizer wiä mr gseht. Wohne duän i ~~IM REICH~~ in Öschtriich, und cha ou nid Schwiizertüütsch. Ademerci.');
			}
			else if (command.startsWith('jacob')) {
				return message.channel.send('Jeg elsker dig ligesom du elsker min fugtig migmig.');
			}
			else if (command.startsWith('jaoder')) {
				return message.channel.send('Ja oder.');
			}
			else if (command.startsWith('joel')) {
				return message.channel.send('IcH bI dE jOeL uNd IcH gLaUb AlLeS wO mEr MiR sEiT.');
			}
			else if (command.startsWith('kadder')) {
				if (args[0] === '1') return message.channel.send('Ich ha gern Klobürschtene.');
				else if (args[0] === '2') return message.channel.send('Tüend sie Wasser löse?');
				return message.channel.send(`Try using parameters from \`1-2\`. Example: \`${constants.PREFIX + command} 1\``)
					.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
			}
			else if (command.startsWith('ksh')) {
				return message.channel.send('Da lernsch vil, und Matur beschtahsch grad.');
			}
			else if (command.startsWith('lucas')) {
				if (args[0] === '1') return message.channel.send('Dr Luckckas verdient viu a dr HSR.');
				else if (args[0] === '2') return message.channel.send('exit');
				else if (args[0] === '3') return message.channel.send('ICH chan auto fahre');
				else if (args[0] === '4') return message.channel.send('Aber kei Angst!');
				else if (args[0] === '5' || args[0] === 'csgo') return message.channel.send('Regt sich nöd uf wemmer ihm d\'AWP chlaut.');
				return message.channel.send(`Try using parameters from \`1-5\`. Example: \`${constants.PREFIX + command} 1\``)
					.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
			}
			else if (command.startsWith('noah')) {
				return message.channel.send('Wo isch de Noah?');
			}
			else if (command.startsWith('oli')) {
				return message.channel.send('Ich bi sozial.');
			}
			else if (command.startsWith('ppap')) {
				return message.channel.send(':pen_fountain: :pineapple: :apple: :pen_fountain:');
			}
			else if (command.startsWith('praise')) {
				const praise = constants.client.emojis.find('name', 'praise');
				return message.channel.send(`Praise the Sun! ${praise}`)
					.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
			}
			else if (command.startsWith('pubg')) {
				return message.channel.send('1=0');
			}
			else if (command.startsWith('rip')) {
				return message.channel.send('Rest In Peace.');
			}
			else if (command.startsWith('snus')) {
				const embed = new constants.Discord.MessageEmbed()
					.setTitle('Die Uhrzeit')
					.setColor(constants.black)
					.setImage('http://www.odenssnus.eu/public/img/user/1026.png');
				return message.channel.send({
					embed,
				})
					.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
			}
			else if (command.startsWith('sorry')) {
				return message.channel.send('Sorry?');
			}
			else if (command.startsWith('stfu')) {
				return message.channel.send('Bitte, stfu.');
			}
			else if (command.startsWith('toubi')) {
				return message.channel.send('Hallo, ich heisse Toubi.');
			}
			else if (command.startsWith('velo')) {
				return message.channel.send('黒人が自転車を盗んだ');
			}
			else if (command.startsWith('vn')) {
				const embed = new constants.Discord.MessageEmbed()
					.setTitle('Vape Nation')
					.setColor(constants.green)
					.setImage('https://carboncostume.com/wordpress/wp-content/uploads/2016/04/vapenation.jpg');
				return message.channel.send({
					embed,
				})
					.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
			}
			else if (command.startsWith('weltbild')) {
				return message.channel.send('"Du hesch es falsches Weltbild."');
			}
			else if (command.startsWith('wiebitte')) {
				return message.channel.send('Wie bitte?');
			}
			else if (command.startsWith('zeit')) {
				return message.channel.send('Neun Uhr Achtzig.');
			}
			else if (command.startsWith('ziit')) {
				if (message.author.id === constants.OWNERID) {
					const embed = new constants.Discord.MessageEmbed()
						.setTitle('Vape Nation')
						.setColor(constants.green)
						.setImage('https://carboncostume.com/wordpress/wp-content/uploads/2016/04/vapenation.jpg');
					return message.channel.send({
						embed,
					})
						.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
				}
				else {
					const embed = new constants.Discord.MessageEmbed()
						.setTitle('Die Uhrzeit')
						.setColor(constants.black)
						.setImage('http://www.odenssnus.eu/public/img/user/1026.png');
					return message.channel.send({
						embed,
					})
						.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
				}
			}
			else if (command.startsWith('zoel')) {
				return message.channel.send('Hoi zäme, ich bi de Zoel, freut mi.');
			}
			else if (command.startsWith('zollike')) {
				return message.channel.send('Wo träum wahr werdet');
			}
			return;
		}
		else return;
	});
};