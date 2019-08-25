const playerPersistence = require('../modules/playerPersistence');

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
	name: 'bind',
	description: 'Binds team to the user, so they don\'t have to specify when using !t !team, !l !lineup, !r !rotation',
	cooldown: 5,
	execute(message, args) {
		const name = args.join(' ');
		const id = teamIds[name.toLowerCase().trim()];
		if(id) {
			playerPersistence.userTeams.upsert({
				username: message.author.id,
				teamname: name,
			});
			return message.channel.send(`Team ${name} is bound to you, use !t !team, !l !lineup, !r !rotation without paramater now!`);
		}
		else {
			return message.channel.send(`Team ${name} not found`);
		}
	},
};