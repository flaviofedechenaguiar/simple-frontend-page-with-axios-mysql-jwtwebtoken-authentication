const Sequelize = require('sequelize');
const connection = require('../database/database');

const Game = connection.define('Games', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    year: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
    }
});

Game.sync({ force: false });

module.exports = Game;