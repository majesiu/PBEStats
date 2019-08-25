const tabletojson = require('tabletojson');
const { table, getBorderCharacters } = require('table');
const { majorsStandingsLink, minorsStandingsLink } = require('../config.json');
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
		majorsStandingsLink,
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
		minorsStandingsLink,
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
			standingsEastMinors = '```yaml\n' + table(eastTable, config) + '```';
			for (let i = 0; i < West.length; i++) {
				westTable.push([emotes[West[i].Team], West[i].W, West[i].L, West[i].PCT, West[i].Home, West[i].Away, West[i].Streak, West[i].Last10]);
			}
			standingsWestMinors = '```fix\n' + table(westTable, config) + '```';
		});
	console.log('Initialized Standings');
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

initializeStandings();