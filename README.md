# Inventory-Application

A simple web app to manage a collection of video games, including their genres, developers, and associated details. Built with Node.js, Express, PostgreSQL, and EJS templating.

---

## Features

- View all games with their genres, developers, and cover photos
- Add new games with multiple genres and developers
- Update existing games (name, photo, genres, developers)
- Delete games from the collection
- Manage genres independently (add, list, delete)
- View games filtered by genre

---

## Technologies Used

- Node.js  
- Express.js  
- PostgreSQL (with `pg` module for database queries)  
- EJS templating engine for views  
- dotenv for environment variable management  

---

## Usage

- **Home page:** Lists all games with their genres, developers, and cover photos.

- **Add Game:** Fill out the form to add a new game with its name, genres (as an array), developers (comma-separated), and a photo URL.

- **Update Game:** Edit a game's details, including its name, photo, genres, and developers.

- **Delete Game:** Remove a game by its ID.

- **Genres:** View all genres, add new genres, delete genres, and see games filtered by genre.

---

## API Routes Overview

| Route                        | Method | Description                |
|------------------------------|--------|----------------------------|
| `/`                          | GET    | List all games             |
| `/addGame`                   | GET    | Show form to add a new game|
| `/addGame`                   | POST   | Add a new game             |
| `/updateGame/:idGame`        | GET    | Show form to update a game |
| `/updateGame/:idGame`        | POST   | Update game details        |
| `/delete/:idGame`            | POST   | Delete a game              |
| `/genres`                   | GET    | List all genres            |
| `/genres`                   | POST   | Add a new genre            |
| `/genres/delete-genre/:idGenre` | POST | Delete a genre             |
| `/genres/:genreName`         | GET    | List games by genre        |

---

## Notes

- Game genres and developers are managed through relational tables to support many-to-many relationships.

- Input sanitization and trimming are applied when inserting or updating game data.

- Developers can be entered as a comma-separated list when adding or updating games.

- The app serves static assets (like CSS or images) from the `public` folder.