/**
* MIT License
*
* Copyright (c) 2019 Paweł Majewski
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/
const scrapPlayers = require('../modules/scrapPlayers.js');
const http = require('http');
const $ = require('cheerio');
const playerPersistence = require('../modules/playerPersistence');
const FuzzySearch = require('fuzzy-search');
const { table, getBorderCharacters } = require('table');

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
	name: 'recent',
	aliases: ['l10', 'trend'],
	description: 'Returns last 10 games played by the player\nnE.g. Type `!l10 Ed Barker` to see information about that player\'s games',
	cooldown: 5,
	async execute(message, args, client) {
		let name = args.join(' ');
		if(name === '') {
			const playername = await playerPersistence.userPlayers.findOne({ where: { username: message.author.id } });
			if(playername) {
				name = playername.get('playername');
			}
			else {
				return message.channel.send('Use !save Player Name to bind player to the !l10 command');
			}
		}
		const id = scrapPlayers.getPlayers()[name.toLowerCase().trim()];
		if(id) {
			http.get(`http://www.pbesim.com/players/player_${id}.html`, (resp) => {
				let data = '';
				resp.on('data', (chunk) => {
					data += chunk;
				});
				resp.on('end', () => {
					const title = $('.reptitle ', data).text();
					return message.channel.send({ embed: {
						color: teamColors[$('a[href*="team"]', data).eq(0).text()],
						author: {
							name: client.user.username,
							icon_url: client.user.avatarURL,
						},
						title: title,
						url: `http://www.pbesim.com/players/player_${id}.html`,
						fields: [
							{
								name: '10 Recent Games played in the season, go to the player page to find the boxscores',
								value:  last10(data),
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
			if(name.toLowerCase().trim() != '') {
				const searcher = new FuzzySearch(scrapPlayers.getPlayersNames(), ['fullName'], {
					caseSensitive: false,
				});
				const result = searcher.search(name.toLowerCase().trim());
				if(result.length != 0) {
					let suggestions = '';
					result.splice(0, 10).forEach(function(res) {
						suggestions += `\n - ${res.fullName}`;
					});
					return message.channel.send(`\`\`\`Player ${name} not found, but did you look maybe for: ${suggestions}\`\`\``);
				}
				else {
					return message.channel.send(`Player ${name} not found`);
				}
			}
			return message.channel.send(`Player ${name} not found`);
		}
	},
};

const config = {
	border: getBorderCharacters('void'),
	columnDefault: {
		paddingLeft: 0,
		paddingRight: 1,
		alignment: 'left',
	},
	drawHorizontalLine: () => {
		return false;
	},
	// columns: {
	// 	2: {
	// 		width: 10,
	// 	},
	// },
};

function last10(data) {
	const set = $('a[href*="box_scores"]', data).parent().parent().parent().children();
	const tableData = [];
	for (let i = 0; i < set.length; i++) {
		const row = set.eq(i).children();
		const tableRow = [];
		for (let j = 0; j < row.length; j++) {
			if(row.eq(j).text().trim() != 'Start') {
				if(j === 0) {
					tableRow.push(row.eq(j).text().trim().slice(0, -5));
				}
				else {
					tableRow.push(row.eq(j).text().trim());
				}
			}
			else {
				tableRow.push('S');
			}
		}
		tableData.push(tableRow);
	}
	return '```CSS\n' + table(tableData, config) + '```';
}
