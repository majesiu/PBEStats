// const http = require('http');
const $ = require('cheerio');

// function getPlayerInfo(id) {
// 	http.get(`http://www.pbesim.com/players/player_${id}.html`, (resp) => {
// 		let data = '';
// 		resp.on('data', (chunk) => {
// 			data += chunk;
// 		});
// 		resp.on('end', () => {
// 			const title = $('.reptitle ', data).text();
// 			console.log(title);
// 			if(title.startsWith('P')) {
// 				console.log(parsePitcherPage(data));
// 			}
// 			else {
// 				console.log(parseBatterPage(data));
// 			}
// 		});
// 	}).on('error', (err) => {
// 		console.log('Error: ' + err.message);
// 	});
// }

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

function parsePitcherPage(data) {
	let basicInfo = '';
	basicInfo += '\nGames/Started: ' + $('table .data > tbody > tr > td:nth-child(1)', data).eq(0).text() + '/' + $('table .data > tbody > tr > td:nth-child(2)', data).eq(0).text();
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