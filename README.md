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
* [Discord.js](https://discord.js.org/) - Discord.js library / Node.js module used to interact with the Discord API
* [Airbrake](https://airbrake.io/) - Node.js module used for error tracking
* [ytdl-core](https://github.com/fent/node-ytdl-core) - Node.js module used for streaming (YouTube)
* [Simple YouTube API](https://github.com/HyperCoder2975/simple-youtube-api) - Node.js module used to interact with YouTube
* [performance-now](https://github.com/braveg1rl/performance-now) - Node.js module used for process time calculation
* [Util](https://github.com/defunctzombie/node-util) - Node.js util module
* [CleverbotAPI](https://github.com/Jqmey/cleverbot-api) - Node.js module used to interact with the Cleverbot API
* [node-os](https://github.com/DiegoRBaquero/node-os) - Node.js module
* [urban-dictionary](https://github.com/NightfallAlicorn/urban-dictionary) - Node.js module used to interact with the Urban Dictionary API
* [Wolfram|Alpha via JS](https://github.com/Cfeusier/wolfram-alpha-api-js) - Node.js module used to interact with the Wolfram|Alpha web-service API

## Versioning

Currently under development. No official version published yet.
Alpha 0.1

## Creators

 - **Owner and Creator** - [Fabiolous](https://github.com/JustFabiolous)
 - **Co-owner** - [Raytlye](https://github.com/Raytlye)

## License

This project is not licensed.
This project is closed-source and will remain so.

## Acknowledgements

* [York Grimes'](https://anidiotsguide.gitbooks.io/discord-js-bot-guide/getting-started/the-long-version.html) An Idiot's Guide tutorial on how to make a Discord-Bot from scratch
* [Crawl's](https://www.youtube.com/playlist?list=PLVzaElkTvlQae8XJ0ujnEgz1GviufNx8h) tutorial for the music commands of the bot
* Hat tip to anyone else whose code was used for this project