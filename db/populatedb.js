const { Client } = require("pg");
require('dotenv').config();

const SQL = `

DROP TABLE IF EXISTS game_developers;
DROP TABLE IF EXISTS developers;
DROP TABLE IF EXISTS games;

CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(50),
    genre VARCHAR(50),
    photo TEXT
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

INSERT INTO games (name, genre, photo) VALUES ('The last of US', 'Survival Horror', 'https://coverproject.sfo2.cdn.digitaloceanspaces.com/playstation_5/playstation_5.lastofuspart1the_US.17305240361098505460_thumb.jpg');
INSERT INTO developers (name) VALUES ('Naughty Dog');
INSERT INTO game_developers (game_id, developer_id) VALUES (1,1);

INSERT INTO games (name, genre, photo) VALUES ('God of War', 'Action-Adventure', 'https://coverproject.sfo2.cdn.digitaloceanspaces.com/playstation_5/playstation_5.godofwarragnarok_AU.1707386089956116315_thumb.jpg');
INSERT INTO developers (name) VALUES ('Santa Monica Studio');
INSERT INTO developers (name) VALUES ('Jetpack Interactive');
INSERT INTO game_developers (game_id, developer_id) VALUES (2,2);
INSERT INTO game_developers (game_id, developer_id) VALUES (2,3);

INSERT INTO games (name, genre, photo) VALUES ('Dark Souls Remastered', 'Action RPG', 'https://coverproject.sfo2.cdn.digitaloceanspaces.com/playstation_4/playstation_4.darksoulsremastered_US.16502176232090701406_thumb.jpg');
INSERT INTO developers (name) VALUES ('FromSoftware');
INSERT INTO game_developers (game_id, developer_id) VALUES (3,4);

INSERT INTO games (name, genre, photo) VALUES ('Marvel''s Spider-Man', 'Action-Adventure', 'https://coverproject.sfo2.cdn.digitaloceanspaces.com/playstation_4/playstation_4.marvelsspiderman_AU.1627291932104575573_thumb.jpg');
INSERT INTO developers (name) VALUES ('Insomniac Games');
INSERT INTO game_developers (game_id, developer_id) VALUES (4,5);

INSERT INTO games (name, genre, photo) VALUES ('Horizon Zero Dawn', 'Action RPG', 'https://coverproject.sfo2.cdn.digitaloceanspaces.com/playstation_4/playstation_4.horizonzerodawn_AU.162719920657294644_thumb.jpg');
INSERT INTO developers (name) VALUES ('Guerrilla Games');
INSERT INTO game_developers (game_id, developer_id) VALUES (5,6);

INSERT INTO games (name, genre, photo) VALUES ('Ghost of Tsushima', 'Action-Adventure', 'https://coverproject.sfo2.cdn.digitaloceanspaces.com/playstation_5/playstation_5.ghostoftsushimadirectorscut_US.1650220443512601815_thumb.jpg');
INSERT INTO developers (name) VALUES ('Sucker Punch Productions');
INSERT INTO game_developers (game_id, developer_id) VALUES (6,7);

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
