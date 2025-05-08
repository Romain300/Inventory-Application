const pool = require("./pool");

async function getAllGames() { 
    const { rows } = await pool.query(`
        SELECT games.id, games.name, ARRAY_AGG(DISTINCT genres.name)  AS genres, games.photo, ARRAY_AGG(DISTINCT developers.name) AS developer_names
        FROM games 
        LEFT JOIN game_genres ON game_genres.game_id = games.id
        LEFT JOIN genres ON genres.id = game_genres.genre_id
        LEFT JOIN game_developers ON games.id = game_developers.game_id 
        LEFT JOIN developers ON developers.id = game_developers.developer_id
        GROUP BY games.id, games.name, games.photo
        `);
    return rows;
};

async function getGame(id_game) {
    const { rows } = await pool.query(`
        SELECT games.name, games.id, games.photo, ARRAY_AGG(DISTINCT genres.name) AS genres, ARRAY_AGG(DISTINCT developers.name) AS developer_names
        FROM games
        LEFT JOIN game_genres ON game_genres.game_id = games.id
        LEFT JOIN genres ON genres.id = game_genres.genre_id
        LEFT JOIN game_developers ON games.id = game_developers.game_id 
        LEFT JOIN developers ON developers.id = game_developers.developer_id
        WHERE games.id = $1
        GROUP BY games.name, games.id, games.photo
    `, [id_game]);
    return rows[0];
};

async function addGame(name, genres, developers, photo) {
    //Checking game name and inserting it 
    let foundGame = (await pool.query(`
        SELECT id FROM games WHERE LOWER(TRIM(name)) = LOWER(TRIM($1))
    `, [name])).rows[0];

    if (foundGame) {
        return;
    }

    await pool.query(`
        INSERT INTO games (name, photo) VALUES (TRIM($1), TRIM($2))
    `, [name, photo]);

    foundGame = (await pool.query(`
        SELECT id FROM games WHERE LOWER(TRIM(name)) = LOWER(TRIM($1))
    `, [name])).rows[0];

    //checking genres and inserting them
    const foundGenres = async () => {

        //check if genre is an array 

        const genresIds = []
        console.log(genres);
        for (let genre of genres) {
            let genreId = (await pool.query(`SELECT id FROM genres WHERE name = $1`, [genre])).rows[0];
            console.log(genreId)
            genresIds .push(genreId.id);
        }
        return genresIds;

    };

    const genreIds = await foundGenres();

    for (let genreId of genreIds) {
        await pool.query(`INSERT INTO game_genres (game_id, genre_id) VALUES ($1, $2)`, [foundGame.id, genreId]);
    }

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

async function updateGame(name, genres, developers, id, photo) {
    const arrayDevelopers = developers.split(",").map((developer) => developer.trim());

    const game = (await pool.query(`
        SELECT games.id, games.name, ARRAY_AGG(DISTINCT genres.name)  AS genres, games.photo, ARRAY_AGG(DISTINCT developers.name) AS developer_names
        FROM games 
        LEFT JOIN game_genres ON game_genres.game_id = games.id
        LEFT JOIN genres ON genres.id = game_genres.genre_id
        LEFT JOIN game_developers ON games.id = game_developers.game_id 
        LEFT JOIN developers ON developers.id = game_developers.developer_id
        WHERE games.id = $1
        GROUP BY games.id, games.name, games.photo
    `, [id])).rows[0];
    
    //Set up name and photo
    if (name.trim() !== game.name.trim()) {
        await pool.query(`
            UPDATE games 
            SET name = $1
            WHERE id = $2
        `, [name, id]);
    }

    if (photo.trim() !== game.photo.trim()) {
        await pool.query(`
            UPDATE games
            SET photo = $1
            WHERE id = $2
        `, [photo, id]);
    }

    //Set up genres
    if (game.genres[0] !== null) {
        const dbGenres = game.genres.map((genre) => genre.trim());
        const inputGenres = genres.map((genre) => genre.trim());
        const genresDiff = dbGenres.length !== inputGenres || !inputGenres.every((genre) => dbGenres.includes(genre));

        if (genresDiff === true) {
            await pool.query(`DELETE FROM game_genres WHERE game_id = $1`, [id]);

            const genreIds =[];

            for (let genre of genres) {
                
                let foundGenre = (await pool.query(`
                    SELECT id FROM genres WHERE name = $1
                `, [genre])).rows[0];

                genreIds.push(foundGenre.id);
            }

            for (let genreId of genreIds) {
                await pool.query(`INSERT INTO game_genres (game_id, genre_id) VALUES ($1, $2)`, [game.id, genreId]);
            };
        }
        
    }

    //rework on this part
    


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

async function getAllGenres() {
    const { rows } = await pool.query('SELECT * FROM genres');
    return rows;
};

async function getGenre(genre) {
    const foundGenre = (await pool.query(`SELECT id FROM genres WHERE LOWER(TRIM(name)) = LOWER(TRIM($1))`, [genre])).rows[0];
    return foundGenre;
};

async function addGenre(genre) {
    await pool.query(`INSERT INTO genres (name) VALUES ($1)`, [genre]);
};

async function deleteGenre(genreId) {
    await pool.query(`DELETE FROM genres WHERE id = $1`, [genreId]);
};

module.exports = {
    getAllGames,
    getGame, 
    addGame,
    deleteGame,
    updateGame,
    getAllGenres,
    getGenre,
    addGenre,
    deleteGenre
};


