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
const standings = require('../modules/standingsUtil');
const { domainUrl } = require('../environment.json');

module.exports = {
	name: 'standings',
	description: 'Replies embed with Current PBE or MiLPBE Standings\nE.g. Type `!st` to see PBE standings, `!st m` for minors',
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
			url: `${domainUrl}/leagues/league_${args[0] != null && args[0] === 'm' ? 101 : 100}_standings.html`,
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
