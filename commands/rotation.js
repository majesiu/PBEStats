const http = require('http');
const $ = require('cheerio');

const playerPersistence = require('../modules/playerPersistence');

const teamColors = {
	'new york voyagers': 0xbabf88,
	'florida space rangers': 0x000001,
	'outer banks aviators': 0xce5428,
	'cancun toros': 0xec60b0,
	'providence crabs': 0x0067b5,
	'death valley scorpions': 0x9f1c33,
	'vancouver vandals': 0x228b22,
	'san antonio sloths': 0xc6b3a2,
	'utah railroaders': 0xa854c9,
	'nashville stars': 0x83c1ec,
	'anchorage wheelers': 0xa0fbff,
	'amarillo armadillos': 0xffdb00,
	'state college swift steeds': 0x519fd8,
	'kingston mounties': 0x460505,
	'dallas dynamos': 0x17ece5,
	'kansas city hepcats': 0xc9e5ff,
};

const teamIds = {
	'new york voyagers': 1,
	'florida space rangers': 24,
	'outer banks aviators': 2,
	'cancun toros': 26,
	'providence crabs': 3,
	'death valley scorpions': 10,
	'vancouver vandals': 11,
	'san antonio sloths': 9,
	'utah railroaders': 25,
	'nashville stars': 27,
	'anchorage wheelers': 16,
	'amarillo armadillos': 19,
	'state college swift steeds': 18,
	'kingston mounties': 17,
	'dallas dynamos': 29,
	'kansas city hepcats': 28,
};

const teamAliases = {
	'nyv' :'new york voyagers',
	'fl' :'florida space rangers',
	'obx' :'outer banks aviators',
	'can:' :'cancun toros',
	'pro' :'providence crabs',
	'dvs' :'death valley scorpions',
	'van' :'vancouver vandals',
	'sas' :'san antonio sloths',
	'uta' :'utah railroaders',
	'nas' :'nashville stars',
	'anc' :'anchorage wheelers',
	'arm' :'amarillo armadillos',
	'scss' :'state college swift steeds',
	'kin' :'kingston mounties',
	'dal' :'dallas dynamos',
	'kch' :'kansas city hepcats',
	'new york' :'new york voyagers',
	'florida' :'florida space rangers',
	'outer banks' :'outer banks aviators',
	'cancun:' :'cancun toros',
	'providence' :'providence crabs',
	'death valley' :'death valley scorpions',
	'vancouver' :'vancouver vandals',
	'san antonio' :'san antonio sloths',
	'utah' :'utah railroaders',
	'nashville' :'nashville stars',
	'ananchoragec' :'anchorage wheelers',
	'amarillo' :'amarillo armadillos',
	'state college' :'state college swift steeds',
	'kingston' :'kingston mounties',
	'dallas' :'dallas dynamos',
	'kansas city' :'kansas city hepcats',
	'voyagers' :'new york voyagers',
	'rangers' :'florida space rangers',
	'aviators' :'outer banks aviators',
	'toros:' :'cancun toros',
	'crabs' :'providence crabs',
	'scorpions' :'death valley scorpions',
	'vandals' :'vancouver vandals',
	'sloths' :'san antonio sloths',
	'railroaders' :'utah railroaders',
	'stars' :'nashville stars',
	'wheelers' :'anchorage wheelers',
	'armadillos' :'amarillo armadillos',
	'swift steeds' :'state college swift steeds',
	'mounties' :'kingston mounties',
	'dynamos' :'dallas dynamos',
	'hepcats' :'kansas city hepcats',
	'swifties' :'state college swift steeds',
};

module.exports = {
	name: 'rotation',
	aliases: ['r', 'bulpen', 'starters'],
	description: 'Returns team pitchers info embed\nE.g. Type "!rotation Florida Space Rangers" to see Pitching Staff of that team',
	cooldown: 5,
	async execute(message, args, client) {
		let teamName = args.join(' ');
		if(teamName.trim().toLowerCase() in teamAliases) {
			teamName = teamAliases[teamName.trim().toLowerCase()];
		}
		if(teamName === '') {
			const teamname = await playerPersistence.userTeams.findOne({ where: { username: message.author.id } });
			if(teamname) {
				teamName = teamname.get('teamname');
			}
			else {
				return message.channel.send('Use !bind Team Name to bind team to the !t command');
			}
		}
		const id = teamIds[teamName.toLowerCase().trim()];
		if(id) {
			http.get(`http://www.pbesim.com/teams/team_${id}.html`, (resp) => {
				let data = '';
				resp.on('data', (chunk) => {
					data += chunk;
				});
				resp.on('end', () => {
					const title = $('.reptitle ', data).text();
					console.log(title);
					return message.channel.send({ embed: {
						color: teamColors[title.replace('(R)', '').toLowerCase().trim()],
						author: {
							name: client.user.username,
							icon_url: client.user.avatarURL,
						},
						thumbnail: {
							url: $('img[src*="team_logos"]', data).attr('src').replace('..', 'http://www.pbesim.com'),
						},
						title: title,
						url: `http://www.pbesim.com/players/player_${id}.html`,
						fields: [
							{
								name: 'Pitching Staff',
								value:  pitchingData(data),
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
		}
		else {
			return message.channel.send(`Team ${teamName} not found`);
		}
	},
};


// const tableLineupConfig = {
// 	border: getBorderCharacters('honeywell'),
// 	columnDefault: {
// 		paddingLeft: 0,
// 		paddingRight: 0,
// 		alignment: 'left',
// 	},
// 	column: {
// 		0: {
// 			width: 7,
// 		},
// 		1: {
// 			width: 5,
// 		},
// 	},
// };

// TODO: make it work with table module
function pitchingData(data) {
	let row = '\n';
	let output = '';
	$('td:contains(PITCHING STAFF)', data).last().children().children().children().children().each(function(index, element) {
		if(index != 0) {
			if((index % 11 != 0)) {
				row += $(element).text().replace('Relief', '').trim();
				if((index + 1) % 11 != 0) {
					row += ' | ';
				}
				else {
					output += row;
					row = '\n';
				}
			}
		}
	});
	output += '';
	return output;
}