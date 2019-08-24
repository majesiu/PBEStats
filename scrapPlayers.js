const http = require('http');
const $ = require('cheerio');

function nextChar(c) {
	return String.fromCharCode(c.charCodeAt(0) + 1);
}
const players = {};


let letter = 'a';
for (let i = 0; i < 26; i++) {
	console.log(letter);
	http.get(`http://www.pbesim.com/leagues/league_100_players_${letter}.html`, (resp) => {
		let data = '';

		resp.on('data', (chunk) => {
			data += chunk;
		});

		resp.on('end', () => {
			$('td .dl > a[href*="player"]', data).each(function(index, element) {
				players[$(element).text()] = $(element).attr('href');
			});
			console.log(players);
		});

	}).on('error', (err) => {
		console.log('Error: ' + err.message);
	});
	letter = nextChar(letter);
}
