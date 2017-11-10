// requirements
let constants = require('./constants');
require('../bot');

// commands
customCommands = function () {
	constants.client.on('message', function (message) {
		if (message.author.bot) return;
		if (!message.content.startsWith(constants.PREFIX)) return;
		if (!message.guild) return;
		if (message.content.toLowerCase().startsWith(`${constants.PREFIX}1=0`)) { // 1=0
			message.channel.send('1=0');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}ademerci`)) { // ademerci
			message.channel.send('Ademerci');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}aha`)) { // aha
			message.channel.send('Aha');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}alina`)) { // alina
			message.channel.send('Daddy?');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}andreas`)) { // andreas
			message.channel.send('I heisse Andreas, nöd Oliver.');
		}
		else if ((message.content.toLowerCase().startsWith(`${constants.PREFIX}andy`)) || (message.content.toLowerCase().startsWith(`${constants.PREFIX}andi`))) { // andy / andi
			message.channel.send('De Andi füut sech elei in Bärn.');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}auä`)) { // auä
			message.channel.send('Auä!');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}australia`)) { // australia
			const embed = new constants.Discord.RichEmbed()
				.setTitle('Australia in a nutshell')
				.setColor(constants.black)
				.setImage('https://cdn.discordapp.com/attachments/367644529773379586/370929924564975616/images.jpg');
			message.channel.send({
				embed
			})
				.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}autismus`)) { // autismus
			message.channel.send('Autismus ist eine weitverbreitete Krankheit, vor allem im schweizerischen Bubikon.');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}autist`)) { // autist
			message.channel.send('Wüki?!?!?');
		}
		else if (message.content.toLowerCase() === `${constants.PREFIX}baumi`) { // baumi
			message.channel.send(`Try using \`${constants.PREFIX}baumi1\`, \`${constants.PREFIX}baumi2\`, \`${constants.PREFIX}baumi3\`, or \`${constants.PREFIX}baumi4\`!`)
				.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}baumi1`)) { // baumi1
			message.channel.send('Cha de Alain scho d\'Uhr lese?');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}baumi2`)) { // baumi2
			message.channel.send('Wetsch es Zäpfli?');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}baumi3`)) { // baumi3
			message.channel.send('<@' + constants.LUCASID + '>, ab id Duschi')
				.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}baumi4`)) { // baumi4
			message.channel.send('Chopf im Sofa.');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}bitte`)) { // bitte
			message.channel.send('Bitte gerngscheh.');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}boogeyman`)) { // boogeyman
			message.channel.send('Kuka pelkää musta miestä?');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}bzz`)) { // bzz
			message.channel.send('Bescht Schuel vom Kanton Horge.');
		}
		else if (message.content.toLowerCase() === `${constants.PREFIX}claudio`) { // claudio
			message.channel.send('De Clö isch immer am schaffe.');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}claudiolino`)) { // claudiolino
			message.channel.send('Clö, bitte, stfu.');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}clö`)) { // clö
			message.channel.send('Ich ha gseit **NEI**.');
		}
		else if ((message.content.toLowerCase().startsWith(`${constants.PREFIX}danke`)) || (message.content.toLowerCase().startsWith(`${constants.PREFIX}merci`))) { // danke / merci
			const embed = new constants.Discord.RichEmbed()
				.setTitle('Merci viu mol')
				.setColor(constants.blue)
				.setImage('https://t3.ftcdn.net/jpg/00/88/04/32/240_F_88043202_HGdQvy3vJoSYVznZXBx1n2JNvDhSk8Ss.jpg');
			message.channel.send({
				embed
			})
				.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}doni`)) { // doni
			message.channel.send('Heb fressi oder ich küss dich.');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}eis`)) { // eis
			message.channel.send('isch keis.');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}esgahtnöd`)) { // esgahtnöd
			message.channel.send('Es gaaaaaaaht nöööd.');
		}
		else if (message.content.toLowerCase() === `${constants.PREFIX}fabio`) { // fabio
			message.channel.send('De Vabio isch en chline Memer.');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}fabio2`)) { // fabio2
			message.channel.send('Wie isch d\'Matur? - Mis Lebe isch erfüllt.');
		}
		else if (message.content.toLowerCase() === `${constants.PREFIX}fabiocsgo`) { // fabiocsgo
			message.channel.send('High risk - no reward.');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}fabiocsgo2`)) { // fabiocsgo2
			message.channel.send('AWP Chlauer EFZ');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}fige`)) { // fige
			message.channel.send('De Feliks het en usprägte Orientierigssinn.');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}filip`)) { // filip
			message.channel.send('Uf de Chopf gheit.');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}gopfeteli`)) { // gopfeteli
			message.channel.send('Gopfeteli');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}gschicht`)) { // gschicht
			message.channel.send('*glernt*');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}hoi`)) { // hoi
			message.channel.send('Sali.');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}hm`)) { // hm
			message.channel.send('Hm?');
		}
		else if (message.content.toLowerCase() === `${constants.PREFIX}ich`) { // ich
			message.channel.send('***ICH*** stahn im __Mittelpunkt!!!111!!1!!1__');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}ichi`)) { // ichi
			message.channel.send('Bruchsch hilf? **ICH** cha der helfe.');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}interessiert`)) { // interessiert
			message.channel.send('Wie es Loch im Chopf.');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}ivan`)) { // ivan
			message.channel.send('Hoi zämä, i bims, dr Ivam. I bi ä waschächtä Schwiizer wiä mr gseht. Wohne duän i ~~IM REICH~~ in Öschtriich, und cha ou nid Schwiizertüütsch. Ademerci.');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}jacob`)) { // jacob
			message.channel.send('Jeg elsker dig ligesom du elsker min fugtig migmig.');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}jaoder`)) { // jaoder
			message.channel.send('Ja oder.');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}joel`)) { // joel
			message.channel.send('IcH bI dE jOeL uNd IcH gLaUb AlLeS wO mEr MiR sEiT.');
		}
		else if (message.content === `${constants.PREFIX}kadder`) { // kadder
			message.channel.send('Ich ha gern Klobürschtene.');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}kadder2`)) { // kadder2
			message.channel.send('Tüend sie Wasser löse?');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}ksh`)) { // ksh
			message.channel.send('Da lernsch vil, und Matur beschtahsch grad.');
		}
		else if (message.content.toLowerCase() === `${constants.PREFIX}lucas`) { // lucas
			message.channel.send('Dr Luckckas verdient viu a dr HSR.');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}lucas2`)) { // lucas2
			message.channel.send('exit');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}lucas3`)) { // lucas3
			message.channel.send('ICH chan auto fahre');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}lucascsgo`)) { // lucascsgo
			message.channel.send('Regt sich nöd uf wemmer ihm d\'AWP chlaut.');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}noah`)) { // noah
			message.channel.send('Wo isch de Noah?');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}oli`)) { // oli
			message.channel.send('Ich bi sozial.');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}ppap`)) { // ppap
			message.channel.send(':pen_fountain: :pineapple: :apple: :pen_fountain:');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}praise`)) { // praise
			const praise = constants.client.emojis.find('name', 'praise');
			message.channel.send(`Praise the Sun! ${praise}`)
				.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}pubg`)) { // pubg
			message.channel.send('1=0');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}rip`)) { // rip
			message.channel.send('Rest In Peace.');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}snus`)) { // snus
			const embed = new constants.Discord.RichEmbed()
				.setTitle('Die Uhrzeit')
				.setColor(constants.black)
				.setImage('http://www.odenssnus.eu/public/img/user/1026.png');
			message.channel.send({
				embed
			})
				.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}sorry`)) { // sorry
			message.channel.send('Sorry?');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}stfu`)) { // stfu
			message.channel.send('Bitte, stfu.');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}toubi`)) { // toubi
			message.channel.send('Hallo, ich heisse Toubi.');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}velo`)) { // velo
			message.channel.send('黒人が自転車を盗んだ');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}vn`)) { // vn
			const embed = new constants.Discord.RichEmbed()
				.setTitle('Vape Nation')
				.setColor(constants.green)
				.setImage('https://carboncostume.com/wordpress/wp-content/uploads/2016/04/vapenation.jpg');
			message.channel.send({
				embed
			})
				.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}weltbild`)) { // weltbild
			message.channel.send('"Du hesch es falsches Weltbild."');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}zeit`)) { // zeit
			message.channel.send('Neun Uhr Achtzig.');
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}ziit`)) { // ziit
			if (message.author.id === constants.OWNERID) {
				const embed = new constants.Discord.RichEmbed()
					.setTitle('Vape Nation')
					.setColor(constants.green)
					.setImage('https://carboncostume.com/wordpress/wp-content/uploads/2016/04/vapenation.jpg');
				message.channel.send({
					embed
				})
					.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
			}
			else {
				const embed = new constants.Discord.RichEmbed()
					.setTitle('Die Uhrzeit')
					.setColor(constants.black)
					.setImage('http://www.odenssnus.eu/public/img/user/1026.png');
				message.channel.send({
					embed
				})
					.catch(err => logToChannel('Error', err, message.author.tag, message.author.displayAvatarURL));
			}
		}
		else if (message.content.toLowerCase().startsWith(`${constants.PREFIX}zoel`)) { // zoel
			message.channel.send('Hoi zäme, ich bi de Zoel, freut mi.');
		}
	});
};