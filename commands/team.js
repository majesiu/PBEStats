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

module.exports = {
	name: 'team',
	aliases: ['t', 'tm'],
	description: 'Returns team info embed',
	cooldown: 5,
	async execute(message, args, client) {
		let teamName = args.join(' ');
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
								name: 'Basic Stats',
								value:  basicStats(data),
								inline: true,
							},
							{
								name: 'Batting Stats',
								value:  battingStats(data),
								inline: true,
							},
							{
								name: 'Pitching Stats',
								value:  pitchingStats(data),
								inline: true,
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

function basicStats(data) {
	let output = '';
	$('table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table:nth-child(5) > tbody > tr:nth-child(1) > td', data).parent().parent().children().children('td').each(function(index, element) {
		if(index != 0) {
			output += $(element).text();
			index % 2 != 0 ? output += ': ' : output += '\n';
		}
	});
	return output;
}

function battingStats(data) {
	let output = '';
	$('table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table:nth-child(6) > tbody > tr:nth-child(1) > td', data).parent().parent().children().children('td').each(function(index, element) {
		if(index != 0) {
			output += $(element).text();
			index % 2 != 0 ? output += ': ' : output += '\n';
		}
	});
	return output;
}

function pitchingStats(data) {
	let output = '';
	$('table:nth-child(1) > tbody > tr:nth-child(2) > td > table > tbody > tr > td:nth-child(2) > table:nth-child(7) > tbody > tr:nth-child(1) > td', data).parent().parent().children().children('td').each(function(index, element) {
		if(index != 0) {
			output += $(element).text();
			index % 2 != 0 ? output += ': ' : output += '\n';
		}
	});
	return output;
}