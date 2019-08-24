module.exports = {
	name: 'ping',
	description: 'Ping!',
	cooldown: 5,
	execute(message, args, client) {
		message.channel.send('Pong.');
	},
};