const db = require("../db/queries");

async function getAllGames(req, res) {
    const games = await db.getAllGames();
    console.log("games: ", games);
    res.render("index", { title: "Inventory Application" , games: games });
};

async function deleteGame(req, res) {
    const idGame = req.params.idGame;
    const game = await db.getGame(idGame);
    await db.deleteGame(idGame);
    console.log(`${game.name} has been deleted`)
    res.redirect("/");
};

module.exports = {
    getAllGames,
    deleteGame
};