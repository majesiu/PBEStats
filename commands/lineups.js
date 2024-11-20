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
const cheerio = require('cheerio');
const { table, getBorderCharacters } = require('table');
const { domainUrl, teamColors, teamAliases, teamIds } = require('../environment.json');
const playerPersistence = require('../modules/playerPersistence');

module.exports = {
	name: 'lineups',
	aliases: ['l', 'lineup'],
	description: 'Returns team lineup info embed\nE.g. Type `!lineups Florida Space Rangers` to see batting lineups of that team',
	cooldown: 5,
	async execute(message, args, client) {
		let teamName = args.join(' ');

		// get team name if entered by alias
		if (teamName.trim().toLowerCase() in teamAliases) {
			teamName = teamAliases[teamName.trim().toLowerCase()];
		}

		// if team is queried as an empty string find bound team or refer user to !bind command
		if (!teamName) {
			const teamname = await playerPersistence.userTeams.findOne({ where: { username: message.author.id } });
			if (teamname) {
				teamName = teamname.get('teamname');
			} else {
				return message.channel.send('Use !bind Team Name to bind team to the !t command');
			}
		}

		// gather team data by team id
		const id = teamIds[teamName.toLowerCase().trim()];
		if (id) {
			http.get(`${domainUrl}/teams/team_${id}.html`, (resp) => {
				let data = '';
				resp.on('data', (chunk) => {
					data += chunk;
				});

				// handle team data
				resp.on('end', () => {
					const $ = cheerio.load(data);
					const title = $('.reptitle ', data).text();

					return message.channel.send({ embed: {
						color: parseInt(teamColors[title.replace('(R)', '').toLowerCase().trim()]),
						author: {
							name: client.user.username,
							icon_url: client.user.avatarURL,
						},
						thumbnail: {
							url: $('img[src*="team_logos"]', data).attr('src').replace('..', `${domainUrl}`),
						},
						title: title,
						url: `${domainUrl}/teams/team_${id}.html`,
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
		} else {
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

// parse site data to get lineup
function battingLineup(data, versus) {
	const $ = cheerio.load(data);
	let row = '';
	const dataTable = [];
	const $ = cheerio.load(data);
	$(`td:contains(LINEUP VS ${versus}+DH)`, data).last().children().children().children().children().each(function(index, element) {
		if (index != 0) {
			row += $(element).text();
			if (index % 8 != 0) {
				row += ' | ';
			} else {
				dataTable.push(row.split(' | '));
				row = '';
			}
		}
	});
	return '```CSS\n' + table(dataTable, tableLineupConfig) + '```';
}
