const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

const validateUser = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name can not be empty")
        .isLength({max: 50})
        .withMessage("Name can't be more than 50 characteres"),
    body("genre")
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

// async function updateGame(req, res) {
//     const data = req.body;
//     const id = data.id;
//     const name = data.name;
//     const genre = data.genre;
//     const developers = data.developers;
//     await db.updateGame(name, genre, developers, id);
//     console.log(`${name} has been updated`);
//     res.redirect("/");
// };

const updateGame = [
    validateUser, 

    async (req, res) => {
        const errors = validationResult(req);
        const { id, name, genre, developers } = req.body;
        if (!errors.isEmpty()) {
            return res.status(400).render(`updateGame`, {
                game: {id, name, genre, developers}, 
                errors: errors.array()
            });
        }
        await db.updateGame(name, genre, developers, id);
        console.log(`${name} has been updated`);
        res.redirect("/");
    }
];

async function getGame(req, res) {
    const game = await db.getGame(req.params.idGame);
    console.log("game: ", game);
    res.render("updateGame", {game: game});
};

module.exports = {
    updateGame,
    getGame
}