const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

const validateUser = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name can not be empty")
        .isLength({ max: 50 })
        .withMessage("Name can to be longer than 50 characteres"),
    body("genres")
        .trim()
        .notEmpty()
        .withMessage("Genre can not me empty")
        .isLength({max: 50})
        .withMessage("Name can't be more than 50 characteres"),
    body("developers")
        .trim()
        .notEmpty()
        .withMessage("Developers can not be empty"),
    body("photo")
        .trim()
        .notEmpty()
        .withMessage("URL Picture can not be empty"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password can not me empty")
        .custom((value) => {
            if (value !== process.env.PASSWORD) {
                throw new Error("Password is not correct")
            }
            return true;
        }),
];

const addGame = [
    validateUser,
    
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const genres = await db.getAllGenres();
            return res.status(400).render("addGame", { errors: errors.array(), genres: genres });
        }
        let { genres, name, developers, photo } = req.body;
        if (!Array.isArray(genres)) genres = [genres];
        await db.addGame(name, genres, developers, photo);
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

