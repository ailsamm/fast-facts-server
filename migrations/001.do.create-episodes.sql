DROP TABLE IF EXISTS episodes;

CREATE TABLE episodes(
    episode_id TEXT NOT NULL,
    episode_name TEXT NOT NULL,
    date_created TEXT NOT NULL,
    episode_questions TEXT[][]
); 