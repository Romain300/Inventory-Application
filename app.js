require('dotenv').config();
const express = require("express");
const path = require("node:path");
const indexRouter = require("./routes/indexRouter");
const updateGameRouter = require("./routes/updateGameRouter");
const newGameRouter = require("./routes/addGameRouter");
const genresRouter = require("./routes/genresRouter");
const deleteRouter = require("./routes/deleteRouter");

const app = express();
const PORT = process.env.PORT || 4000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.get("/favicon.ico", (req, res) => res.status(204)); 
app.use("/", indexRouter);
app.use("/updateGame", updateGameRouter);
app.use("/addGame", newGameRouter);
app.use("/genres", genresRouter);
app.use("/delete", deleteRouter);



app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});


