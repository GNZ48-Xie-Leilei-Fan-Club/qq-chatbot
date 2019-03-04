const Sequelize = require('sequelize');
const sequelize = new Sequelize('sqlite://./app.db');

const KeywordedResponse = sequelize.define('keyworded_response', {
    keyword: {
        type: Sequelize.STRING,
    },
    response: {
        type: Sequelize.STRING,
    }
});

KeywordedResponse.sync()