const playerInfo = require('../modules/playerInfo.js');
const scrapPlayers = require('../modules/scrapPlayers.js');
const http = require('http');
const $ = require('cheerio');

const teamColors = {
	'New York Voyagers': 0xbabf88,
	'Florida Space Rangers': 0x000001,
	'Outer Banks Aviators': 0xce5428,
	'Cancun Toros': 0xec60b0,
	'Providence Crabs': 0x0067b5,
	'Death Valley Scorpions': 0x9f1c33,
	'Vancouver Vandals': 0x228b22,
	'San Antonio Sloths': 0xc6b3a2,
	'Utah Railroaders': 0xa854c9,
	'Nashville Stars': 0x83c1ec,
	'Anchorage Wheelers': 0xa0fbff,
	'Amarillo Armadillos': 0xffdb00,
	'State College Swift Steeds': 0x519fd8,
	'Kingston Mounties': 0x460505,
	'Dallas Dynamos': 0x17ece5,
	'Kansas City Hepcats': 0xc9e5ff,
};

module.exports = {
	name: 'player',
	aliases: ['p', 'plyr'],
	description: 'Returns player info embed',
	cooldown: 5,
	execute(message, args, client) {
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
						color: teamColors[$('a[href*="team"]', data).eq(0).text()],
						author: {
							name: client.user.username,
							icon_url: client.user.avatarURL,
						},
						image: {
							url: $('img[src*="player"]', data).attr('src').replace('..', 'http://www.pbesim.com'),
						},
						thumbnail: {
							url: $('img[src*="team_logos"]', data).attr('src').replace('..', 'http://www.pbesim.com'),
						},
						title: title,
						url: `http://www.pbesim.com/players/player_${id}.html`,
						fields: [
							{
								name: 'Basic Stats',
								value:  title.startsWith('P') ? playerInfo.parsePitcherPage(data) : playerInfo.parseBatterPage(data),
								inline: true,
							},
							{
								name: 'Advanced Stats',
								value:  title.startsWith('P') ? playerInfo.parseAdvancedPitcherStats(data) : playerInfo.parseAdvancedBattingStats(data),
								inline: true,
							}],
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
	},
};