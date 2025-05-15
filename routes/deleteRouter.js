const { deleteGame } = require("../controllers/deleteController");
const { Router } = require("express");

const deleteRouter = Router();
deleteRouter.post("/:idGame", deleteGame);

module.exports = deleteRouter;