const http = require('http');
const $ = require('cheerio');

function getPlayerInfo(id) {
	http.get(`http://www.pbesim.com/players/player_${id}.html`, (resp) => {
		let data = '';
		resp.on('data', (chunk) => {
			data += chunk;
		});
		resp.on('end', () => {
			const title = $('.reptitle ', data).text();
			console.log(title);
			/* if(title.startsWith('P')) {
				console.log(parsePitcherPage(data));
			}
			else {
				console.log(parseBatterPage(data));
			}
			console.log($('img[src*="player"]', data).attr('src'));
			console.log('Team name: ' + $('a[href*="team"]', data).eq(0).text());*/
			// console.log(parseAdvancedBattingStats(data));
			console.log(parseFieldingStats(data));
		});
	}).on('error', (err) => {
		console.log('Error: ' + err.message);
	});
}

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
	return advancedInfo;
}

function parseFieldingStats(data) {
	let fieldingInfo = '';
	fieldingInfo += '\nPosition: ' + $('th:contains(CAREER FIELDING STATS)', data).parent().parent().parent().next().children().children('tr:not(tr .hsi)').last().children().eq(1).text();
	fieldingInfo += '\nPutouts: ' + $('th:contains(CAREER FIELDING STATS)', data).parent().parent().parent().next().children().children('tr:not(tr .hsi)').last().children().eq(4).text();
	fieldingInfo += '\nAssists: ' + $('th:contains(CAREER FIELDING STATS)', data).parent().parent().parent().next().children().children('tr:not(tr .hsi)').last().children().eq(5).text();
	fieldingInfo += '\nErrors: ' + $('th:contains(CAREER FIELDING STATS)', data).parent().parent().parent().next().children().children('tr:not(tr .hsi)').last().children().eq(8).text();
	fieldingInfo += '\nRange Factor: ' + $('th:contains(CAREER FIELDING STATS)', data).parent().parent().parent().next().children().children('tr:not(tr .hsi)').last().children().eq(11).text();
	fieldingInfo += '\nZone Rating: ' + $('th:contains(CAREER FIELDING STATS)', data).parent().parent().parent().next().children().children('tr:not(tr .hsi)').last().children().eq(12).text();
	fieldingInfo += '\nEfficiency: ' + $('th:contains(CAREER FIELDING STATS)', data).parent().parent().parent().next().children().children('tr:not(tr .hsi)').last().children().eq(13).text();
	return fieldingInfo;
}

function parsePitcherPage(data) {
	let basicInfo = '';
	basicInfo += '\nGames/Started: ' + $('table .data > tbody > tr > td:nth-child(1)', data).eq(0).text() + '/' + $('table .data > tbody > tr > td:nth-child(2)', data).last().text();
	basicInfo += '\nRecord: ' + $('table .data > tbody > tr > td:nth-child(3)', data).eq(0).text();
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

exports.parseBatterPage = parseBatterPage;
exports.parsePitcherPage = parsePitcherPage;
exports.parseAdvancedBattingStats = parseAdvancedBattingStats;
exports.parseAdvancedBattingStats = parseAdvancedBattingStats;
exports.parseFieldingStats = parseFieldingStats;

console.log(getPlayerInfo('599'));
console.log(getPlayerInfo('48'));