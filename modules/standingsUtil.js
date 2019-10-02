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
	'Florida Space Rangers':'FSR',
	'Outer Banks Aviators':'OBX',
	'Cancun Toros':'CAN',
	'Providence Crabs':'PRO',
	'Death Valley Scorpions':'DVS',
	'Vancouver Vandals':'VAN',
	'San Antonio Sloths':'SAS',
	'Utah Railroaders':'UTA',
	'Nashville Stars':'NAS',
	'Anchorage Wheelers':'ANC',
	'Amarillo Armadillos':'AMA',
	'State College Swift Steeds':'SCSS',
	'Kingston Mounties':'KIN',
	'Dallas Dynamos':'DAL',
	'Kansas City Hepcats':'KCH',
};


let standingsEastMajors;
let standingsWestMajors;
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

// TODO: transform/add this into cron-job
// TODO: Colorize tables using discord https://www.reddit.com/r/discordapp/comments/8lev3t/discord_colored_text_with_code_markup_guide/
function initializeStandings() {
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
			standingsEastMajors = '```yaml\n' + table(eastTable, config) + '```';
			for (let i = 0; i < West.length; i++) {
				westTable.push([emotes[West[i].Team], West[i].W, West[i].L, West[i].PCT, West[i].Home, West[i].Away, West[i].Streak, West[i].Last10]);
			}
			standingsWestMajors = '```fix\n' + table(westTable, config) + '```';
		});
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
		});
}

function getStandingsEastMajors() {
	return standingsEastMajors;
}

function getStandingsWestMajors() {
	return standingsWestMajors;
}

function getStandingsEastMinors() {
	return standingsEastMinors;
}

function getStandingsWestMinors() {
	return standingsWestMinors;
}

exports.initializeStandings = initializeStandings;
exports.getStandingsEastMajors = getStandingsEastMajors;
exports.getStandingsWestMajors = getStandingsWestMajors;
exports.getStandingsEastMinors = getStandingsEastMinors;
exports.getStandingsWestMinors = getStandingsWestMinors;
