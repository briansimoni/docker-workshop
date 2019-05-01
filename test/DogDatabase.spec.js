const { expect } = require('chai');
const DogDatabase = require('../src/resources/DogDatabase');

const sequelizeFake = {
    type: 'object',
    sync() {
        return Promise.resolve();
    },
    // options: {
    //     define: function () { },
    // },
    // runHooks: function () { },
    // isDefined: function () { },
    // normalizeAttribute: function () { },
    // define: function () { },
};

const fakePetModel = {
    initCalled: false,
    create(petObj) {
        return Promise.resolve(petObj);
    },
    init() {
        this.initCalled = true;
    },
};

describe('Pet Database tests', () => {
    it('creates a new pet', async () => {
        const db = new DogDatabase(sequelizeFake, fakePetModel);
        const dog = await db.createPet({ name: 'asdf' });
        expect(db.models.Pet.initCalled).to.be.true;
        expect(dog.name).to.be.equal('asdf');
    });
});
