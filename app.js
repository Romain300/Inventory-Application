require('dotenv').config();
const express = require("express");
const path = require("node:path");
const indexRouter = require("./routes/indexRouter");
const updateGameRouter = require("./routes/updateGameRouter");
const newGameRouter = require("./routes/addGameRouter");

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


app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});


//sanitize two more fields for the update form, connect add form to database 
// and add genres managements
