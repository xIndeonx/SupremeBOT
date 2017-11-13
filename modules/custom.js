// requirements
let constants = require('./constants');
require('../bot');

// commands
customCommands = function () {
	constants.client.on('message', function (message) {
		if (message.author.bot) return;
		if (!message.content.startsWith(constants.PREFIX)) return;
		if (!message.guild) return;
		if (message.content.toLowerCase().startsWith(`${constants.PREFIX}australia`)) { // australia
			const embed = new constants.Discord.RichEmbed()
				.setTitle('Australia in a nutshell')
				.setColor(constants.black)
				.setImage('https://cdn.discordapp.com/attachments/367644529773379586/370929924564975616/images.jpg');
			return message.channel.send({
				embed
			})
				.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
		}
		if ((message.guild.id === constants.GUILD_ID) || (message.guild.id === '377743832449679362')) {
			if (message.content.toLowerCase().startsWith(`${constants.PREFIX}1=0`)) { // 1=0
				return message.channel.send('1=0');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}ademerci`)) { // ademerci
				return message.channel.send('Ademerci');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}aha`)) { // aha
				return message.channel.send('Aha');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}alina`)) { // alina
				return message.channel.send('Daddy?');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}andreas`)) { // andreas
				return message.channel.send('I heisse Andreas, nöd Oliver.');
			}
			else if ((message.content.toLowerCase().startsWith(`${constants.PREFIX}andy`)) || (message.content.toLowerCase().startsWith(`${constants.PREFIX}andi`))) { // andy / andi
				return message.channel.send('De Andi füut sech elei in Bärn.');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}auä`)) { // auä
				return message.channel.send('Auä!');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}autismus`)) { // autismus
				return message.channel.send('Autismus ist eine weitverbreitete Krankheit, vor allem im schweizerischen Bubikon.');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}autist`)) { // autist
				return message.channel.send('Wüki?!?!?');
			}
			else if (message.content.toLowerCase() === `${constants.PREFIX}baumi`) { // baumi
				return message.channel.send(`Try using \`${constants.PREFIX}baumi1\`, \`${constants.PREFIX}baumi2\`, \`${constants.PREFIX}baumi3\`, or \`${constants.PREFIX}baumi4\`!`)
					.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}baumi1`)) { // baumi1
				return message.channel.send('Cha de Alain scho d\'Uhr lese?');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}baumi2`)) { // baumi2
				return message.channel.send('Wetsch es Zäpfli?');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}baumi3`)) { // baumi3
				return message.channel.send('<@' + constants.LUCASID + '>, ab id Duschi')
					.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}baumi4`)) { // baumi4
				return message.channel.send('Chopf im Sofa.');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}bitte`)) { // bitte
				return message.channel.send('Bitte gerngscheh.');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}boogeyman`)) { // boogeyman
				return message.channel.send('Kuka pelkää musta miestä?');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}bzz`)) { // bzz
				return message.channel.send('Bescht Schuel vom Kanton Horge.');
			}
			else if (message.content.toLowerCase() === `${constants.PREFIX}claudio`) { // claudio
				return message.channel.send('De Clö isch immer am schaffe.');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}claudiolino`)) { // claudiolino
				return message.channel.send('Clö, bitte, stfu.');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}clö`)) { // clö
				return message.channel.send('Ich ha gseit **NEI**.');
			}
			else if ((message.content.toLowerCase().startsWith(`${constants.PREFIX}danke`)) || (message.content.toLowerCase().startsWith(`${constants.PREFIX}merci`))) { // danke / merci
				const embed = new constants.Discord.RichEmbed()
					.setTitle('Merci viu mol')
					.setColor(constants.blue)
					.setImage('https://t3.ftcdn.net/jpg/00/88/04/32/240_F_88043202_HGdQvy3vJoSYVznZXBx1n2JNvDhSk8Ss.jpg');
				return message.channel.send({
					embed
				})
					.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}doni`)) { // doni
				return message.channel.send('Heb fressi oder ich küss dich.');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}eis`)) { // eis
				return message.channel.send('isch keis.');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}esgahtnöd`)) { // esgahtnöd
				return message.channel.send('Es gaaaaaaaht nöööd.');
			}
			else if (message.content.toLowerCase() === `${constants.PREFIX}fabio`) { // fabio
				return message.channel.send(`Try using \`${constants.PREFIX}fabio1\`, \`${constants.PREFIX}fabio2\`, \`${constants.PREFIX}fabiocsgo\`, or \`${constants.PREFIX}fabiocsgo2\`!`)
					.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}fabio1`)) { // fabio1
				return message.channel.send('De Vabio isch en chline Memer.');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}fabio2`)) { // fabio2
				return message.channel.send('Wie isch d\'Matur? - Mis Lebe isch erfüllt.');
			}
			else if (message.content.toLowerCase() === `${constants.PREFIX}fabiocsgo`) { // fabiocsgo
				return message.channel.send('High risk - no reward.');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}fabiocsgo2`)) { // fabiocsgo2
				return message.channel.send('AWP Chlauer EFZ');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}fige`)) { // fige
				return message.channel.send('De Feliks het en usprägte Orientierigssinn.');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}filip`)) { // filip
				return message.channel.send('Uf de Chopf gheit.');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}gopfeteli`)) { // gopfeteli
				return message.channel.send('Gopfeteli');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}gschicht`)) { // gschicht
				return message.channel.send('*glernt*');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}hoi`)) { // hoi
				return message.channel.send('Sali.');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}hm`)) { // hm
				return message.channel.send('Hm?');
			}
			else if (message.content.toLowerCase() === `${constants.PREFIX}ich`) { // ich
				return message.channel.send('***ICH*** stahn im __Mittelpunkt!!!111!!1!!1__');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}ichi`)) { // ichi
				return message.channel.send('Bruchsch hilf? **ICH** cha der helfe.');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}interessiert`)) { // interessiert
				return message.channel.send('Wie es Loch im Chopf.');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}ivan`)) { // ivan
				return message.channel.send('Hoi zämä, i bims, dr Ivam. I bi ä waschächtä Schwiizer wiä mr gseht. Wohne duän i ~~IM REICH~~ in Öschtriich, und cha ou nid Schwiizertüütsch. Ademerci.');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}jacob`)) { // jacob
				return message.channel.send('Jeg elsker dig ligesom du elsker min fugtig migmig.');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}jaoder`)) { // jaoder
				return message.channel.send('Ja oder.');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}joel`)) { // joel
				return message.channel.send('IcH bI dE jOeL uNd IcH gLaUb AlLeS wO mEr MiR sEiT.');
			}
			else if (message.content === `${constants.PREFIX}kadder`) { // kadder
				return message.channel.send('Ich ha gern Klobürschtene.');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}kadder2`)) { // kadder2
				return message.channel.send('Tüend sie Wasser löse?');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}ksh`)) { // ksh
				return message.channel.send('Da lernsch vil, und Matur beschtahsch grad.');
			}
			else if (message.content.toLowerCase() === `${constants.PREFIX}lucas`) { // lucas
				return message.channel.send(`Try using \`${constants.PREFIX}lucas1\`, \`${constants.PREFIX}lucas2\`, \`${constants.PREFIX}lucas3\`, \`${constants.PREFIX}lucas4\`, or \`${constants.PREFIX}lucascsgo\`!`)
					.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}lucas1`)) { // lucas1
				return message.channel.send('Dr Luckckas verdient viu a dr HSR.');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}lucas2`)) { // lucas2
				return message.channel.send('exit');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}lucas3`)) { // lucas3
				return message.channel.send('ICH chan auto fahre');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}lucas4`)) { // lucas4
				return message.channel.send('Aber kei Angst!');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}lucascsgo`)) { // lucascsgo
				return message.channel.send('Regt sich nöd uf wemmer ihm d\'AWP chlaut.');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}noah`)) { // noah
				return message.channel.send('Wo isch de Noah?');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}oli`)) { // oli
				return message.channel.send('Ich bi sozial.');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}ppap`)) { // ppap
				return message.channel.send(':pen_fountain: :pineapple: :apple: :pen_fountain:');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}praise`)) { // praise
				const praise = constants.client.emojis.find('name', 'praise');
				return message.channel.send(`Praise the Sun! ${praise}`)
					.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}pubg`)) { // pubg
				return message.channel.send('1=0');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}rip`)) { // rip
				return message.channel.send('Rest In Peace.');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}snus`)) { // snus
				const embed = new constants.Discord.RichEmbed()
					.setTitle('Die Uhrzeit')
					.setColor(constants.black)
					.setImage('http://www.odenssnus.eu/public/img/user/1026.png');
				return message.channel.send({
					embed
				})
					.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}sorry`)) { // sorry
				return message.channel.send('Sorry?');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}stfu`)) { // stfu
				return message.channel.send('Bitte, stfu.');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}toubi`)) { // toubi
				return message.channel.send('Hallo, ich heisse Toubi.');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}velo`)) { // velo
				return message.channel.send('黒人が自転車を盗んだ');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}vn`)) { // vn
				const embed = new constants.Discord.RichEmbed()
					.setTitle('Vape Nation')
					.setColor(constants.green)
					.setImage('https://carboncostume.com/wordpress/wp-content/uploads/2016/04/vapenation.jpg');
				return message.channel.send({
					embed
				})
					.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}weltbild`)) { // weltbild
				return message.channel.send('"Du hesch es falsches Weltbild."');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}zeit`)) { // zeit
				return message.channel.send('Neun Uhr Achtzig.');
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}ziit`)) { // ziit
				if (message.author.id === constants.OWNERID) {
					const embed = new constants.Discord.RichEmbed()
						.setTitle('Vape Nation')
						.setColor(constants.green)
						.setImage('https://carboncostume.com/wordpress/wp-content/uploads/2016/04/vapenation.jpg');
					return message.channel.send({
						embed
					})
						.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
				}
				else {
					const embed = new constants.Discord.RichEmbed()
						.setTitle('Die Uhrzeit')
						.setColor(constants.black)
						.setImage('http://www.odenssnus.eu/public/img/user/1026.png');
					return message.channel.send({
						embed
					})
						.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
				}
			}
			else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}zoel`)) { // zoel
				return message.channel.send('Hoi zäme, ich bi de Zoel, freut mi.');
			}
			return;
		}
		else return;
	});
};