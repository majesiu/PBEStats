const Sequelize = require('sequelize');

const sequelize = new Sequelize('PBEStats', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	operatorsAliases: false,
	// SQLite only
	storage: 'database.sqlite',
});

const userPlayers = sequelize.define('userPlayers', {
	username: {
		type: Sequelize.STRING,
		unique: true,
	},
	playername: Sequelize.STRING,
});

const userTeams = sequelize.define('userTeams', {
	username: {
		type: Sequelize.STRING,
		unique: true,
	},
	teamname: Sequelize.STRING,
});


exports.userPlayers = userPlayers;
exports.userTeams = userTeams;