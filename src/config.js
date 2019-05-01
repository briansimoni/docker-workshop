// config.js
const dotenv = require('dotenv');

dotenv.config();
module.exports = {
    port: process.env.PORT,
    dynamoURL: process.env.DYNAMO_URL,
};
