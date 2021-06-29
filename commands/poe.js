/**
* MIT License
*
* Copyright (c) 2019 Paweł Majewski
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

const compliments = ['Your Team may have missed the playoffs, but you are still a champion.',
	'Your sense of humor puts mine to shame.',
	'Your Player is a well constructed player who is destined to win an award someday.',
	'Your passion for and dedication to the PBE is admirable.',
	'Your future in this league is a bright one!',
	'Your‌ ‌face‌ ‌makes‌ ‌other‌ ‌people‌ ‌look‌ ‌ugly.',
	'Your dog may have strange, mutant hair, but he is cute.',
	'Your aura is quite calming and pleasant.',
	'You’re a bonzer mate!',
	'You shine brighter than the sun!',
	'You like, totally rock man!',
	'You have an excellent ability to manage your team’s locker room and keep players invested.',
	'You can be counted on in an emergency.',
	'You are very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very, very special.',
	'You are the most perfect, lustrous, dazzling, proficient, sleek, fabulous, humorous, honest, gorgeous, funny, polite, friendly, stellar, stupendous, outstanding, upbeat, courageous, optimistic, giving, helpful, sincere, romantic, likable, sensible, open-minded, captivating, ravishing, magnificent, engaging, remarkable, blithesome, charming, glistening, frank, glittering, excellent, glimmering, lovely, agreeable, dynamic, glowing, inquisitive, efficient, vibrant, loyal, adept, plucky, educated, technological, vivacious, brilliant, alluring, competitive, charismatic, loving, bright, amiable, fantastic, vivid, incredible, sparkling, responsible, twinkling, ambitious, passionate, diligent, diplomatic, nice, spectacular, thoughtful, qualified, unique, knowledgeable, marvelous, focused, faithful, flexible, brave, insightful, ample, capable, independent, propitious, philosophical, amazing, adventurous, considerate, elegant, generous, resourceful, persistent, energetic, affectionate, productive, articulate, patient, creative, shimmering, super, enchanting, gleaming, rousing, awesome, warmhearted, gregarious, approachable, organized, favorable, self-confident, imaginative, expert, fearless, powerful, kind, stunning, confident, devoted, accomplished, willing, personable, hardworking, determined, wondrous, splendid, mirthful, bountiful, fortuitous, relaxed person in the world.',
	'You are the epitome of class and excellence.',
	'You are stupendous.',
	'You are sooooooooooooooo good looking.',
	'You are primo',
	'You are neat-o.',
	'You are my hero.',
	'You are more wonderful than a thousand rainbows.',
	'You are indefatigable.',
	'You are humble.',
	'You are highly intelligent.',
	'You are both the hero we need, and the hero we deserve.',
	'You are better than me in every way.',
	'You are a scholar and a gentleperson.',
	'You are a magnificent diamond.',
	'You are a living saint.',
	'You are a good samaritan.',
	'You are a badass.',
	'When you whisper sweet nothings in someone’s ears, they are actually sweet everythings.',
	'When you sing, the entire world stops to listen to the lovely harmonies your voice produces.',
	'When something goes wrong, I just think that I’ll ask for your help, and then she’ll be right.',
	'When I grow up I want to be just like you.',
	'What is your substance, whereof are you made, That millions of strange shadows on you tend? Since every one hath, every one, one shade, And you but one, can every shadow lend. Describe Adonis, and the counterfeit Is poorly imitated after you; On Helen’s cheek all art of beauty set, And you in Grecian tires are painted new: Speak of the spring, and foison of the year, The one doth shadow of your beauty show, The other as your bounty doth appear; And you in every blessed shape we know. In all external grace you have some part, But you like none, none you, for constant heart.',
	'The PBE was a sad, tragic place without you. Now, it is the greatest place in the world!',
	'The only thing more impressive than your brawn is your brain.',
	'So this one time, I was in a jungle, and I tripped and I fell into a pit in the ground, and it was filled with deadly vipers, and they bit me, and then I managed to climb out, but then a tree fell on me and smashed my legs into pulp, and then some monkeys came along and pulled my teeth out one by one, but the whole time I kept the thought of you in my mind, and so I was happy.',
	'Nobody has a better sense of humor than you do.',
	'My goodness sir/madam, you are supercalifragilisticexpialidocious!',
	'Let me guess, your middle name is Gillette, right? Because you\'re the best a man can get!',
	'It\'s been seven hours and 15 days, Since you took your love away, I go out every night and sleep all day, Since you took your love away, Since you been gone, I can do whatever I want, I can see whomever I choose, I can eat my dinner in a fancy restaurant, But nothing, I said nothing can take away these blues, \'Cause nothing compares, Nothing compares to you.',
	'If you were a superhero, you would be… wait, no. You ARE a superhero.',
	'If you were a flower you would be like, totally the prettiest, bestest smellingest one. For sure.',
	'If UFOs came to the planet and asked me to take them to our leader, I would take them to you.',
	'If I had a nickel for every time I saw someone as handsome as you, I\'d have five cents.',
	'If everyone in the world was you, the world would be perfect.',
	'I would want to be like you, but I could not handle the awesomeness.',
	'I want to be as great as you when I grow up.',
	'I have a best friend who I love and is amazing, but I bet you are a better friend than he is.',
	'I can only imagine, but I suspect you smell delightful.',
	'I bet you make babies smile.',
	'I am impressed by the breadth and depth of your intellect.',
	'I admire your perseverance in the face of adversity.',
	'Enoch ain’t the MDM. You da MDM.',
	'Chuck Norris is afraid of you.',
	'C tier: PersonMann. B tier: Hummus God. A tier: Enoch. S-Tier: YOU!',
	'Anyone who speaks with you walks away smarter than they were at the beginning of the conversation.',
	'Although your choice of your favorite team is a huge mistake, your interest in American football is admirable.'
];

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = {
	name: 'poe',
	aliases: ['compliment', 'simo'],
	description: 'Returns random complement commerating S25 Charity Event when Poe had to compliment Simo twice a day after he was pinged.',
	cooldown: 5,
	execute(message) {
		const messageNumber = getRandomInt(0, compliments.length - 1);
		message.channel.send(compliments[messageNumber]);
	},
};
