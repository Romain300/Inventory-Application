const Router = require("express");
const { getAllGames } =  require("../controllers/indexController");
const { addGame } = require("../controllers/indexController");
const { deleteGame } = require("../controllers/indexController");
 
const indexRouter = Router();
indexRouter.get("/", getAllGames);
indexRouter.post("/", addGame);
indexRouter.post("/delete-game/:idGame", deleteGame);

module.exports = indexRouter;
