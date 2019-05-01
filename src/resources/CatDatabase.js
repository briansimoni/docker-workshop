const dynamoose = require('dynamoose');
const config = require('../config');

console.log('dynamo url', config.dynamoURL);

if (config.dynamoURL) {
    dynamoose.AWS.config.update({
        accessKeyId: 'AKID',
        secretAccessKey: 'SECRET',
        region: 'us-east-1',
    });
    dynamoose.local(config.dynamoURL);
}

// Create cat model with default options
const Cat = dynamoose.model('Cat', {
    id: Number,
    name: String,
});

class CatDatabase {
    constructor(model = Cat) {
        this.CatModel = model;
    }

    /**
     * @param {Cat} cat
     * @returns {Promise}
     */
    createCat(id, name) {
        return new this.CatModel({ id, name }).save();
    }

    /**
     * @param {String} id
     * @returns {Promise}
     */
    getCat(id) {
        return this.CatModel.get(id);
    }
}

// Create a new cat object
// const garfield = new Cat({
//     id: 666,
//     name: 'Garfield',
// });

// // Save to DynamoDB
// garfield.save(); // Returns a promise that resolves when save has completed

// // Lookup in DynamoDB
// Cat.get(666).then((badCat) => {
//     console.log(`Never trust a smiling cat. - ${badCat.name}`);
// });

module.exports = CatDatabase;
