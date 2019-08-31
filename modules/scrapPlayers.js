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

function getPlayersNames() {
	const playerNames = [];
	for (const key in players) {
		if (Object.prototype.hasOwnProperty.call(players, key)) {
			const name = new Object();
			name.fullName = key;
			playerNames.push(name);
		}
	}
	return playerNames;
}

exports.initializePlayersList = initializePlayersList;
exports.getPlayers = getPlayers;
exports.getPlayersNames = getPlayersNames;