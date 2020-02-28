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
const career = require('./career');
const { domainUrl, teamColors } = require('../environment.json');


module.exports = {
	name: 'player',
	aliases: ['p', 'plyr'],
	description: 'Returns player info embed\nE.g. Type `!player Ed Barker` to see information about that player',
	cooldown: 5,
	async execute(message, args, client) {
		let name = args.join(' ');

		// determine mode(s)
		const postseasonMode = args[args.length - 1] === 'p';
		if (postseasonMode) return career.execute(message, args, client);
		const minorsMode = args[args.length - 1] === 'm';
		if (minorsMode) return career.execute(message, args, client);

		// determine season
		const seasonRegexp = new RegExp(/S\d{1,3}/gi);
		const seasonYear = seasonRegexp.test(args[args.length - 1]) ? parseInt(args[args.length - 1].match('\\d+')) + 2016 : false;
		if (seasonYear) return career.execute(message, args, client);

		// handle stored player name or refer player to !save command if not found
		if (!name) {
			const playername = await playerPersistence.userPlayers.findOne({ where: { username: message.author.id } });
			if (playername) {
				name = playername.get('playername');
			} else {
				return message.channel.send('Use !save Player Name to bind player to the !p command');
			}
		}


		const id = scrapPlayers.getPlayers()[name.toLowerCase().trim()];
		if (id) {
			http.get(`${domainUrl}/players/player_${id}.html`, (resp) => {
				let data = '';
				resp.on('data', (chunk) => {
					data += chunk;
				});

				// handle player data
				resp.on('end', () => {
					const title = $('.reptitle ', data).text();

					return message.channel.send({ embed: {
						color: parseInt(teamColors[$('a[href*="team"]', data).eq(0).text().toLowerCase()]),
						author: {
							name: client.user.username,
							icon_url: client.user.avatarURL,
						},
						image: {
							url: $('img[src*="player"]', data).attr('src').replace('..', `${domainUrl}`),
						},
						thumbnail: {
							url: $('img[src*="team_logos"]', data).attr('src') ? $('img[src*="team_logos"]', data).attr('src').replace('..', `${domainUrl}`) : `${domainUrl}/images/league_logos/pro_baseball_experience.png`,
						},
						title: title,
						url: `${domainUrl}/players/player_${id}.html`,
						fields: [
							{
								name: 'Basic Stats',
								value:  title.startsWith('P') ? parsePitcherPage(data) : parseBatterPage(data),
								inline: true,
							},
							{
								name: 'Advanced Stats',
								value:  title.startsWith('P') ? parseAdvancedPitcherStats(data) : parseAdvancedBattingStats(data),
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
			if (name.toLowerCase().trim() != '') {
				const searcher = new FuzzySearch(scrapPlayers.getPlayersNames(), ['fullName'], {
					caseSensitive: false,
				});
				const result = searcher.search(name.toLowerCase().trim());
				if (result.length != 0) {
					let suggestions = '';
					result.splice(0, 10).forEach(function(res) {
						suggestions += `\n - ${res.fullName}`;
					});
					return message.channel.send(`\`\`\`Player ${name} not found, but did you look maybe for: ${suggestions}\`\`\``);
				} else {
					return message.channel.send(`Player ${name} not found`);
				}
			}
			return message.channel.send(`Player ${name} not found`);
		}
	},
};

function parseBatterPage(data) {
	let basicInfo = '';
	basicInfo += '\nGames: ' + $('table .data > tbody > tr > td:nth-child(1)', data).eq(0).text();
	basicInfo += '\nAt-bats: ' + $('table .data > tbody > tr > td:nth-child(2)', data).eq(0).text();
	basicInfo += '\nHits: ' + $('table .data > tbody > tr > td:nth-child(3)', data).eq(0).text();
	basicInfo += '\nDoubles: ' + $('table .data > tbody > tr > td:nth-child(4)', data).eq(0).text();
	basicInfo += '\nTriples: ' + $('table .data > tbody > tr > td:nth-child(5)', data).eq(0).text();
	basicInfo += '\nHome Runs: ' + $('table .data > tbody > tr > td:nth-child(6)', data).eq(0).text();
	basicInfo += '\nRuns Batted In: ' + $('table .data > tbody > tr > td:nth-child(7)', data).eq(0).text();
	basicInfo += '\nWalks: ' + $('table .data > tbody > tr > td:nth-child(8)', data).eq(0).text();
	basicInfo += '\nStrikeouts: ' + $('table .data > tbody > tr > td:nth-child(9)', data).eq(0).text();
	basicInfo += '\nBatting Avg: ' + $('table .data > tbody > tr > td:nth-child(10)', data).eq(0).text();
	basicInfo += '\nOn-base Pct: ' + $('table .data > tbody > tr > td:nth-child(11)', data).eq(0).text();
	basicInfo += '\nSlugging Pct: ' + $('table .data > tbody > tr > td:nth-child(12)', data).eq(0).text();
	basicInfo += '\nStolen Bases: ' + $('table .data > tbody > tr > td:nth-child(13)', data).eq(0).text();
	basicInfo += '\nWAR: ' + $('table .data > tbody > tr > td:nth-child(14)', data).eq(0).text();
	return basicInfo;
}
function parseAdvancedBattingStats(data) {
	let advancedInfo = '';
	advancedInfo += '\nwOBA: ' + $('table:nth-child(1) > tbody > tr:nth-child(3) > td > table:nth-child(2) > tbody > tr:nth-child(2) > td:nth-child(16)', data).text();
	advancedInfo += '\nISO: ' + $('table:nth-child(1) > tbody > tr:nth-child(3) > td > table:nth-child(2) > tbody > tr:nth-child(2) > td:nth-child(17)', data).text();
	advancedInfo += '\nwRC+: ' + $('table:nth-child(1) > tbody > tr:nth-child(3) > td > table:nth-child(2) > tbody > tr:nth-child(2) > td:nth-child(18)', data).text();
	advancedInfo += '\nRC: ' + $('table:nth-child(1) > tbody > tr:nth-child(3) > td > table:nth-child(2) > tbody > tr:nth-child(4) > td:nth-child(15)', data).text();
	advancedInfo += '\nRC/27: ' + $('table:nth-child(1) > tbody > tr:nth-child(3) > td > table:nth-child(2) > tbody > tr:nth-child(4) > td:nth-child(16)', data).text();
	advancedInfo += '\nTotal Bases: ' + $('table:nth-child(1) > tbody > tr:nth-child(3) > td > table:nth-child(2) > tbody > tr:nth-child(4) > td:nth-child(10)', data).text();
	return advancedInfo + parseFieldingStats(data);
}

function parseFieldingStats(data) {
	let fieldingInfo = '\n**Fielding**';
	const seasonYear = 2033;
	const set = $(`a[href*="team_year"]:contains(${seasonYear}):contains(- MLB)`, data).parent().parent();
	const setMinors = $(`a[href*="team_year"]:contains(${seasonYear}):contains(- R)`, data).parent().parent();
	for (let i = 0; i < set.length; i++) {
		const row = set.eq(i).children();
		if (['P', '1B', 'SS', '2B', '3B', 'C', 'LF', 'CF', 'RF'].includes(row.eq(1).text())) {
			fieldingInfo += '\nPosition: **' + row.eq(1).text();
			fieldingInfo += '**\nGames: ' + row.eq(2).text();
			fieldingInfo += '\nPutouts: ' + row.eq(4).text();
			fieldingInfo += '\nAssists: ' + row.eq(5).text();
			fieldingInfo += '\nErrors: ' + row.eq(8).text();
			fieldingInfo += '\nRange Factor: ' + row.eq(11).text();
			fieldingInfo += '\nZone Rating: ' + row.eq(12).text();
			fieldingInfo += '\nEfficiency: ' + row.eq(13).text();
		}
	}
	for (let i = 0; i < setMinors.length; i++) {
		const row = setMinors.eq(i).children();
		if (['P', '1B', 'SS', '2B', '3B', 'C', 'LF', 'CF', 'RF'].includes(row.eq(1).text())) {
			fieldingInfo += '\nPosition: **' + row.eq(1).text();
			fieldingInfo += '**\nGames: ' + row.eq(2).text();
			fieldingInfo += '\nPutouts: ' + row.eq(4).text();
			fieldingInfo += '\nAssists: ' + row.eq(5).text();
			fieldingInfo += '\nErrors: ' + row.eq(8).text();
			fieldingInfo += '\nRange Factor: ' + row.eq(11).text();
			fieldingInfo += '\nZone Rating: ' + row.eq(12).text();
			fieldingInfo += '\nEfficiency: ' + row.eq(13).text();
		}
	}
	if (fieldingInfo === '\n**Fielding**') fieldingInfo += '\nPlayer hasn\'t played in \nthe field in current year';
	return fieldingInfo;
}
function parsePitcherPage(data) {
	let basicInfo = '';
	basicInfo += '\nGames/Started: ' + $('table .data > tbody > tr > td:nth-child(1)', data).eq(0).text() + '/' + $('table .data > tbody > tr > td:nth-child(2)', data).eq(0).text();
	basicInfo += '\nWins-Losses: ' + $('table .data > tbody > tr > td:nth-child(3)', data).eq(0).text();
	basicInfo += '\nSaves: ' + $('table .data > tbody > tr > td:nth-child(4)', data).eq(0).text();
	basicInfo += '\nERA: ' + $('table .data > tbody > tr > td:nth-child(5)', data).eq(0).text();
	basicInfo += '\nInnings Pitched: ' + $('table .data > tbody > tr > td:nth-child(6)', data).eq(0).text();
	basicInfo += '\nHits Against: ' + $('table .data > tbody > tr > td:nth-child(7)', data).eq(0).text();
	basicInfo += '\nHome Runs vs: ' + $('table .data > tbody > tr > td:nth-child(8)', data).eq(0).text();
	basicInfo += '\nBase on Balls: ' + $('table .data > tbody > tr > td:nth-child(9)', data).eq(0).text();
	basicInfo += '\nStrikeouts: ' + $('table .data > tbody > tr > td:nth-child(10)', data).eq(0).text();
	basicInfo += '\nWHIP: ' + $('table .data > tbody > tr > td:nth-child(11)', data).eq(0).text();
	basicInfo += '\nWAR: ' + $('table .data > tbody > tr > td:nth-child(12)', data).eq(0).text();
	return basicInfo;
}
function parseAdvancedPitcherStats(data) {
	let advancedInfo = '';
	advancedInfo += '\nFIP: ' + $('table:nth-child(1) > tbody > tr:nth-child(3) > td > table:nth-child(2) > tbody > tr:nth-child(4) > td:nth-child(11)', data).text();
	advancedInfo += '\nFIP-: ' + $('table:nth-child(1) > tbody > tr:nth-child(3) > td > table:nth-child(2) > tbody > tr:nth-child(4) > td:nth-child(13)', data).text();
	advancedInfo += '\nK/9: ' + $('table:nth-child(1) > tbody > tr:nth-child(3) > td > table:nth-child(2) > tbody > tr:nth-child(4) > td:nth-child(9)', data).text();
	advancedInfo += '\nBB/9: ' + $('table:nth-child(1) > tbody > tr:nth-child(3) > td > table:nth-child(2) > tbody > tr:nth-child(4) > td:nth-child(10)', data).text();
	advancedInfo += '\nH/9: ' + $('table:nth-child(1) > tbody > tr:nth-child(3) > td > table:nth-child(2) > tbody > tr:nth-child(4) > td:nth-child(8)', data).text();
	advancedInfo += '\nR/9: ' + $('table:nth-child(1) > tbody > tr:nth-child(3) > td > table:nth-child(2) > tbody > tr:nth-child(4) > td:nth-child(7)', data).text();
	advancedInfo += '\nCG/CG%: ' + $('table:nth-child(1) > tbody > tr:nth-child(3) > td > table:nth-child(2) > tbody > tr:nth-child(2) > td:nth-child(15)', data).text() + '/' + $('table:nth-child(1) > tbody > tr:nth-child(3) > td > table:nth-child(2) > tbody > tr:nth-child(2) > td:nth-child(16)', data).text() + '%';
	advancedInfo += '\nShutouts: ' + $('table:nth-child(1) > tbody > tr:nth-child(3) > td > table:nth-child(2) > tbody > tr:nth-child(2) > td:nth-child(17)', data).text();
	advancedInfo += '\nQS/QS%: ' + $('table:nth-child(1) > tbody > tr:nth-child(3) > td > table:nth-child(2) > tbody > tr:nth-child(2) > td:nth-child(18)', data).text() + '/' + $('table:nth-child(1) > tbody > tr:nth-child(3) > td > table:nth-child(2) > tbody > tr:nth-child(2) > td:nth-child(19)', data).text() + '%';
	return advancedInfo;
}
