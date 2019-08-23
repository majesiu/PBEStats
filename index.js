const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();
const tabletojson = require('tabletojson');

client.on('ready', () => {
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
	else if (command === 'standings') {
		tabletojson.convertUrl(
			'http://www.pbesim.com/leagues/league_100_standings.html',
			function(tablesAsJson) {
				const East = tablesAsJson[3];
				console.log(East[0]);
				const West = tablesAsJson[4];
				let returnMessage = '> **Current Standings:**';
				for (let i = 0; i < East.length; i++) {
					// emotes instead of team names???
					returnMessage += '\n > ' + East[i].Team.split(' ')[0]; 
				}
				returnMessage += '\n > © majesiu';
				return message.channel.send(returnMessage);
			}
		);
	}
});

client.login(token);