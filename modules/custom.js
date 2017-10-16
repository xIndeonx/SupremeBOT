let constants = require('./constants');
require('../bot');

//commands
customCommands = function () {
    constants.client.on('message', function (message) {

        if (message.content.toUpperCase().startsWith(`${constants.PREFIX}1=0`)) { //1=0
            message.channel.send('1=0');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}ADEMERCI`)) { //ademerci
            message.channel.send('Ademerci');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}AHA`)) { //aha
            message.channel.send('Aha');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}ALINA`)) { //alina
            message.channel.send('Daddy?');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}ANDREAS`)) { //andreas
            message.channel.send('I heisse Andreas, nöd Oliver.');
        } else if ((message.content.toUpperCase().startsWith(`${constants.PREFIX}ANDY`)) || (message.content.toUpperCase().startsWith(`${constants.PREFIX}ANDI`))) { //andy / andi
            message.channel.send('De Andi füut sech elei in Bärn.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}AUÄ`)) { //auä
            message.channel.send('Auä!');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}AUTISMUS`)) { //autismus
            message.channel.send('Autismus ist eine weitverbreitete Krankheit, vor allem im schweizerischen Bubikon.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}AUTIST`)) { //autist
            message.channel.send('Wüki?!?!?');
        } else if (message.content.toUpperCase() === `${constants.PREFIX}BAUMI`) { //baumi
            message.channel.send('Try using \`' + constants.PREFIX + 'baumi1\`, \`' + constants.PREFIX + 'baumi2\`, \`' + constants.PREFIX + 'baumi3\`, or \`' + constants.PREFIX + 'baumi4\`!');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}BAUMI1`)) { //baumi1
            message.channel.send("Cha de Alain scho d'Uhr lese?");
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}BAUMI2`)) { //baumi2
            message.channel.send('Wetsch es Zäpfli?');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}BAUMI3`)) { //baumi3
            message.channel.send('<@' + constants.LUCASID + '>, ab id Duschi');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}BAUMI4`)) { //baumi4
            message.channel.send('Chopf im Sofa.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}BITTE`)) { //bitte
            message.channel.send('Bitte gerngscheh.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}BOOGEYMAN`)) { //boogeyman
            message.channel.send('Kuka pelkää musta miestä?');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}BZZ`)) { //bzz
            message.channel.send('Bescht Schuel vom Kanton Horge.');
        } else if (message.content.toUpperCase() === `${constants.PREFIX}CLAUDIO`) { //claudio
            message.channel.send('De Clö isch immer am schaffe.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}CLAUDIOLINO`)) { //claudiolino
            message.channel.send('Clö, bitte, stfu.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}CLÖ`)) { //clö
            message.channel.send('Ich ha gseit **NEI**.');
        } else if ((message.content.toUpperCase().startsWith(`${constants.PREFIX}DANKE`)) || (message.content.toUpperCase().startsWith(`${constants.PREFIX}MERCI`))) { //danke / merci
            const embed = new constants.Discord.RichEmbed()
                .setTitle('Merci viu mol')
                .setColor(constants.blue)
                .setImage('https://t3.ftcdn.net/jpg/00/88/04/32/240_F_88043202_HGdQvy3vJoSYVznZXBx1n2JNvDhSk8Ss.jpg')
            message.channel.send({
                embed
            });
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}DINIMOM`)) { //dinimom
            message.channel.send('WÜKI?!?!?!??');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}DONI`)) { //doni
            message.channel.send('Heb fressi oder ich küss dich.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}EINE`)) { //eine
            message.channel.send('isch keine.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}EIS`)) { //eis
            message.channel.send('isch keis.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}ESGAHTNÖD`)) { //esgahtnöd
            message.channel.send('Es gaaaaaaaht nöööd.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}EXIT`)) { //exit
            message.channel.send('Selbstmordorganisation');
        } else if (message.content.toUpperCase() === `${constants.PREFIX}FABIO`) { //fabio
            message.channel.send('De Vabio isch en chline Memer.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}FABIO2`)) { //fabio2
            message.channel.send('Wie isch d\'Matur? - Mis Lebe isch erfüllt.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}FABIOCSGO`)) { //fabiocsgo
            message.channel.send('High risk - no reward.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}FIGE`)) { //fige
            message.channel.send('De Feliks het en usprägte Orientierigssinn.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}FILIP`)) { //filip
            message.channel.send('Uf de Chopf gheit.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}GAME`)) { //game
            message.channel.send('Gits eis?');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}GETSHITON`)) { //getshiton
            message.channel.send('Catch it hard!');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}GOPFETELI`)) { //gopfeteli
            message.channel.send('Gopfeteli');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}GSCHICHT`)) { //gschicht
            message.channel.send('*glernt*');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}HOI`)) { //hoi
            message.channel.send('Sali.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}HM`)) { //hm
            message.channel.send('Hm?');
        } else if (message.content.toUpperCase() === `${constants.PREFIX}ICH`) { //ich
            message.channel.send('***ICH*** stahn im __Mittelpunkt!!!111!!1!!1__');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}ICHI`)) { //ichi
            message.channel.send('Bruchsch hilf? **ICH** cha der helfe.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}INTERESSIERT`)) { //interessiert
            message.channel.send('Wie es Loch im Chopf.');
        } else if ((message.content.toUpperCase().startsWith(`${constants.PREFIX}INYOURFACULTY`)) || (message.content.toUpperCase().startsWith(`${constants.PREFIX}INYOURFAMILY`)) || (message.content.toUpperCase().startsWith(`${constants.PREFIX}INYOURNAME`)) || (message.content.toUpperCase().startsWith(`${constants.PREFIX}INYOURSPIRIT`))) { //inyour... commands
            message.channel.send('BECEASED!!!1!!!!111!!1!!!');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}IVAN`)) { //ivan
            message.channel.send('Hoi zämä, i bims, dr Ivam. I bi ä waschächtä Schwiizer wiä mr gseht. Wohne duän i ~~IM REICH~~ in Öschtriich, und cha ou nid Schwiizertüütsch. Ademerci.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}JACOB`)) { //jacob
            message.channel.send('Jeg elsker dig ligesom du elsker min fugtig migmig.');
        } else if (message.content.toUpperCase() === `${constants.PREFIX}JESUS`) { //jesus
            message.channel.send('**IN THE NAAAAME OF JESUS!!!!!!**');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}JESUSCHRIST`)) { //jesuschrist
            message.channel.send('is my nigga.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}JOEL`)) { //joel
            message.channel.send('IcH bI dE jOeL uNd IcH gLaUb AlLeS wO mEr MiR sEiT.');
        } else if (message.content === `${constants.PREFIX}KADDER`) { //kadder
            message.channel.send('Ich ha gern Klobürschtene.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}KADDER2`)) { //kadder2
            message.channel.send('Tüend sie Wasser löse?');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}KSH`)) { //ksh
            message.channel.send('Da lernsch vil, und Matur beschtahsch grad.');
        } else if (message.content.toUpperCase() === `${constants.PREFIX}LUCAS`) { //lucas
            message.channel.send('Dr Luckckas verdient viu a dr HSR.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}LUCAS2`)) { //lucas2
            message.channel.send('exit');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}LUCAS3`)) { //lucas3
            message.channel.send('ICH chan auto fahre');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}MILA`)) { //mila
            message.channel.send('__**ACHT**__');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}NOAH`)) { //noah
            message.channel.send('Wo isch de Noah?');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}OLI`)) { //oli
            message.channel.send('Ich bi sozial.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}PPAP`)) { //ppap
            message.channel.send(':pen_fountain: :pineapple: :apple: :pen_fountain:');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}PUBG`)) { //pubg
            message.channel.send('1=0');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}RIP`)) { //rip
            message.channel.send('Rest In Peace.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}SNUS`)) { //snus
            const embed = new constants.Discord.RichEmbed()
                .setTitle('Die Uhrzeit')
                .setColor(constants.black)
                .setImage('http://www.odenssnus.eu/public/img/user/1026.png')
            message.channel.send({
                embed
            });
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}SORRY`)) { //sorry
            message.channel.send('Sorry?');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}STFU`)) { //stfu
            message.channel.send('Bitte, stfu.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}THERMOS`)) { //thermos
            message.channel.send('Ich rauch mini Thermoschanne voll dure.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}TOUBI`)) { //toubi
            message.channel.send('Hallo, ich heisse Toubi.');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}VELO`)) { //velo
            message.channel.send('黒人が自転車を盗んだ');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}VN`)) { //vn
            const embed = new constants.Discord.RichEmbed()
                .setTitle('Vape Nation')
                .setColor(constants.green)
                .setImage('https://carboncostume.com/wordpress/wp-content/uploads/2016/04/vapenation.jpg')
            message.channel.send({
                embed
            });
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}WELTBILD`)) { //weltbild
            message.channel.send('"Du hesch es falsches Weltbild."');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}ZEIT`)) { //zeit
            message.channel.send('Neun Uhr Achtzig.');
        } else if (message.content.toUpperCase() === `${constants.PREFIX}ZIIT`) { //ziit
            if (message.author.id === constants.OWNERID) {
                const embed = new constants.Discord.RichEmbed()
                    .setTitle('Vape Nation')
                    .setColor(constants.green)
                    .setImage('https://carboncostume.com/wordpress/wp-content/uploads/2016/04/vapenation.jpg')
                message.channel.send({
                    embed
                });
            } else {
                const embed = new constants.Discord.RichEmbed()
                    .setTitle('Die Uhrzeit')
                    .setColor(constants.black)
                    .setImage('http://www.odenssnus.eu/public/img/user/1026.png')
                message.channel.send({
                    embed
                });
            }
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}ZIIT?`)) { //ziit?
            message.channel.send('Ja, was isch denn für Ziit?');
        } else if (message.content.toUpperCase().startsWith(`${constants.PREFIX}ZOEL`)) { //zoel
            message.channel.send('Hoi zäme, ich bi de Zoel, freut mi.');
        }

    });
}