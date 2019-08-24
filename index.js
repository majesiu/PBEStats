const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();
const standings = require('./modules/standings.js');

client.on('ready', () => {
	standings.initializeStandings();
	console.log('Ready!');
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'ping') {
		// send back "Pong." to the channel the message was sent in
		message.channel.send('Pong.');
	}
	// else if (command === 'args-info') {
	// 	if (!args.length) {
	// 		return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
	// 	}
	// 	else if (args[0] === 'foo') {
	// 		return message.channel.send('bar');
	// 	}
	// 	message.channel.send(`First argument: ${args[0]}`);
	// }
	// else if (command === 'avatar') {
	// 	if (!message.mentions.users.size) {
	// 		return message.channel.send(`Your avatar: <${message.author.displayAvatarURL}>`);
	// 	}
	// }
	else if (command === 'st' || command === 'standings') {
		return message.channel.send({ embed: {
			color: 3447003,
			author: {
				name: client.user.username,
				icon_url: client.user.avatarURL,
			},
			title: 'PBE Current Standings',
			url: 'http://www.pbesim.com/leagues/league_100_standings.html',
			fields: [{
				name: 'Standings',
				value:  args[0] != null && args[0] === 'm' ? standings.standingsMinors() : standings.standingsMajors(),
			},
			],
			timestamp: new Date(),
			footer: {
				icon_url: client.user.avatarURL,
				text: '© majesiu',
			} },
		});
	}
});

client.login(token);