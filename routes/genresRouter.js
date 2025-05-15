const { Router } = require("express");
const { getAllGenres } = require("../controllers/genresController");
const { addNewGenre} = require("../controllers/genresController");
const { deleteGenre } = require("../controllers/genresController");
const { getGamesByGenre } = require("../controllers/genresController");

const genresRouter = Router();
genresRouter.get("/", getAllGenres);
genresRouter.post("/", addNewGenre);
genresRouter.post("/delete-genre/:idGenre", deleteGenre);
genresRouter.get("/:genreName", getGamesByGenre);

module.exports = genresRouter;


