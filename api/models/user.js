const Sequelize = require('sequelize');
const connection = require('../database/database.js');

const User = connection.define('Users', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

User.sync({force: false});

module.exports = User;