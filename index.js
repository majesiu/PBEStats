const Discord = require('discord.js');
const http = require('http');
const $ = require('cheerio');

const { prefix, token } = require('./config.json');
const standings = require('./modules/standings.js');
const playerInfo = require('./modules/playerInfo.js');
const scrapPlayers = require('./modules/scrapPlayers.js');

const client = new Discord.Client();

client.on('ready', () => {
	standings.initializeStandings();
	scrapPlayers.initializePlayersList();
	console.log('Initialized Player List');
	console.log('Ready!');
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'ping') {
		message.channel.send('Pong.');
	}
	else if (command === 'st' || command === 'standings') {
		return message.channel.send({ embed: {
			color: 3447003,
			author: {
				name: client.user.username,
				icon_url: client.user.avatarURL,
			},
			title: 'PBE Current Standings',
			url: 'http://www.pbesim.com/leagues/league_100_standings.html',
			fields: [{
				name: 'PBE',
				value:  args[0] != null && args[0] === 'm' ? standings.standingsMinors() : standings.standingsMajors(),
			},
			],
			timestamp: new Date(),
			footer: {
				icon_url: client.user.avatarURL,
				text: '© majesiu',
			} },
		});
	}
	else if (command === 'p' || command === 'player') {
		const name = args.join(' ');
		console.log(`Player info: ${name}`);
		const id = scrapPlayers.getPlayers()[name];
		console.log(id);
		if(id) {
			http.get(`http://www.pbesim.com/players/player_${id}.html`, (resp) => {
				let data = '';
				resp.on('data', (chunk) => {
					data += chunk;
				});
				resp.on('end', () => {
					const title = $('.reptitle ', data).text();
					console.log(title);

					return message.channel.send({ embed: {
						color: 3447003,
						author: {
							name: client.user.username,
							icon_url: client.user.avatarURL,
						},
						title: title,
						url: `http://www.pbesim.com/players/player_${id}.html`,
						fields: [{
							name: 'Player Stats',
							value:  title.startsWith('P') ? playerInfo.parsePitcherPage(data) : playerInfo.parseBatterPage(data),
                        }],
                        image: {
                            url: 'https://i.imgur.com/wSTFkRM.png',
                        },
						timestamp: new Date(),
						footer: {
							icon_url: client.user.avatarURL,
							text: '© majesiu',
						} },
					});
				});
			}).on('error', (err) => {
				console.log('Error: ' + err.message);
			});
		}
		else {
			return message.channel.send(`Player ${name} not found`);
		}
	}
	else if (command === 'help') {
		return message.channel.send('```!st or !standings show current standings, add m e.g. !st m to see MiLPBE Standings\n!p Player Name show currents stats```');
	}
});

client.login(token);


// else if (command === 'args-info') {
// 	if (!args.length) {
// 		return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
// 	}
// 	else if (args[0] === 'foo') {
// 		return message.channel.send('bar');
// 	}
// 	message.channel.send(`First argument: ${args[0]}`);
// }
// else if (command === 'avatar') {
// 	if (!message.mentions.users.size) {
// 		return message.channel.send(`Your avatar: <${message.author.displayAvatarURL}>`);
// 	}
// }