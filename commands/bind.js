/**
* MIT License
*
* Copyright (c) 2019 Paweł Majewski
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/
const playerPersistence = require('../modules/playerPersistence');
const { teamAliases, teamIds } = require('../environment.json');

module.exports = {
	name: 'bind',
	description: 'Binds team to the user, so they don\'t have to specify when using !t !team, !l !lineup, !r !rotation\nE.g. Type `!bind Death Valley Scorpions` and try !t after',
	cooldown: 5,
	execute(message, args) {
		let name = args.join(' ');
		if (name.trim().toLowerCase() in teamAliases) {
			name = teamAliases[name.trim().toLowerCase()];
		}
		const id = teamIds[name.toLowerCase().trim()];
		if (id) {
			playerPersistence.userTeams.upsert({
				username: message.author.id,
				teamname: name,
			});
			return message.channel.send(`Team ${name} is bound to you, use !t !team, !l !lineup, !r !rotation without paramater now!`);
		} else {
			return message.channel.send(`Team ${name} not found, type e.g. \`!bind Death Valley Scorpions\` to bind team to yourself`);
		}
	},
};
