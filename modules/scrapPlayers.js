const http = require('http');
const $ = require('cheerio');

function nextChar(c) {
	return String.fromCharCode(c.charCodeAt(0) + 1);
}
const players = {};

function initializePlayersList() {
	let letter = 'a';
	// for (let i = 0; i < 26; i++) {
	// 	http.get(`http://www.pbesim.com/leagues/league_100_players_${letter}.html`, (resp) => {
	// 		let data = '';

	// 		resp.on('data', (chunk) => {
	// 			data += chunk;
	// 		});

	// 		resp.on('end', () => {
	// 			$('td .dl > a[href*="player"]', data).each(function(index, element) {
	// 				const key = $(element).text().split(',');
	// 				const id = $(element).attr('href').match(/\d+/)[0];
	// 				players[(`${key[1].toLowerCase().trim()} ${key[0].toLowerCase().trim()}`).trim()] = id;
	// 			});
	// 		});

	// 	}).on('error', (err) => {
	// 		console.log('Error: ' + err.message);
	// 	});
	// 	letter = nextChar(letter);
	// }
	// letter = 'a';
	// for (let i = 0; i < 26; i++) {
	// 	http.get(`http://www.pbesim.com/leagues/league_101_players_${letter}.html`, (resp) => {
	// 		let data = '';

	// 		resp.on('data', (chunk) => {
	// 			data += chunk;
	// 		});

	// 		resp.on('end', () => {
	// 			$('td .dl > a[href*="player"]', data).each(function(index, element) {
	// 				const key = $(element).text().split(',');
	// 				const id = $(element).attr('href').match(/\d+/)[0];
	// 				players[(`${key[1].toLowerCase().trim()} ${key[0].toLowerCase().trim()}`).trim()] = id;
	// 			});
	// 		});

	// 	}).on('error', (err) => {
	// 		console.log('Error: ' + err.message);
	// 	});
	// 	letter = nextChar(letter);
	// }
	letter = 'a';
	for (let i = 0; i < 26; i++) {
		http.get(`http://www.pbesim.com/history/league_100_players_by_letter_${letter}.html`, (resp) => {
			let data = '';

			resp.on('data', (chunk) => {
				data += chunk;
			});

			resp.on('end', () => {
				$('td .dl > a[href*="player"]', data).each(function(index, element) {
					let key = $(element).text().toLowerCase().trim().split(' ').filter(function(el) {
						return el.length > 0;
					});
					key.forEach(function(el, ind, arr) {
						arr[ind] = el.trim();
					});
					key = key.join(' ');
					const id = $(element).attr('href').match(/\d+/)[0];
					players[key] = id;
				});
			});

		}).on('error', (err) => {
			console.log('Error: ' + err.message);
		});
		letter = nextChar(letter);
	}
	letter = 'a';
	for (let i = 0; i < 26; i++) {
		http.get(`http://www.pbesim.com/history/league_101_players_by_letter_${letter}.html`, (resp) => {
			let data = '';

			resp.on('data', (chunk) => {
				data += chunk;
			});

			resp.on('end', () => {
				$('td .dl > a[href*="player"]', data).each(function(index, element) {
					let key = $(element).text().toLowerCase().trim().split(' ').filter(function(el) {
						return el.length > 0;
					});
					key.forEach(function(el, ind, arr) {
						arr[ind] = el.trim();
					});
					key = key.join(' ');
					const id = $(element).attr('href').match(/\d+/)[0];
					players[key] = id;
				});
			});

		}).on('error', (err) => {
			console.log('Error: ' + err.message);
		});
		letter = nextChar(letter);
	}
}

function getPlayers() {
	return players;
}

exports.initializePlayersList = initializePlayersList;
exports.getPlayers = getPlayers;