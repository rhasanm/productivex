CREATE TABLE tasks_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    label TEXT,
    status TEXT,
    priority TEXT,
    due_date DATETIME,
    start_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tasks_new (id, title, description, label, status, priority, due_date, start_date, created_at, updated_at)
SELECT id, title, description, label, status, priority, due_date, start_date, created_at, updated_at FROM tasks;

DROP TABLE tasks;

ALTER TABLE tasks_new RENAME TO tasks;
