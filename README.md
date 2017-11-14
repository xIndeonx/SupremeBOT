# Discord Alpha

Alpha repository for the self-made JS Discord Bot

### Prerequisites

For you to be able to use this Discord-Bot you need to have the following things:


1. Discord Account
2. Your own Discord Server
3. [Invite this bot](https://discordapp.com/oauth2/authorize?client_id=359668621989117953&permissions=8&scope=bot)

## Commands

The bot uses **.** as prefix for every command.


Can be changed in the config.js file:
> exports.PREFIX = '.';


### Owner and Admin commands:


| Commands | Description | Requirements |
| ------------- |:-------------:| -----:|
| Eval | Execute code in chat | Owner |
| Restart | Restart the bot | Owner |
| setAvatar | Change avatar with link to picture | Owner |
| setGame | Change game with a string as parameter | Owner |
| setStatus | Change status with parameter `Idle, DND, Online or Invisible`| Owner |
| Shutdown | Shutdown the bot | Owner |
| Wolfram | Use the wolfram API with any given string as paramter | Owner |
| Ban | Ban user permantely from server | Admin |
| Delete | Delete message with a number as paramter | Admin |
| Purge | Delete 50 messages at once | Admin |
| VCKick | Kick user from voice channel | Admin |


## Built With

* JavaScript - The programming language used
* [Node.js](https://nodejs.org/en/) - The server framework used
* [Discord.js](https://discord.js.org/#/) - Node.js module used to interact with the Discord API

## Versioning

No offical version published yet

## Creators

 - **Owner and Creator** - [Fabiolous](https://github.com/JustFabiolous)
 - **Co-programmer** - [Raytlye](https://github.com/Raytlye)

## License

This project is not licensed and can be used by anyone.

Please mention this site if you use our project :-)

## Acknowledgments

* [York Grimes'](https://anidiotsguide.gitbooks.io/discord-js-bot-guide/getting-started/the-long-version.html) An Idiot's Guide tutorial on how to make a Discord-Bot from scratch
* [Crawl's](https://www.youtube.com/playlist?list=PLVzaElkTvlQae8XJ0ujnEgz1GviufNx8h) tutorial for the music section of our bot
* Hat tip to anyone else who's code was used for this project

