const { Router } = require("express");
const { getAllGenres } = require("../controllers/genresController");
const { addNewGenre} = require("../controllers/genresController");
const { deleteGenre } = require("../controllers/genresController");

const genresRouter = Router();
genresRouter.get("/", getAllGenres);
genresRouter.post("/", addNewGenre);
genresRouter.post("/delete-genre/:idGenre", deleteGenre);

module.exports = genresRouter;


