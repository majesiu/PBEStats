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
const { domainUrl } = require('../environment.json');

module.exports = {
	name: 'leaderboard',
	description: 'Replies embed with Current PBE or MiLPBE leaderboard\nE.g. Type `!lead Batting AVG` to see current PBE standings, `!lead Batting AVG m` for minors',
	cooldown: 5,
	aliases: ['leaderboard', 'lead', 'top'],
	execute(message, args, client) {
		// determine mode(s)
		const pitchersMode = args[args.length - 1] === 'p';
		if (pitchersMode) args.pop();
		const minorsMode = args[args.length - 1] === 'm';
		if (minorsMode) args.pop();

		// search by stat
		const stat = args.join(' ');
		if (stat) {
			http.get(`${domainUrl}/leagues/league_${minorsMode ? 101 : 100}_stats.html`, (resp) => {
				let data = '';
				resp.on('data', (chunk) => {
					data += chunk;
				});

				// handle leaderboard data
				resp.on('end', () => {
					message.channel.send({ embed: {
						color: 3447003,
						author: {
							name: client.user.username,
							icon_url: client.user.avatarURL,
						},
						title: (minorsMode ? 'MiLPBE' : 'PBE') + ' Leaders',
						url: `${domainUrl}/leagues/league_${minorsMode ? 101 : 100}_stats.html`,
						fields: [{
							name: `${stat.toUpperCase()} Top 5 Leaderboard. Add m at the end for minors, add p for pitchers in case of doubled stats e.g. \`!lead WAR m p\``,
							value:  getStatsInfo(data, stat, pitchersMode),
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
			message.channel.send('You have to select stat E.g. Type `!lead Batting AVG` to see current PBE standings, `!lead Batting AVG m` for minors');
		}
	},
};

// configuration for tables
const config = {
	border: getBorderCharacters('honeywell'),
	columnDefault: {
		paddingLeft: 0,
		paddingRight: 0,
		alignment: 'left',
	},
};

// get stats from site
function getStatsInfo(data, stat, pitchersMode) {
	const resultTable = [];
	let skipCount = 0;
	const set = $(`th:icontains(${stat})`, data).parent().parent().children();
	if (set.length >= 6) {
		if (set.length >= 12 && pitchersMode) skipCount = 6;
		for (let i = 0 + skipCount; i < 6 + skipCount; i++) {
			const lineChilds = set.eq(i).children();
			if (i - skipCount === 0) resultTable.push(['#', [lineChilds.eq(0).text().trim()], 'Team', '']);
			else resultTable.push([`${i - skipCount}.`, lineChilds.eq(0).text().trim(), lineChilds.eq(1).text().trim(), lineChilds.eq(2).text().trim()]);
		}
		return '```CSS\n' + table(resultTable, config) + '```';
	} else {
		return 'Stat not found, remember about letter capitalization';
	}
}
