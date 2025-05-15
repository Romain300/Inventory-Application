const db = require("../db/queries");

async function getAllGames(req, res) {
    const games = await db.getAllGames();
    console.log("games: ", games);
    res.render("index", { title: "Inventory Application" , games: games });
};

module.exports = {
    getAllGames,
};