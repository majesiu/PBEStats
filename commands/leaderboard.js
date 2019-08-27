const http = require('http');
const $ = require('cheerio');
const { table, getBorderCharacters } = require('table');


module.exports = {
	name: 'leaderboard',
	description: 'Replies embed with Current PBE or MiLPBE leaderboard\nE.g. Type `!lead Batting AVG` to see current PBE standings, `!lead Batting AVG m` for minors',
	cooldown: 5,
	aliases: ['leaderboard', 'lead', 'top'],
	execute(message, args, client) {
		const minorsMode = args[args.length - 1] === 'm' ? true : false;
		if (minorsMode) args.pop();
		const stat = args.join(' ');
		if(stat) {
			http.get(minorsMode ? 'http://www.pbesim.com/leagues/league_101_stats.html' : 'http://www.pbesim.com/leagues/league_100_stats.html', (resp) => {
				let data = '';
				resp.on('data', (chunk) => {
					data += chunk;
				});
				resp.on('end', () => {

					message.channel.send({ embed: {
						color: 3447003,
						author: {
							name: client.user.username,
							icon_url: client.user.avatarURL,
						},
						title: minorsMode ? 'MiLPBE Leaders' : 'PBE Leaders',
						url: minorsMode ? 'http://www.pbesim.com/leagues/league_101_stats.html' : 'http://www.pbesim.com/leagues/league_100_stats.html',
						thumbnail: {
							url: 'http://www.pbesim.com/images/league_logos/pro_baseball_experience.png',
						},
						fields: [{
							name: `${stat} Top 5 Leaderboard. Remember to type stat name including letter Capitalization`,
							value:  getStatsInfo(data, stat),
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
			message.channel.send('You have to select stat E.g. Type `!lead Batting AVG` to see current PBE standings, `!lead Batting AVG m` for minors');
		}
	},
};


const config = {
	border: getBorderCharacters('honeywell'),
	columnDefault: {
		paddingLeft: 0,
		paddingRight: 0,
		alignment: 'left',
	},
};

function getStatsInfo(data, stat) {
	const resultTable = [];
	const set = $(`th:contains(${stat})`, data).parent().parent().children();
	console.log(set.length);
	if(set.length >= 6) {
		for (let i = 0; i < 6; i++) {
			const lineChilds = set.eq(i).children();
			if (i === 0) resultTable.push(['#', [lineChilds.eq(0).text().trim()], 'Team', '']);
			else resultTable.push([`${i}.`, lineChilds.eq(0).text().trim(), lineChilds.eq(1).text().trim(), lineChilds.eq(2).text().trim()]);
		}
		return '```CSS\n' + table(resultTable, config) + '```';
	}
	else {
		return 'Stat not found, remember about letter capitalization';
	}
}