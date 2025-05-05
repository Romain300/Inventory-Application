const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

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
        .withMessage("Developers can not be empty"),
    body("photo")
        .trim()
        .notEmpty()
        .withMessage("URL Picture can not be empty"),
];

const addGame = [
    validateUser,
    
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const games = await db.getAllGames();
            return res.status(400).render("addGame", { errors: errors.array() });
        }
        const { genre, name, developers, photo } = req.body;
        await db.addGame(name, genre, developers, photo);
        res.redirect("/");
    }
];

async function getAddForm(req, res) {
    const genres = await db.getAllGenres();
    console.log(genres);
    res.render("addGame", { genres: genres });
};

module.exports = {
    addGame,
    getAddForm
};