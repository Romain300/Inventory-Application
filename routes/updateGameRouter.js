const { Router } = require("express");
const { updateGame } = require("../controllers/updateController");

const updateGameRouter = Router();

updateGameRouter.post("/", updateGame);

module.exports = updateGameRouter;



