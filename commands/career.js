const scrapPlayers = require('../modules/scrapPlayers.js');
const http = require('http');
const $ = require('cheerio');
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
	'state college swift steeds ': 0x519fd8,
	'kingston mounties': 0x460505,
	'dallas dynamos': 0x17ece5,
	'kansas city hepcats': 0xc9e5ff,
};

const idsToTeamNames = {
	1: 'new york voyagers',
	24: 'florida space rangers',
	2: 'outer banks aviators',
	26: 'cancun toros',
	3: 'providence crabs',
	10: 'death valley scorpions',
	11: 'vancouver vandals',
	9: 'san antonio sloths',
	25: 'utah railroaders',
	27: 'nashville stars',
	16: 'anchorage wheelers',
	19: 'amarillo armadillos',
	18: 'state college swift steeds ',
	17: 'kingston mounties',
	29: 'dallas dynamos',
	28: 'kansas city hepcats',
};

module.exports = {
	name: 'career',
	aliases: ['c', 'car', 'carer'],
	description: 'Returns player info embed\nE.g. Type `!player Ed Barker` to see information about that players career\nParameters: add m for minors, add p for playoffs E.g. type `!c m p` for your players MiLPBE Playoffs Career Total',
	cooldown: 5,
	async execute(message, args, client) {
		const postseasonMode = args[args.length - 1] === 'p' ? true : false;
		if (postseasonMode) args.pop();
		const minorsMode = args[args.length - 1] === 'm' ? true : false;
		if (minorsMode) args.pop();
		const leagueStartYear = 2016;
		const seasonRegexp = new RegExp(/S\d{1,3}/gi);
		const seasonYear = seasonRegexp.test(args[args.length - 1]) ? parseInt(args[args.length - 1].match('\\d+')) + leagueStartYear : false;
		let season = '';
		if (seasonYear) season = args.pop();
		let name = args.join(' ');
		if(name === '') {
			const playername = await playerPersistence.userPlayers.findOne({ where: { username: message.author.id } });
			if(playername) {
				name = playername.get('playername');
			}
			else {
				return message.channel.send('Use `!save Player Name` to bind player to the !p !c command');
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
					let title = $('.reptitle ', data).text();
					title += seasonYear ? ` in ${seasonYear} (${season.toUpperCase()})` : ' Career Totals';
					title += minorsMode ? ' MiLPBE' : ' PBE';
					title += postseasonMode ? ' Postseason' : ' Regular Season';
					let thumbnail = $('img[src*="team_logos"]', data).attr('src') ? $('img[src*="team_logos"]', data).attr('src').replace('..', 'http://www.pbesim.com') : 'http://www.pbesim.com/images/league_logos/pro_baseball_experience.png';
					let color = teamColors[$('a[href*="team"]', data).eq(0).text().toLowerCase()];
					if(seasonYear) {
						const selector = $(`a[href*="team"]:contains(${seasonYear}):contains(- ${minorsMode ? 'R' : 'PBE'})`, data).last().attr('href');
						if (selector) {
							const seasonTeamId = selector.match(/_\d{1,2}_/g)[0].replace(/_/g, '');
							color = teamColors[idsToTeamNames[seasonTeamId].trim()];
							thumbnail = `http://www.pbesim.com/images/team_logos/${idsToTeamNames[seasonTeamId].split(' ').join('_')}.png`;
						}
					}
					return message.channel.send({ embed: {
						color: color,
						author: {
							name: client.user.username,
							icon_url: client.user.avatarURL,
						},
						image: {
							url: $('img[src*="player"]', data).attr('src').replace('..', 'http://www.pbesim.com'),
						},
						thumbnail: {
							url: thumbnail,
						},
						title: title,
						url: `http://www.pbesim.com/players/player_${id}.html`,
						fields: [
							{
								name: 'Batting Stats',
								value:  (title.startsWith('P') ? parseBasePitchingCareer(data, seasonYear, minorsMode, postseasonMode) : parseBaseHittingCareer(data, seasonYear, minorsMode, postseasonMode)) + (title.startsWith('P') ? parseAdvPitchingCareer(data, seasonYear, minorsMode, postseasonMode) : parseAdvHittingCareer(data, seasonYear, minorsMode, postseasonMode)),
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
		}
		else {
			return message.channel.send(`Player ${name} not found`);
		}
	},
};

function parseBaseHittingCareer(data, seasonYear, minorsMode, postseasonMode) {
	let basicInfo = '';
	let set = seasonYear ? $(`a:contains(${seasonYear}):contains(- ${minorsMode ? 'R' : 'PBE'})`, data).parent().parent() : $(`th:contains(Total ${minorsMode ? 'MiLPBE' : 'PBE'})`, data).parent().eq(postseasonMode ? 1 : 0);
	if (seasonYear) {
		if (postseasonMode) {
			if(set.length > 1 && set.last().children().eq(20).text() == '0' && set.last().children().eq(22).text() == '0.0') {
				set = set.last();
			}
			else {
				return 'Player didn\'t particpated in postseason that year';
			}
		}
		else if(set.length > 1) {
			if(set.last().children().eq(20).text() == '0' && set.last().children().eq(22).text() == '0.0') {
				set = set.eq(-2);
			}
			else {
				set = set.last();
			}
		}
		else {
			set = set.eq(0);
		}
	}
	set = set.children();
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
	return basicInfo;
}

function parseAdvHittingCareer(data, seasonYear, minorsMode, postseasonMode) {
	let basicInfo = '';
	let set = seasonYear ? $(`a:contains(${seasonYear}):contains(- ${minorsMode ? 'R' : 'PBE'})`, data).parent().parent() : $(`th:contains(Total ${minorsMode ? 'MiLPBE' : 'PBE'})`, data).parent().eq(postseasonMode ? 1 : 0);
	if (seasonYear) {
		if (postseasonMode) {
			if(set.length > 1 && set.last().children().eq(20).text() == '0' && set.last().children().eq(22).text() == '0.0') {
				set = set.last();
			}
			else {
				return '\n';
			}
		}
		else if(set.length > 1) {
			if(set.last().children().eq(20).text() == '0' && set.last().children().eq(22).text() == '0.0') {
				set = set.eq(-2);
			}
			else {
				set = set.last();
			}
		}
		else {
			set = set.eq(0);
		}
	}
	set = set.children();
	basicInfo += '\nStolen Bases: ' + set.eq(14).text();
	basicInfo += '\nCaught Stealing: ' + set.eq(15).text();
	basicInfo += '\nBatting Avg: ' + set.eq(16).text();
	basicInfo += '\nOn-Base Pct: ' + set.eq(17).text();
	basicInfo += '\nSlugging Pct: ' + set.eq(18).text();
	basicInfo += '\nOPS: ' + set.eq(19).text();
	if(!postseasonMode) {
		basicInfo += '\nOPS+: ' + set.eq(20).text();
		basicInfo += '\nwRC+: ' + set.eq(21).text();
		basicInfo += '\nWAR: ' + set.eq(22).text();
	}
	return basicInfo;
}

function parseBasePitchingCareer(data, seasonYear, minorsMode, postseasonMode) {
	let basicInfo = '';
	let set = seasonYear ? $(`a:contains(${seasonYear}):contains(- ${minorsMode ? 'R' : 'PBE'})`, data).parent().parent() : $(`th:contains(Total ${minorsMode ? 'MiLPBE' : 'PBE'})`, data).parent().eq(postseasonMode ? 1 : 0);
	if (seasonYear) {
		if (postseasonMode) {
			if(set.length > 1 && set.last().children().eq(21).text() == '0' && set.last().children().eq(20).text() == '0.0') {
				set = set.last();
			}
			else {
				return 'Player didn\'t particpated in postseason that year';
			}
		}
		else if(set.length > 1) {
			if(set.last().children().eq(20).text() == '0' && set.last().children().eq(22).text() == '0.0') {
				set = set.eq(-2);
			}
			else {
				set = set.last();
			}
		}
		else {
			set = set.eq(0);
		}
	}
	set = set.children();
	basicInfo += '\nGames/Started: ' + set.eq(2).text() + '/' + set.eq(3).text();
	basicInfo += '\nWins-Losses: ' + set.eq(4).text() + '-' + set.eq(5).text();
	basicInfo += '\nSaves: ' + set.eq(6).text();
	basicInfo += '\nERA: ' + set.eq(7).text();
	basicInfo += '\nInnings Pitched: ' + set.eq(8).text();
	basicInfo += '\nHits Against: ' + set.eq(9).text();
	basicInfo += '\nRuns Against: ' + set.eq(10).text();
	basicInfo += '\nEarned Runs: ' + set.eq(11).text();
	basicInfo += '\nHome Runs vs: ' + set.eq(12).text();
	return basicInfo;
}

function parseAdvPitchingCareer(data, seasonYear, minorsMode, postseasonMode) {
	let basicInfo = '';
	let set = seasonYear ? $(`a:contains(${seasonYear}):contains(- ${minorsMode ? 'R' : 'PBE'})`, data).parent().parent() : $(`th:contains(Total ${minorsMode ? 'MiLPBE' : 'PBE'})`, data).parent().eq(postseasonMode ? 1 : 0);
	if (seasonYear) {
		if (postseasonMode) {
			if(set.length > 1 && set.last().children().eq(21).text() == '0' && set.last().children().eq(20).text() == '0.0') {
				set = set.last();
			}
			else {
				return '\n';
			}
		}
		else if(set.length > 1) {
			if(set.last().children().eq(21).text() == '0' && set.last().children().eq(20).text() == '0.0') {
				set = set.eq(-2);
			}
			else {
				set = set.last();
			}
		}
		else {
			set = set.eq(0);
		}
	}
	set = set.children();
	basicInfo += '\nBase on Balls: ' + set.eq(13).text();
	basicInfo += '\nStrikeouts: ' + set.eq(14).text();
	basicInfo += '\nComplete Games: ' + set.eq(15).text();
	basicInfo += '\nShutouts: ' + set.eq(16).text();
	basicInfo += '\nWHIP: ' + set.eq(17).text();
	basicInfo += '\nBABIP: ' + set.eq(18).text();
	if(!postseasonMode) {
		basicInfo += '\nFIP: ' + set.eq(19).text();
		basicInfo += '\nWAR: ' + set.eq(20).text();
		basicInfo += '\nERA+: ' + set.eq(21).text();
	}
	return basicInfo;
}

function parseFieldingCareer(data, seasonYear, minorsMode) {
	let basicInfo = '';
	const set = seasonYear ? $(`a[href*="team_year"]:contains(${seasonYear}):contains(- ${minorsMode ? 'R' : 'MLB'})`, data).parent().parent() : $('th:contains(TOTAL)', data).parent();
	for (let i = 0; i < set.length; i++) {
		const row = set.eq(i).children();
		const gameRequired = seasonYear ? 10 : 100;
		if(parseInt(row.eq(2).text()) > gameRequired) {
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
	return basicInfo;
}