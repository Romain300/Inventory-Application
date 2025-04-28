const { Client } = require("pg");
require('dotenv').config();

const SQL = `

DROP TABLE IF EXISTS game_developers;
DROP TABLE IF EXISTS developers;
DROP TABLE IF EXISTS games;

CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(50),
    genre VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS developers (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS game_developers (
    game_id INT,
    developer_id INT,
    FOREIGN key (game_id) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (developer_id) REFERENCES developers(id) ON DELETE CASCADE,
    PRIMARY key (game_id, developer_id)
);

INSERT INTO games (name, genre) VALUES ('The last of US', 'Survival Horror');
INSERT INTO developers (name) VALUES ('Naughty Dog');
INSERT INTO game_developers (game_id, developer_id) VALUES (1,1);

INSERT INTO games (name, genre) VALUES ('God of War', 'Action-Adventure');
INSERT INTO developers (name) VALUES ('Santa Monica Studio');
INSERT INTO developers (name) VALUES ('Jetpack Interactive');
INSERT INTO game_developers (game_id, developer_id) VALUES (2,2);
INSERT INTO game_developers (game_id, developer_id) VALUES (2,3);

`;

async function main() {
    console.log("seeding...");
    const client = new Client({
        connectionString: process.env.URL_DATABASE,
    });
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log("done");
};

main();
