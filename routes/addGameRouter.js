const { Router } = require("express");
const { addGame } = require("../controllers/addController");
const { getAddForm } = require("../controllers/addController");


const newGameRouter = Router();
newGameRouter.get("/", getAddForm);
newGameRouter.post("/", addGame);

module.exports = newGameRouter;