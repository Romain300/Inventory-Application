const pool = require("./pool");

async function getAllGames() {
    const { rows } = await pool.query(`
        SELECT games.id, games.name, games.genre, games.photo, ARRAY_AGG(developers.name) AS developer_names
        FROM games 
        JOIN game_developers ON games.id = game_developers.game_id 
        JOIN developers ON developers.id = game_developers.developer_id
        GROUP BY games.id, games.name, games.genre
        `);
    return rows;
};

async function getGame(id_game) {
    const { rows } = await pool.query(`
        SELECT games.name, games.genre, games.id, ARRAY_AGG(developers.name) AS developer_names
        FROM games
        JOIN game_developers ON games.id = game_developers.game_id 
        JOIN developers ON developers.id = game_developers.developer_id
        WHERE games.id = $1
        GROUP BY games.name, games.genre, games.id
    `, [id_game]);
    return rows[0];
};

async function addGame(name, genre, developers) {
    //Checking game name and inserting it 
    let foundGame = (await pool.query(`
        SELECT id FROM games WHERE LOWER(TRIM(name)) = LOWER(TRIM($1))
    `, [name])).rows[0];

    if (foundGame) {
        return;
    }

    await pool.query(`
        INSERT INTO games (name, genre) VALUES (TRIM($1), TRIM($2))
    `, [name, genre]);

    foundGame = (await pool.query(`
        SELECT id FROM games WHERE LOWER(TRIM(name)) = LOWER(TRIM($1))
    `, [name])).rows[0];

    //checking developers names and inserting them
    const arrayDevelopers = developers.split(",").map((dev) => dev.trim());
    const developerIds = [];


    for (const developer of arrayDevelopers) {
        
        let foundDeveloper =  (await pool.query(`
            SELECT id FROM developers WHERE LOWER(TRIM(name)) = LOWER($1)
        `, [developer])).rows[0];

        if (!foundDeveloper) {
            await pool.query(`
                INSERT INTO developers (name) VALUES ($1)
            `, [developer]);

            foundDeveloper =  (await pool.query(`
                SELECT id FROM developers WHERE LOWER(TRIM(name)) = LOWER($1)
            `, [developer])).rows[0];
        }

        developerIds.push(foundDeveloper.id);

    }

    //adding data into developers_games table 
    const gameId = foundGame.id;

    for (let devId of developerIds) {
        await pool.query(`
            INSERT INTO game_developers (game_id, developer_id) VALUES ($1, $2)
        `, [gameId, devId]);
    };

};

async function deleteGame(id) {
    await pool.query(`
        DELETE FROM games WHERE id = $1;
    `, [id]);
};

async function updateGame(name, genre, developers, id) {
    const arrayDevelopers = developers.split(",").map((developer) => developer.trim());

    const game = (await pool.query(`
        SELECT games.id, games.name, games.genre, ARRAY_AGG(developers.name) AS developer_names
        FROM games 
        JOIN game_developers ON games.id = game_developers.game_id
        JOIN developers ON developers.id = game_developers.developer_id
        WHERE games.id = $1
        GROUP BY games.id, games.name, games.genre
    `, [id])).rows[0];
    
    //Set up name and genre
    if (name.trim() !== game.name.trim()) {
        await pool.query(`
            UPDATE games 
            SET name = $1
            WHERE id = $2
        `, [name, id]);
    }

    if (genre.trim() !== game.genre.trim()) {
        await pool.query(`
            UPDATE games
            SET genre = $1
            WHERE id = $2
        `, [genre, id]);
    }

    //Set up dev
    const dbDevelopers = game.developer_names.map((dev) => dev.trim().toLowerCase());
    const inputDevelopers = arrayDevelopers.map((dev) => dev.trim().toLowerCase());
    const devDifferent = dbDevelopers.length !== inputDevelopers.length || !inputDevelopers.every((dev) => dbDevelopers.includes(dev));

    if (devDifferent === true) {
        await pool.query(`DELETE from game_developers WHERE game_id = $1`, [id]);

        const developerIds = [];

        for (let developer of arrayDevelopers) {

            let foundDeveloper =  (await pool.query(`
                SELECT id FROM developers WHERE LOWER(TRIM(name)) = LOWER($1)
            `, [developer])).rows[0];
    
            if (!foundDeveloper) {

                await pool.query(`
                    INSERT INTO developers (name) VALUES ($1)
                `, [developer]);

                foundDeveloper =  (await pool.query(`
                    SELECT id FROM developers WHERE LOWER(TRIM(name)) = LOWER($1)
                `, [developer])).rows[0];

            }

            developerIds.push(foundDeveloper.id)
            
        }

        for (let devId of developerIds) {
            await pool.query(`
                INSERT INTO game_developers (game_id, developer_id) VALUES ($1, $2)
            `, [id, devId]);
        };

    };
};

module.exports = {
    getAllGames,
    getGame, 
    addGame,
    deleteGame,
    updateGame
};


//add sanityzing into form 