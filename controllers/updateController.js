const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

const validateUser = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name can not be empty")
        .isLength({max: 50})
        .withMessage("Name can't be more than 50 characteres"),
    body("genres")
        .trim()
        .notEmpty()
        .withMessage("Genre can not me empty")
        .isLength({max: 50})
        .withMessage("Name can't be more than 50 characteres"),
    body("developers")
        .trim()
        .notEmpty()
        .withMessage("Developers can not me empty"),
];


const updateGame = [
    validateUser, 

    async (req, res) => {
        const errors = validationResult(req);
        const { id, name, developers, photo, genres} = req.body;
        if (!errors.isEmpty()) {
            const genresDb = await db.getAllGenres();
            return res.status(400).render(`updateGame`, {
                game: {name, genres, developers, id, photo},
                genres: genresDb,
                errors: errors.array()
            });
        }
        await db.updateGame(name, genres, developers, id, photo);
        console.log(`${name} has been updated`);
        res.redirect("/");
    }
];

async function getGame(req, res) {
    const game = await db.getGame(req.params.idGame);
    const genres = await db.getAllGenres();
    console.log("game: ", game);
    res.render("updateGame", {game: game, genres: genres});
};

module.exports = {
    updateGame,
    getGame
}