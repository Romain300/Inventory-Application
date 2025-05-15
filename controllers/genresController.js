const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

function generateRandomColor() {
    return "#" + Math.floor(Math.random() * 16777214).toString(16).padStart(6, '0'); //convert in Hexadecimal
};

function getContrastYIQ(hexcolor) {
    hexcolor = hexcolor.slice(1);
    const r = parseInt(hexcolor.substr(0,2),16);
    const g = parseInt(hexcolor.substr(2,2),16);
    const b = parseInt(hexcolor.substr(4,2),16);
    const yiq = (r*299 + g*587 + b*114) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
}

async function getAllGenres(req, res) {
    const genres = await db.getAllGenres();
    const genresWithColor = genres.map((genre) => {
        const bg= generateRandomColor();
        const textColor = getContrastYIQ(bg);
        return { ...genre, bg, textColor};
    });
    return res.render("updateGenres", { genres: genresWithColor});
};

const validateUser = [
    body("genre")
        .trim()
        .notEmpty()
        .withMessage("New genre can not be empty")
        .isLength({ max: 50 })
        .withMessage("New genre can not be longer than 50 characteres"),
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
]

const addNewGenre = [
    validateUser,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const genres = await db.getAllGenres();
            const genresWithColor = genres.map((genre) => {
                const bg= generateRandomColor();
                const textColor = getContrastYIQ(bg);
                return { ...genre, bg, textColor};
            });
            return res.status(400).render("updateGenres", { 
                genres: genresWithColor,
                errors: errors.array(),
            });
        }
        let newGenre = req.body.genre.trim().toLowerCase();
        let foundGenre = await db.getGenre(newGenre);
        if (foundGenre) return res.redirect("/");

        newGenre = newGenre[0].toUpperCase() + newGenre.substr(1);
        await db.addGenre(newGenre);
        return res.redirect("/");
    }
];


async function deleteGenre(req, res) {
    const idGenre = req.params.idGenre;
    await db.deleteGenre(idGenre);
    console.log(`Genre id:${idGenre} has been deleted`);
    return res.redirect("/");
};

async function getGamesByGenre(req, res) {
    const genreName = req.params.genreName;
    const games = await db.getGamesByGenre(genreName);
    return res.render("index", {title: genreName, games: games});
};

module.exports = {
    getAllGenres,
    addNewGenre,
    deleteGenre,
    getGamesByGenre
}