const Sequelize = require('sequelize');

// We can add custom getters, setters, or validators to the class
// the models could easily be organized into different files
class Pet extends Sequelize.Model { }

// actually don't need to inject fakeModels
// could easily better mock the sequalize object and just let it do its thing
// ... or maybe not. Maybe I need to use the models.define instead of the class syntax
class PetDatabase {
    /** @param {Sequelize} sequelize */
    constructor(sequelize, model = Pet) {
        this.database = sequelize;

        // setting the models to the object instance allows for dependency injection
        this.models = {
            Pet: model,
        };

        this.models.Pet.init(
            {
                name: Sequelize.STRING,
            },
            {
                sequelize,
                modelName: 'pet',
            },
        );
    }

    async createPet(pet) {
        await this.database.sync();
        const newPet = await this.models.Pet.create(pet);
        return newPet;
    }
}

module.exports = PetDatabase;
