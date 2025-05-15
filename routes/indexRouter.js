const { Router } = require("express");
const { getAllGames } =  require("../controllers/indexController");
 
const indexRouter = Router();
indexRouter.get("/", getAllGames);

module.exports = indexRouter;
