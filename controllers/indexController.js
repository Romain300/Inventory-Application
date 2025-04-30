const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

async function getAllGames(req, res) {
    const games = await db.getAllGames();
    console.log("games: ", games);
    res.render("index", { title: "Inventory Application" , games: games });
};

// async function addGame(req, res) {
//     const data = req.body;
//     const genre = data.genre;
//     const name = data.name;
//     const developers = data.developers;
//     await db.addGame(name, genre, developers);
//     res.redirect("/");
// };

async function deleteGame(req, res) {
    const idGame = req.params.idGame;
    const game = await db.getGame(idGame);
    await db.deleteGame(idGame);
    console.log(`${game.name} has been deleted`)
    res.redirect("/");
};

const validateUser = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name can not be empty")
        .isLength({max: 50})
        .withMessage("Name can to be longer than 50 characteres"),
    body("genre")
        .trim()
        .notEmpty()
        .withMessage("Genre can not be empty")
        .isLength({max: 50})
        .withMessage("genre can to be longer than 50 characteres"),
    body("developers")
        .trim()
        .notEmpty()
        .withMessage("Developers can not be empty")
];

const addGame = [
    validateUser,
    
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const games = await db.getAllGames();
            return res.status(400).render("index", { title: "Inventory Application" , games: games, errors: errors.array() });
        }
        const { genre, name, developers } = req.body;
        await db.addGame(name, genre, developers);
        res.redirect("/");
    }
];

module.exports = {
    getAllGames,
    addGame,
    deleteGame
};