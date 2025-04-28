const db = require("../db/queries");

async function getAllGames(req, res) {
    const games = await db.getAllGames();
    console.log("games: ", games);
    res.render("index", { title: "Inventory Application" , games: games });
};

async function getGame(req, res) {
    const game = await db.getGame(req.params.idGame);
    console.log("game: ", game);
    res.render("formGame", {game: game});
};

async function addGame(req, res) {
    const data = req.body;
    const genre = data.genre;
    const name = data.name;
    const developers = data.developers;
    await db.addGame(name, genre, developers);
    res.redirect("/");
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
    getGame,
    addGame,
    deleteGame
};