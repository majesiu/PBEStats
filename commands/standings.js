const standings = require('../modules/standingsUtil');

module.exports = {
	name: 'standings',
	description: 'Replies embed with Current PBE or MiLPBE Standings',
	cooldown: 5,
	aliases: ['st', 's'],
	execute(message, args, client) {
		message.channel.send({ embed: {
			color: 3447003,
			author: {
				name: client.user.username,
				icon_url: client.user.avatarURL,
			},
			title: args[0] != null && args[0] === 'm' ? 'MiLPBE Current Standings' : 'PBE Current Standings',
			url: args[0] != null && args[0] === 'm' ? 'http://www.pbesim.com/leagues/league_101_standings.html' : 'http://www.pbesim.com/leagues/league_100_standings.html',
			fields: [{
				name: 'West Standings',
				value:  args[0] != null && args[0] === 'm' ? standings.getStandingsWestMinors() : standings.getStandingsWestMajors(),
			},
			{
				name: 'East Standings',
				value:  args[0] != null && args[0] === 'm' ? standings.getStandingsEastMinors() : standings.getStandingsEastMajors(),
			},
			],
			timestamp: new Date(),
			footer: {
				icon_url: client.user.avatarURL,
				text: '© majesiu',
			} },
		});
	},
};