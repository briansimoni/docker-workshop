
const Sequelize = require('sequelize');
const Hapi = require('hapi');
const DogDatabase = require('./resources/DogDatabase');
const CatDatabase = require('./resources/CatDatabase');

const init = async () => {
    const db = new Sequelize('pets', 'root', 'development', {
        host: 'mysql',
        dialect: 'mysql',
    });
    const dogDatabase = new DogDatabase(db);

    const catDb = new CatDatabase();

    const server = Hapi.server({
        port: 8080,
        host: '0.0.0.0',
    });

    server.route({
        method: 'GET',
        path: '/dogs',
        handler: async (request, h) => {
            try {
                const pet = await dogDatabase.createPet({ name: 'dog!' });
                return pet.toJSON();
            } catch (err) {
                console.error(err);
                return JSON.stringify(err);
            }
        },
    });

    server.route({
        method: 'GET',
        path: '/cats',
        handler: async (request, h) => {
            try {
                const id = Math.round(Math.random() * 1000);
                await catDb.createCat(id, 'cat!');
                const cat = await catDb.getCat(id);
                return JSON.stringify(cat);
            } catch (err) {
                console.error(err);
                return JSON.stringify(err);
            }
        },
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();
