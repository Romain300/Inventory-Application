const db = require("../db/queries");
const { body, validationResult } = require("express-validator");
require('dotenv').config();

const validateUser = [
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password can not me empty")
        .custom((value) => {
            if(value !== process.env.PASSWORD) {
                throw new Error("Password is not correct");
            }
            return true;
        }),
];

const deleteGame = [
    validateUser, 
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const games = await db.getAllGames();
            return res.status(400).render(`index`, {
                games: games,
                title: "Inventory Application",
                errors: errors.array()
            });
        }
        const idGame = req.params.idGame;
        const game = await db.getGame(idGame);
        await db.deleteGame(idGame);
        console.log(`${game.name} has been deleted`)
        res.redirect("/");
    }
]

module.exports = {
    deleteGame,
}