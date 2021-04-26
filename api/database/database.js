const Sequelize = require('sequelize');
const connection = new Sequelize('api-database', 'root', '', {
    host: 'mysql-api',
    dialect: 'mysql',
    timezone: '-05:00'
})

module.exports = connection;