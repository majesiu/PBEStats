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
const tabletojson = require('tabletojson');
const { table, getBorderCharacters } = require('table');
const { domainUrl } = require('../environment.json');


const emotes = {
	'New York Voyagers':'NYV',
	'Lunar Base Space Rangers':'LBSR',
	'Outer Banks Aviators':'OBX',
	'Cancun Toros':'CAN',
	'Providence Crabs':'PRO',
	'Death Valley Scorpions':'DVS',
	'Vancouver Vandals':'VAN',
	'San Antonio Sloths':'SAS',
	'Boise Raptors':'BOI',
	'Nashville Stars':'NAS',
	'Anchorage Wheelers':'ANC',
	'Amarillo Armadillos':'AMA',
	'State College Swift Steeds':'SCSS',
	'Kingston Mounties':'KIN',
	'Dallas Dynamos':'DAL',
	'Kansas City Hepcats':'KCH',
	'Chicago Kingpins':'CHI',
	'San Bernardino 66ers':'SB',
	'New Orleans Rougarous': 'NO',
	'Detroit Demons': 'DET',
	'Toronto Pathfinders': 'TOR',
	'Indianapolis Apex': 'IND',
	'Brew City Bears': 'BCB',
	'Louisville Lemurs': 'LOU',
	"Buffalo Surge": "BUF", 
	"Seattle Sea Serpents": "SEA",
	"California Firehawks": "CAL",
	"Florida Flamingos": "FLA",
	"Puerto Rico Ranas": "RAN"
};


let standingsEastChampions;
let standingsWestChampions;
let standingsEastLegends;
let standingsWestLegends;
let standingsEastMinors;
let standingsWestMinors;
const config = {
	border: getBorderCharacters('honeywell'),
	columnDefault: {
		paddingLeft: 0,
		paddingRight: 0,
		alignment: 'left',
	},
};

function getStandingsEastChampions() {
	return standingsEastChampions;
}

function getStandingsWestChampions() {
	return standingsWestChampions;
}

function getStandingsEastLegends() {
	return standingsEastLegends;
}

function getStandingsWestLegends() {
	return standingsWestLegends;
}

function getStandingsEastMinors() {
	return standingsEastMinors;
}

function getStandingsWestMinors() {
	return standingsWestMinors;
}

module.exports = {
	name: 'standings',
	description: 'Replies embed with Current PBE or MiLPBE Standings\nE.g. Type `!st` to see PBE standings, `!st m` for minors',
	cooldown: 5,
	aliases: ['st', 's'],
	execute(message, args, client) {
		if(args[0] != null && args[0] === 'm'){
			tabletojson.convertUrl(
				`${domainUrl}/leagues/league_101_standings.html`,
				function(tablesAsJson) {
					const East = tablesAsJson[4];
					const West = tablesAsJson[3];
					const eastTable = [];
					const westTable = [];
					eastTable.push(['Team', 'W', 'L', 'PCT', 'Home', 'Away', 'Strk', 'Last10']);
					westTable.push(['Team', 'W', 'L', 'PCT', 'Home', 'Away', 'Strk', 'Last10']);
					for (let i = 0; i < East.length; i++) {
						eastTable.push([emotes[East[i].Team], East[i].W, East[i].L, East[i].PCT, East[i].Home, East[i].Away, East[i].Streak, East[i].Last10]);
					}
					standingsEastMinors = '```yaml\n' + table(eastTable, config) + '```';
					for (let i = 0; i < West.length; i++) {
						westTable.push([emotes[West[i].Team], West[i].W, West[i].L, West[i].PCT, West[i].Home, West[i].Away, West[i].Streak, West[i].Last10]);
					}
					standingsWestMinors = '```fix\n' + table(westTable, config) + '```';
					message.channel.send({ embed: {
						color: 3447003,
						author: {
							name: client.user.username,
							icon_url: client.user.avatarURL,
						},
						title: 'MiLPBE Current Standings',
						url: `${domainUrl}/leagues/league_${args[0] != null && args[0] === 'm' ? 101 : 100}_standings.html`,
						fields: [{
							name: 'West Standings',
							value:  getStandingsWestMinors(),
						},
						{
							name: 'East Standings',
							value:  getStandingsEastMinors(),
						},
						],
						timestamp: new Date(),
						footer: {
							icon_url: client.user.avatarURL,
							text: '© majesiu',
						} },
					});
				})
		} else {
			tabletojson.convertUrl(
				`${domainUrl}/leagues/league_100_standings.html`,
				function(tablesAsJson) {
					const East = tablesAsJson[3];
					const West = tablesAsJson[4];
					const eastTable = [];
					const westTable = [];
					eastTable.push(['Team', 'W', 'L', 'PCT', 'Home', 'Away', 'Strk', 'Last10']);
					westTable.push(['Team', 'W', 'L', 'PCT', 'Home', 'Away', 'Strk', 'Last10']);
					for (let i = 0; i < East.length; i++) {
						eastTable.push([emotes[East[i].Team], East[i].W, East[i].L, East[i].PCT, East[i].Home, East[i].Away, East[i].Streak, East[i].Last10]);
					}
					standingsEastLegends = '```yaml\n' + table(eastTable, config) + '```';
					for (let i = 0; i < West.length; i++) {
						westTable.push([emotes[West[i].Team], West[i].W, West[i].L, West[i].PCT, West[i].Home, West[i].Away, West[i].Streak, West[i].Last10]);
					}
					standingsWestLegends = '```fix\n' + table(westTable, config) + '```';
					const East2 = tablesAsJson[6];
					const West2 = tablesAsJson[7];
					const east2Table = [];
					const west2Table = [];
					east2Table.push(['Team', 'W', 'L', 'PCT', 'Home', 'Away', 'Strk', 'Last10']);
					west2Table.push(['Team', 'W', 'L', 'PCT', 'Home', 'Away', 'Strk', 'Last10']);
					for (let i = 0; i < East2.length; i++) {
						east2Table.push([emotes[East2[i].Team], East2[i].W, East2[i].L, East2[i].PCT, East2[i].Home, East2[i].Away, East2[i].Streak, East2[i].Last10]);
					}
					standingsEastChampions = '```yaml\n' + table(east2Table, config) + '```';
					for (let i = 0; i < West2.length; i++) {
						west2Table.push([emotes[West2[i].Team], West2[i].W, West2[i].L, West2[i].PCT, West2[i].Home, West2[i].Away, West2[i].Streak, West2[i].Last10]);
					}
					standingsWestChampions = '```fix\n' + table(west2Table, config) + '```';
					message.channel.send({ embed: {
						color: 3447003,
						author: {
							name: client.user.username,
							icon_url: client.user.avatarURL,
						},
						title: 'PBE Current Standings',
						url: `${domainUrl}/leagues/league_${args[0] != null && args[0] === 'm' ? 101 : 100}_standings.html`,
						fields: [{
							name: 'Champions West Standings',
							value: getStandingsWestChampions(),
						},
						{
							name: 'Champions East Standings',
							value: getStandingsEastChampions(),
						},
							{
							name: 'Legends West Standings',
							value: getStandingsWestLegends(),
						},
						{
							name: 'Legends East Standings',
							value: getStandingsEastLegends(),
						},
						],
						timestamp: new Date(),
						footer: {
							icon_url: client.user.avatarURL,
							text: '© majesiu',
						} },
				})
			});
		}
	},
};
