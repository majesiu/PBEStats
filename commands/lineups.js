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
const http = require('http');
const $ = require('cheerio');
const { table, getBorderCharacters } = require('table');

const playerPersistence = require('../modules/playerPersistence');

const teamColors = {
	'new york voyagers': 0xbabf88,
	'florida space rangers': 0x000001,
	'outer banks aviators': 0xce5428,
	'cancun toros': 0xec60b0,
	'providence crabs': 0x0067b5,
	'death valley scorpions': 0x9f1c33,
	'vancouver vandals': 0x228b22,
	'san antonio sloths': 0xc6b3a2,
	'utah railroaders': 0xa854c9,
	'nashville stars': 0x83c1ec,
	'anchorage wheelers': 0xa0fbff,
	'amarillo armadillos': 0xffdb00,
	'state college swift steeds': 0x519fd8,
	'kingston mounties': 0x460505,
	'dallas dynamos': 0x17ece5,
	'kansas city hepcats': 0xc9e5ff,
};

const teamIds = {
	'new york voyagers': 1,
	'florida space rangers': 24,
	'outer banks aviators': 2,
	'cancun toros': 26,
	'providence crabs': 3,
	'death valley scorpions': 10,
	'vancouver vandals': 11,
	'san antonio sloths': 9,
	'utah railroaders': 25,
	'nashville stars': 27,
	'anchorage wheelers': 16,
	'amarillo armadillos': 19,
	'state college swift steeds': 18,
	'kingston mounties': 17,
	'dallas dynamos': 29,
	'kansas city hepcats': 28,
};

const teamAliases = {
	'nyv' :'new york voyagers',
	'fl' :'florida space rangers',
	'obx' :'outer banks aviators',
	'can' :'cancun toros',
	'pro' :'providence crabs',
	'dvs' :'death valley scorpions',
	'van' :'vancouver vandals',
	'sas' :'san antonio sloths',
	'uta' :'utah railroaders',
	'nas' :'nashville stars',
	'anc' :'anchorage wheelers',
	'arm' :'amarillo armadillos',
	'scss' :'state college swift steeds',
	'kin' :'kingston mounties',
	'dal' :'dallas dynamos',
	'kch' :'kansas city hepcats',
	'new york' :'new york voyagers',
	'florida' :'florida space rangers',
	'outer banks' :'outer banks aviators',
	'cancun' :'cancun toros',
	'providence' :'providence crabs',
	'death valley' :'death valley scorpions',
	'vancouver' :'vancouver vandals',
	'san antonio' :'san antonio sloths',
	'utah' :'utah railroaders',
	'nashville' :'nashville stars',
	'ananchorage' :'anchorage wheelers',
	'amarillo' :'amarillo armadillos',
	'state college' :'state college swift steeds',
	'kingston' :'kingston mounties',
	'dallas' :'dallas dynamos',
	'kansas city' :'kansas city hepcats',
	'voyagers' :'new york voyagers',
	'rangers' :'florida space rangers',
	'aviators' :'outer banks aviators',
	'toros' :'cancun toros',
	'crabs' :'providence crabs',
	'scorpions' :'death valley scorpions',
	'vandals' :'vancouver vandals',
	'sloths' :'san antonio sloths',
	'railroaders' :'utah railroaders',
	'stars' :'nashville stars',
	'wheelers' :'anchorage wheelers',
	'armadillos' :'amarillo armadillos',
	'swift steeds' :'state college swift steeds',
	'mounties' :'kingston mounties',
	'dynamos' :'dallas dynamos',
	'hepcats' :'kansas city hepcats',
	'swifties' :'state college swift steeds',
};

module.exports = {
	name: 'lineups',
	aliases: ['l', 'lineup'],
	description: 'Returns team lineup info embed\nE.g. Type `!lineups Florida Space Rangers` to see batting lineups of that team',
	cooldown: 5,
	async execute(message, args, client) {
		let teamName = args.join(' ');
		if(teamName.trim().toLowerCase() in teamAliases) {
			teamName = teamAliases[teamName.trim().toLowerCase()];
		}
		if(teamName === '') {
			const teamname = await playerPersistence.userTeams.findOne({ where: { username: message.author.id } });
			if(teamname) {
				teamName = teamname.get('teamname');
			}
			else {
				return message.channel.send('Use !bind Team Name to bind team to the !t command');
			}
		}
		const id = teamIds[teamName.toLowerCase().trim()];
		if(id) {
			http.get(`http://www.pbesim.com/teams/team_${id}.html`, (resp) => {
				let data = '';
				resp.on('data', (chunk) => {
					data += chunk;
				});
				resp.on('end', () => {
					const title = $('.reptitle ', data).text();
					console.log(title);
					return message.channel.send({ embed: {
						color: teamColors[title.replace('(R)', '').toLowerCase().trim()],
						author: {
							name: client.user.username,
							icon_url: client.user.avatarURL,
						},
						thumbnail: {
							url: $('img[src*="team_logos"]', data).attr('src').replace('..', 'http://www.pbesim.com'),
						},
						title: title,
						url: `http://www.pbesim.com/players/player_${id}.html`,
						fields: [
							{
								name: 'vs LHP',
								value:  battingLineup(data, 'LHP'),
								inline: true,
							},
							{
								name: 'vs RHP',
								value:  battingLineup(data, 'RHP'),
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
			return message.channel.send(`Team ${teamName} not found`);
		}
	},
};


const tableLineupConfig = {
	border: getBorderCharacters('norc'),
	columnDefault: {
		paddingLeft: 0,
		paddingRight: 0,
		alignment: 'left',
	},
	columns: {
		2: {
			width: 16,
			wrapWord: true,
		},
	},
};

function battingLineup(data, versus) {
	let row = '';
	const dataTable = [];
	$(`td:contains(LINEUP VS ${versus}+DH)`, data).last().children().children().children().children().each(function(index, element) {
		if(index != 0) {
			row += $(element).text();
			if(index % 8 != 0) {
				row += ' | ';
			}
			else {
				dataTable.push(row.split(' | '));
				row = '';
			}
		}
	});
	return '```CSS\n' + table(dataTable, tableLineupConfig) + '```';
}