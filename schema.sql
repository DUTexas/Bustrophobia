DROP TABLE IF EXISTS posts;

CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    userID TEXT not NULL,
    speed REAL not NULL,
    locLong REAL not NULL,
    locLat Real not NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL
);
