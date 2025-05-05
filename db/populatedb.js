const { Client } = require("pg");
require('dotenv').config();

const SQL = `

DROP TABLE IF EXISTS game_genres;
DROP TABLE IF EXISTS game_developers;
DROP TABLE IF EXISTS developers;
DROP TABLE IF EXISTS games;
DROP TABLE IF EXISTS genres;


CREATE TABLE IF NOT EXISTS genres (
id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(50),
    photo TEXT
);

CREATE TABLE IF NOT EXISTS developers (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS game_genres (
    game_id INT,
    genre_id INT,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY key (game_id, genre_id)
);

CREATE TABLE IF NOT EXISTS game_developers (
    game_id INT,
    developer_id INT,
    FOREIGN key (game_id) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (developer_id) REFERENCES developers(id) ON DELETE CASCADE,
    PRIMARY key (game_id, developer_id)
);

INSERT INTO genres(name) VALUES
    ('Action'),
    ('Adventure'),
    ('RPG'),
    ('Simulation'),
    ('Strategy'),
    ('Sports'),
    ('Puzzle'),
    ('Racing'),
    ('Fighting'),
    ('Platformer'),
    ('Shooter')
;


INSERT INTO games (name, photo) VALUES ('The last of US', 'https://coverproject.sfo2.cdn.digitaloceanspaces.com/playstation_5/playstation_5.lastofuspart1the_US.17305240361098505460_thumb.jpg');
INSERT INTO developers (name) VALUES ('Naughty Dog');
INSERT INTO game_developers (game_id, developer_id) VALUES (1,1);
INSERT INTO game_genres (game_id, genre_id) VALUES (1, 2);
INSERT INTO game_genres (game_id, genre_id) VALUES (1, 1);

INSERT INTO games (name, photo) VALUES ('God of War', 'https://coverproject.sfo2.cdn.digitaloceanspaces.com/playstation_5/playstation_5.godofwarragnarok_AU.1707386089956116315_thumb.jpg');
INSERT INTO developers (name) VALUES ('Santa Monica Studio');
INSERT INTO developers (name) VALUES ('Jetpack Interactive');
INSERT INTO game_developers (game_id, developer_id) VALUES (2,2);
INSERT INTO game_developers (game_id, developer_id) VALUES (2,3);
INSERT INTO game_genres (game_id, genre_id) VALUES (2, 2);

INSERT INTO games (name, photo) VALUES ('Dark Souls Remastered', 'https://coverproject.sfo2.cdn.digitaloceanspaces.com/playstation_4/playstation_4.darksoulsremastered_US.16502176232090701406_thumb.jpg');
INSERT INTO developers (name) VALUES ('FromSoftware');
INSERT INTO game_developers (game_id, developer_id) VALUES (3,4);
INSERT INTO game_genres (game_id, genre_id) VALUES (3, 3);

INSERT INTO games (name, photo) VALUES ('Marvel s Spider-Man', 'https://coverproject.sfo2.cdn.digitaloceanspaces.com/playstation_4/playstation_4.marvelsspiderman_AU.1627291932104575573_thumb.jpg');
INSERT INTO developers (name) VALUES ('Insomniac Games');
INSERT INTO game_developers (game_id, developer_id) VALUES (4,5);
INSERT INTO game_genres (game_id, genre_id) VALUES (4, 1);
INSERT INTO game_genres (game_id, genre_id) VALUES (4, 2);

INSERT INTO games (name, photo) VALUES ('Horizon Zero Dawn', 'https://coverproject.sfo2.cdn.digitaloceanspaces.com/playstation_4/playstation_4.horizonzerodawn_AU.162719920657294644_thumb.jpg');
INSERT INTO developers (name) VALUES ('Guerrilla Games');
INSERT INTO game_developers (game_id, developer_id) VALUES (5,6);
INSERT INTO game_genres (game_id, genre_id) VALUES (5, 2);
INSERT INTO game_genres (game_id, genre_id) VALUES (5, 1);

INSERT INTO games (name, photo) VALUES ('Ghost of Tsushima', 'https://coverproject.sfo2.cdn.digitaloceanspaces.com/playstation_5/playstation_5.ghostoftsushimadirectorscut_US.1650220443512601815_thumb.jpg');
INSERT INTO developers (name) VALUES ('Sucker Punch Productions');
INSERT INTO game_developers (game_id, developer_id) VALUES (6,7);
INSERT INTO game_genres (game_id, genre_id) VALUES (6, 3);

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


