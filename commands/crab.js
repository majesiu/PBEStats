/**
* MIT License
*
* Copyright (c) 2025 Paweł Majewski
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the 'Software'), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/

const crabLines = [
    "Don’t get caught in the Crab Trap!",
    "Other teams are just crabby we’re better.",
    "We’ll pinch the victory!",
    "Better bring butter, ‘cause you’re about to get steamed.",
    "Hope you packed Old Bay, you’re dinner tonight.",
    "We’ll crack your lineup wide open.",
    "These claws don’t let go.",
    "The tide always brings the Crabs back on top.",
    "We’re shelling out L’s today.",
    "Our pinch is stronger than your punch.",
    "Your bullpen’s about to get buttered.",
    "We don’t play small ball, we play shell ball.",
    "Stealing bases? That’s a crab walk for us.",
    "Every inning is crab season.",
    "The only thing you’re catching today is claws.",
    "Your closer’s about to get claw-sed out."
];

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = {
	name: 'south',
	aliases: ['crab', 'crabs', 'southworth'],
	description: 'Returns random complement commerating S25 Charity Event when Poe had to compliment Simo twice a day after he was pinged.',
	cooldown: 5,
	execute(message) {
		const messageNumber = getRandomInt(0, crabLines.length - 1);
		message.channel.send(crabLines[messageNumber]);
	},
};
