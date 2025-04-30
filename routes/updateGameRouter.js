const { Router } = require("express");
const { updateGame } = require("../controllers/updateController");
const { getGame } = require("../controllers/updateController");

const updateGameRouter = Router();

updateGameRouter.post("/:idGame", updateGame);
updateGameRouter.get("/:idGame", getGame);

module.exports = updateGameRouter;



