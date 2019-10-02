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
const { domainUrl, teamColors, idsToTeamNames } = require('../environment.json');

module.exports = {
	name: 'career',
	aliases: ['c', 'car', 'carer'],
	description: 'Returns player info embed\nE.g. Type `!career Ed Barker` to see information about that players career\nParameters: add m for minors, add p for playoffs E.g. type `!c m p` for your players MiLPBE Playoffs Career Total',
	cooldown: 5,
	async execute(message, args, client) {
		// determine mode(s)
		const postseasonMode = args[args.length - 1] === 'p';
		if (postseasonMode) args.pop();
		const minorsMode = args[args.length - 1] === 'm';
		if (minorsMode) args.pop();

		// if user specifies season
		const leagueStartYear = 2016;
		const seasonRegexp = new RegExp(/S\d{1,3}/gi);
		const seasonYear = seasonRegexp.test(args[args.length - 1]) ? parseInt(args[args.length - 1].match('\\d+')) + leagueStartYear : false;
		let season = '';
		if (seasonYear) season = args.pop();

		// parse name input
		let name = args.join(' ');
		if (!name) {
			const playername = await playerPersistence.userPlayers.findOne({ where: { username: message.author.id } });
			if(playername) {
				name = playername.get('playername');
			} else {
				return message.channel.send('Use `!save Player Name` to bind player to the !p or !c commands	');
			}
		}

		// search for the player and retrieve his/her career stats
		const id = scrapPlayers.getPlayers()[name.toLowerCase().trim()];
		if (id) {
			http.get(`${domainUrl}/players/player_${id}.html`, (resp) => {
				let data = '';
				resp.on('data', (chunk) => {
					data += chunk;
				});
				// handle player data
				resp.on('end', () => {
					// create title
					let title = $('.reptitle ', data).text();
					title += seasonYear ? ` in ${seasonYear} (${season.toUpperCase()})` : ' Career Totals';
					title += minorsMode ? ' MiLPBE' : ' PBE';
					title += postseasonMode ? ' Postseason' : ' Regular Season';

					// decide styling
					let thumbnail = $('img[src*="team_logos"]', data).attr('src') ? $('img[src*="team_logos"]', data).attr('src').replace('..', `${domainUrl}`) : `${domainUrl}/images/league_logos/pro_baseball_experience.png`;
					let color = parseInt(teamColors[$('a[href*="team"]', data).eq(0).text().toLowerCase()]);
					if(seasonYear) {
						const selector = $(`a[href*="team"]:contains(${seasonYear}):contains(- ${minorsMode ? 'R' : 'PBE'})`, data).last().attr('href');
						if (selector) {
							const seasonTeamId = selector.match(/_\d{1,2}_/g)[0].replace(/_/g, '');
							color = parseInt(teamColors[idsToTeamNames[seasonTeamId.toString()].trim()]);
							thumbnail = `${domainUrl}/images/team_logos/${idsToTeamNames[seasonTeamId.toString()].split(' ').join('_')}.png`;
						}
					}

					// return embed format
					return message.channel.send({ embed: {
						color: color,
						author: {
							name: client.user.username,
							icon_url: client.user.avatarURL,
						},
						image: {
							url: $('img[src*="player"]', data).attr('src').replace('..', `${domainUrl}`),
						},
						thumbnail: {
							url: thumbnail,
						},
						title: title,
						url: `${domainUrl}/players/player_${id}.html`,
						fields: [
							{
								name: title.startsWith('P') ? 'Pitching Stats' : 'Batting Stats',
								value:  title.startsWith('P') ? parseBasePitchingCareer(data, seasonYear, minorsMode, postseasonMode) : parseBaseHittingCareer(data, seasonYear, minorsMode, postseasonMode),
								inline: true,
							},
							{
								name: 'Fielding Stats',
								value:  postseasonMode ? 'No Fielding stats for postseason' : parseFieldingCareer(data, seasonYear, minorsMode),
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
			// give name suggestions if it couldn't be found
			if(name.toLowerCase().trim() != '') {
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
				}
				else {
					return message.channel.send(`Player ${name} not found`);
				}
			}
			return message.channel.send(`Player ${name} not found`);
		}
	},
};


/* Functions to gather data from site */

function parseBaseHittingCareer(data, seasonYear, minorsMode, postseasonMode) {
	let basicInfo = '';
	let set = seasonYear ? $(`td:contains(${seasonYear}):contains(- ${minorsMode ? (postseasonMode ? 'MiLPBE' : 'R') : 'PBE'})  + td.dr`, data).parent() : $(`th:contains(Total ${minorsMode ? 'MiLPBE' : 'PBE'})`, data).parent().eq(postseasonMode ? 1 : 0);
	if (seasonYear) {
		if (postseasonMode) {
			if ((minorsMode || set.length > 1) && set.last().children().eq(20).text() == '0' && set.last().children().eq(22).text() == '0.0') {
				set = set.last();
			}
			else {
				return 'Player didn\'t participate in postseason that year';
			}
		}
		else if (set.length > 1) {
			if (set.last().children().eq(20).text() == '0' && set.last().children().eq(22).text() == '0.0') {
				set = set.eq(-2);
			} else {
				set = set.eq(-1);
			}
		} else {
			set = set.eq(0);
		}
	}
	set = set.children();
	if (!set.eq(2).text()) {
		return `Player haven't played any games ${seasonYear ? 'that season' : `in his ${postseasonMode ? 'postseason ' : ''} ${minorsMode ? 'MiLPBE' : 'PBE'} career`}`;
	}
	basicInfo += '\nGames: ' + set.eq(2).text();
	basicInfo += '\nAt-bats: ' + set.eq(3).text();
	basicInfo += '\nHits: ' + set.eq(4).text();
	basicInfo += '\nDoubles: ' + set.eq(5).text();
	basicInfo += '\nTriples: ' + set.eq(6).text();
	basicInfo += '\nHome Runs: ' + set.eq(7).text();
	basicInfo += '\nRuns Batted In: ' + set.eq(8).text();
	basicInfo += '\nRuns: ' + set.eq(9).text();
	basicInfo += '\nWalks: ' + set.eq(10).text();
	basicInfo += '\nStrikeouts: ' + set.eq(13).text();
	basicInfo += '\nStolen Bases: ' + set.eq(14).text();
	basicInfo += '\nCaught Stealing: ' + set.eq(15).text();
	basicInfo += '\nBatting Avg: ' + set.eq(16).text();
	basicInfo += '\nOn-Base Pct: ' + set.eq(17).text();
	basicInfo += '\nSlugging Pct: ' + set.eq(18).text();
	basicInfo += '\nOPS: ' + set.eq(19).text();
	if (!postseasonMode) {
		basicInfo += '\nOPS+: ' + set.eq(20).text();
		basicInfo += '\nwRC+: ' + set.eq(21).text();
		basicInfo += '\nWAR: ' + set.eq(22).text();
	}
	return basicInfo;
}

function parseBasePitchingCareer(data, seasonYear, minorsMode, postseasonMode) {
	let basicInfo = '';
	let set = seasonYear ? $(`td:contains(${seasonYear}):contains(- ${minorsMode ? (postseasonMode ? 'MiLPBE' : 'R') : 'PBE'})  + td.dr`, data).parent() : $(`th:contains(Total ${minorsMode ? 'MiLPBE' : 'PBE'})`, data).parent().eq(postseasonMode ? 1 : 0);
	if (seasonYear) {
		if (postseasonMode) {
			if ((minorsMode || set.length > 1) && set.last().children().eq(21).text() == '0' && set.last().children().eq(20).text() == '0.0') {
				set = set.last();
			} else {
				return 'Player didn\'t participate in postseason that year';
			}
		} else if (set.length > 1) {
			if (set.last().children().eq(21).text() == '0' && set.last().children().eq(20).text() == '0.0') {
				set = set.eq(-2);
			} else {
				set = set.eq(-1);
			}
		} else {
			set = set.eq(0);
		}
	}
	set = set.children();
	if (set.eq(2).text() === '') {
		return `Player haven't played any games ${seasonYear ? 'that season' : `in his ${postseasonMode ? 'postseason ' : ''} ${minorsMode ? 'MiLPBE' : 'PBE'} career`}`;
	}
	basicInfo += '\nGames/Started: ' + set.eq(2).text() + '/' + set.eq(3).text();
	basicInfo += '\nWins-Losses: ' + set.eq(4).text() + '-' + set.eq(5).text();
	basicInfo += '\nSaves: ' + set.eq(6).text();
	basicInfo += '\nERA: ' + set.eq(7).text();
	basicInfo += '\nInnings Pitched: ' + set.eq(8).text();
	basicInfo += '\nHits Against: ' + set.eq(9).text();
	basicInfo += '\nRuns Against: ' + set.eq(10).text();
	basicInfo += '\nEarned Runs: ' + set.eq(11).text();
	basicInfo += '\nHome Runs vs: ' + set.eq(12).text();
	basicInfo += '\nBase on Balls: ' + set.eq(13).text();
	basicInfo += '\nStrikeouts: ' + set.eq(14).text();
	basicInfo += '\nComplete Games: ' + set.eq(15).text();
	basicInfo += '\nShutouts: ' + set.eq(16).text();
	basicInfo += '\nWHIP: ' + set.eq(17).text();
	basicInfo += '\nBABIP: ' + set.eq(18).text();
	if (!postseasonMode) {
		basicInfo += '\nFIP: ' + set.eq(19).text();
		basicInfo += '\nWAR: ' + set.eq(20).text();
		basicInfo += '\nERA+: ' + set.eq(21).text();
	}
	return basicInfo;
}

function parseFieldingCareer(data, seasonYear, minorsMode) {
	let basicInfo = '';
	const set = seasonYear ? $(`a[href*="team_year"]:contains(${seasonYear}):contains(- ${minorsMode ? 'R' : 'MLB'})`, data).parent().parent() : $(`a[href*="team_year"]:contains(- ${minorsMode ? 'R' : 'MLB'})`, data).parent().parent();
	if (set.length === 0) {
		return `Player haven't played any games in the field ${seasonYear ? 'that season' : `in his ${minorsMode ? 'MiLPBE' : 'PBE'} career`}`;
	}
	const gameRequired = seasonYear ? 10 : 50;
	if (seasonYear) {
		for (let i = 0; i < set.length; i++) {
			const row = set.eq(i).children();
			if (parseInt(row.eq(2).text()) > gameRequired && ['P', '1B', 'SS', '2B', '3B', 'C', 'LF', 'CF', 'RF'].includes(row.eq(1).text())) {
				basicInfo += '\nPosition: **' + row.eq(1).text();
				basicInfo += '**\nGames: ' + row.eq(2).text();
				basicInfo += '\nPutouts: ' + row.eq(4).text();
				basicInfo += '\nAssists: ' + row.eq(5).text();
				basicInfo += '\nErrors: ' + row.eq(8).text();
				basicInfo += '\nRange Factor: ' + row.eq(11).text();
				basicInfo += '\nZone Rating: ' + row.eq(12).text();
				basicInfo += '\nEfficiency: ' + row.eq(13).text();
			}
		}
	} else {
		const positionBuckets = [];
		for (let i = 0; i < set.length; i++) {
			const row = set.eq(i).children();
			if (['P', '1B', 'SS', '2B', '3B', 'C', 'LF', 'CF', 'RF'].includes(row.eq(1).text())) {
				let position = new Object();
				position.name = row.eq(1).text();
				const previous = positionBuckets.find(x => x.name === position.name);
				if (previous) {
					position = previous;
				} else {
					position.games = 0;
					position.putouts = 0;
					position.assists = 0;
					position.totalInnings = 0;
					position.errors = 0;
					position.rangeFactor = 0;
					position.zoneRating = 0;
					position.efficiency = 0;
				}
				position.games += parseInt(row.eq(2).text());
				position.putouts += parseInt(row.eq(4).text());
				position.assists += parseInt(row.eq(5).text());
				position.totalInnings += parseFloat(row.eq(10).text());
				position.errors += parseInt(row.eq(8).text());
				position.rangeFactor += parseFloat(row.eq(11).text()) * parseFloat(row.eq(10).text());
				position.zoneRating += parseFloat(row.eq(12).text());
				position.efficiency += parseFloat(row.eq(13).text()) * parseFloat(row.eq(10).text());
				if (!previous) positionBuckets.push(position);
			}
		}
		for(const position of positionBuckets) {
			if (position.games > gameRequired) {
				basicInfo += '\nPosition: **' + position.name;
				basicInfo += '**\nGames: ' + position.games;
				basicInfo += '\nPutouts: ' + position.putouts;
				basicInfo += '\nAssists: ' + position.assists;
				basicInfo += '\nErrors: ' + position.errors;
				basicInfo += '\nRange Factor: ' + (position.rangeFactor / position.totalInnings).toFixed(2);
				basicInfo += '\nZone Rating: ' + position.zoneRating.toFixed(1);
				basicInfo += '\nEfficiency: ' + (position.efficiency / position.totalInnings).toFixed(3);
			}
		}
	}
	if (basicInfo === '') {
		basicInfo += 'Player didn\'t player required amount of games in the field - 10 for a season, 50 for career';
	}
	return basicInfo;
}
