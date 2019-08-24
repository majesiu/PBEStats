module.exports = {
	name: 'help',
	aliases: ['h', 'hlp'],
	description: 'Returns help message',
	cooldown: 5,
	execute(message, args, client) {
		message.channel.send('```!st or !standings show current standings, add m e.g. !st m to see MiLPBE Standings\n!p Player Name show currents stats```');
	},
};