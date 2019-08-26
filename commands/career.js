const scrapPlayers = require('../modules/scrapPlayers.js');
const http = require('http');
const $ = require('cheerio');
const playerPersistence = require('../modules/playerPersistence');

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
	name: 'career',
	aliases: ['c', 'car', 'carer'],
	description: 'Returns player info embed\nE.g. Type `!player Ed Barker` to see information about that players career',
	cooldown: 5,
	async execute(message, args, client) {
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
					title += seasonYear ? ` in ${seasonYear} (${season})` : ' Career Totals';
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
							url: $('img[src*="team_logos"]', data).attr('src') ? $('img[src*="team_logos"]', data).attr('src').replace('..', 'http://www.pbesim.com') : 'http://www.pbesim.com/images/league_logos/pro_baseball_experience.png',
						},
						title: title,
						url: `http://www.pbesim.com/players/player_${id}.html`,
						fields: [
							{
								name: 'Stats',
								value:  title.startsWith('P') ? parseBasePitchingCareer(data, seasonYear) : parseBaseHittingCareer(data, seasonYear),
								inline: true,
							},
							{
								name: 'More Stats',
								value:  title.startsWith('P') ? parseAdvPitchingCareer(data, seasonYear) : parseAdvHittingCareer(data, seasonYear),
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

function parseBaseHittingCareer(data, seasonYear) {
	let basicInfo = '';
	const set = seasonYear ? $(`a[href*="team_year"]:contains(${seasonYear})`, data).parent().parent().eq(0).children() : $('th:contains(Total PBE)', data).parent().eq(0).children();
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


function parseAdvHittingCareer(data, seasonYear) {
	let basicInfo = '';
	const set = seasonYear ? $(`a[href*="team_year"]:contains(${seasonYear})`, data).parent().parent().eq(0).children() : $('th:contains(Total PBE)', data).parent().eq(0).children();
	basicInfo += '\nStolen Bases: ' + set.eq(14).text();
	basicInfo += '\nCaught Stealing: ' + set.eq(15).text();
	basicInfo += '\nBatting Avg: ' + set.eq(16).text();
	basicInfo += '\nOn-Base Pct: ' + set.eq(17).text();
	basicInfo += '\nSlugging Pct: ' + set.eq(18).text();
	basicInfo += '\nOPS: ' + set.eq(19).text();
	basicInfo += '\nOPS+: ' + set.eq(20).text();
	basicInfo += '\nwRC+: ' + set.eq(21).text();
	basicInfo += '\nWAR: ' + set.eq(22).text();
	return basicInfo;
}


function parseBasePitchingCareer(data, seasonYear) {
	let basicInfo = '';
	const set = seasonYear ? $(`a[href*="team_year"]:contains(${seasonYear})`, data).parent().parent().eq(0).children() : $('th:contains(Total PBE)', data).parent().eq(0).children();
	basicInfo += '\nGames/Started: ' + set.eq(2).text() + '/' + set.eq(3).text();
	basicInfo += '\nWins-Loses: ' + set.eq(4).text() + '-' + set.eq(5).text();
	basicInfo += '\nSaves: ' + set.eq(6).text();
	basicInfo += '\nERA: ' + set.eq(7).text();
	basicInfo += '\nInnings Pitched: ' + set.eq(8).text();
	basicInfo += '\nHits Against: ' + set.eq(9).text();
	basicInfo += '\nRuns Against: ' + set.eq(10).text();
	basicInfo += '\nEarned Runs: ' + set.eq(11).text();
	basicInfo += '\nHome Runs vs: ' + set.eq(12).text();
	return basicInfo;
}


function parseAdvPitchingCareer(data, seasonYear) {
	let basicInfo = '';
	const set = seasonYear ? $(`a[href*="team_year"]:contains(${seasonYear})`, data).parent().parent().eq(0).children() : $('th:contains(Total PBE)', data).parent().eq(0).children();
	basicInfo += '\nBase on Balls: ' + set.eq(13).text();
	basicInfo += '\nStrikeouts: ' + set.eq(14).text();
	basicInfo += '\nComplete Games: ' + set.eq(15).text();
	basicInfo += '\nShutouts: ' + set.eq(16).text();
	basicInfo += '\nWHIP: ' + set.eq(17).text();
	basicInfo += '\nBABIP: ' + set.eq(18).text();
	basicInfo += '\nFIP: ' + set.eq(19).text();
	basicInfo += '\nWAR: ' + set.eq(20).text();
	basicInfo += '\nERA+: ' + set.eq(21).text();
	return basicInfo;
}