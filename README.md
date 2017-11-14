# Discord Alpha

Alpha repository for the self-made JavaScript Discord bot which uses the discord.js library

### Prerequisites

For you to be able to use this Discord bot you need to have the following things:


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
| eval | Execute JavaScript code directly in Discord | Owner |
| restart | Restart the bot | Owner |
| setAvatar | Change avatar with link to picture | Owner |
| setGame | Change game with a string as parameter | Owner |
| setStatus | Change status with parameters `idle`, `dnd`, `online` or `invisible`| Owner |
| shutdown | Shut down the bot | Owner |
| ban | Ban user permanently from server | Ban Members |
| delete | Delete message with a number as parameter | Manage Messages |
| kick | Kick a user from the server | Kick Members |
| purge | Delete 50 messages at once | Manage Messages |
| vckick | Kick user from voice channel | Admin |


[All commands](https://github.com/JustFabiolous/discord-alpha/wiki/Commands)


## Built with

* JavaScript - The programming language used
* [Node.js](https://nodejs.org/en/) - The server framework used
* [Discord.js](https://discord.js.org/#/) - Discord.js library / Node.js module used to interact with the Discord API

## Versioning

No official version published yet

## Creators

 - **Owner and Creator** - [Fabiolous](https://github.com/JustFabiolous)
 - **Co-programmer** - [Raytlye](https://github.com/Raytlye)

## License

This project is not licensed.
This project is closed-source and will remain so.

## Acknowledgements

* [York Grimes'](https://anidiotsguide.gitbooks.io/discord-js-bot-guide/getting-started/the-long-version.html) An Idiot's Guide tutorial on how to make a Discord-Bot from scratch
* [Crawl's](https://www.youtube.com/playlist?list=PLVzaElkTvlQae8XJ0ujnEgz1GviufNx8h) tutorial for the music commands of our bot
* Hat tip to anyone else whose code was used for this project

