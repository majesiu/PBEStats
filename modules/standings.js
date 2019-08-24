'use strict';
const tabletojson = require('tabletojson');
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

let standingsMajors;
let standingsMinors;


function initializeStandings() {
	tabletojson.convertUrl(
		majorsStandingsLink,
		function(tablesAsJson) {
			const East = tablesAsJson[3];
			const West = tablesAsJson[4];
			standingsMajors = '\n**East Division:**\nTeam |  W |  L |  PCT |  Home |  Away |  Streak |  Last10';
			for (let i = 0; i < East.length; i++) {
				standingsMajors += `\n ${i + 1}. ${emotes[East[i].Team]} | ${East[i].W}-${East[i].L} |  ${East[i].PCT} |  ${East[i].Home} |  ${East[i].Away} |  ${East[i].Streak} |  ${East[i].Last10}`;
			}
			standingsMajors += '\n\n**West Division:**\nTeam |  W  |  L |  PCT |  Home | Away |  Streak |  Last10';
			for (let i = 0; i < West.length; i++) {
				standingsMajors += `\n ${i + 1}. ${emotes[West[i].Team]} |  ${West[i].W}-${West[i].L} |  ${West[i].PCT} |  ${West[i].Home} |  ${West[i].Away} |  ${West[i].Streak} |  ${West[i].Last10}`;
			}
		});
	tabletojson.convertUrl(
		minorsStandingsLink,
		function(tablesAsJson) {
			const East = tablesAsJson[3];
			const West = tablesAsJson[4];
			standingsMinors = '\n**East Division:**\nTeam |  W |  L |  PCT |  Home |  Away |  Streak |  Last10';
			for (let i = 0; i < East.length; i++) {
				standingsMinors += `\n ${i + 1}. ${emotes[East[i].Team]} | ${East[i].W}-${East[i].L} |  ${East[i].PCT} |  ${East[i].Home} |  ${East[i].Away} |  ${East[i].Streak} |  ${East[i].Last10}`;
			}
			standingsMinors += '\n\n**West Division:**\nTeam |  W  |  L |  PCT |  Home | Away |  Streak |  Last10';
			for (let i = 0; i < West.length; i++) {
				standingsMinors += `\n ${i + 1}. ${emotes[West[i].Team]} |  ${West[i].W}-${West[i].L} |  ${West[i].PCT} |  ${West[i].Home} |  ${West[i].Away} |  ${West[i].Streak} |  ${West[i].Last10}`;
			}
		});
	console.log('Initialized Standings');
}

function getStandingsMajors() {
	return standingsMajors;
}

function getStandingsMinors() {
	return standingsMinors;
}

exports.initializeStandings = initializeStandings;
exports.standingsMinors = getStandingsMinors;
exports.standingsMajors = getStandingsMajors;

