const scrapPlayers = require('../modules/scrapPlayers');
const playerPersistence = require('../modules/playerPersistence'); 

module.exports = {
	name: 'save',
	description: 'Binds player to the user, so they don\'t have to specify when using !p',
	cooldown: 5,
	execute(message, args) {
		const name = args.join(' ');
		const id = scrapPlayers.getPlayers()[name];
		if(id) {
			playerPersistence.userPlayers.upsert({
				username: message.author.id,
				playername: name,
			});
			return message.channel.send(`Player ${name} is bound to you, use !p now!`);
		}
		else {
			return message.channel.send(`Player ${name} not found`);
		}
	},
};