const db = require("../db/queries");

async function updateGame(req, res) {
    const data = req.body;
    const id = data.id;
    const name = data.name;
    const genre = data.genre;
    const developers = data.developers;
    await db.updateGame(name, genre, developers, id);
    console.log(`${name} has been updated`);
    res.redirect("/");
};

module.exports = {
    updateGame
}