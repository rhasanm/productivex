#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use sqlx::sqlite::SqlitePool;
use tauri::State;

#[derive(Debug, Serialize, Deserialize)]
struct Task {
    id: Option<i64>,
    title: String,
    description: Option<String>,
    label: Option<String>,
    status: Option<String>,
    priority: Option<String>,
    due_date: Option<NaiveDateTime>,
    start_date: Option<NaiveDateTime>,
    created_at: Option<NaiveDateTime>,
    updated_at: Option<NaiveDateTime>,
}

#[derive(Debug, Serialize, Deserialize)]
struct TaskInput {
    id: Option<i64>,
    title: String,
    description: Option<String>,
    label: Option<String>,
    status: Option<String>,
    priority: Option<String>,
    due_date: Option<String>,
    start_date: Option<String>,
    created_at: Option<String>,
    updated_at: Option<String>,
}

async fn task_list(pool: &SqlitePool) -> Result<Vec<Task>, String> {
    let tasks = sqlx::query_as!(
        Task,
        r#"
        SELECT
            id,
            title,
            description,
            label,
            status,
            priority,
            start_date,
            due_date,
            created_at,
            updated_at
        FROM tasks
        ORDER BY id DESC;
        "#
    )
    .fetch_all(pool)
    .await
    .map_err(|e| format!("Error fetching tasks: {:?}", e))?;

    Ok(tasks)
}

#[tauri::command]
async fn get_tasks(pool: State<'_, SqlitePool>) -> Result<Vec<Task>, String> {
    task_list(pool.inner()).await
}

#[tauri::command]
async fn add_task(task: TaskInput, pool: State<'_, SqlitePool>) -> Result<Vec<Task>, String> {
    let parse_date = |date_str: Option<String>| -> Option<NaiveDateTime> {
        date_str.and_then(|s| NaiveDateTime::parse_from_str(&s, "%Y-%m-%dT%H:%M:%S").ok())
    };

    let task = Task {
        id: task.id,
        title: task.title,
        description: task.description,
        label: task.label,
        status: task.status,
        priority: task.priority,
        due_date: parse_date(task.due_date),
        start_date: parse_date(task.start_date),
        created_at: parse_date(task.created_at),
        updated_at: parse_date(task.updated_at),
    };

    let insert_result = sqlx::query!(
        "INSERT INTO tasks (title, description, label, status, priority, due_date, start_date, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        task.title,
        task.description,
        task.label,
        task.status,
        task.priority,
        task.due_date,
        task.start_date,
        task.created_at,
        task.updated_at,
    )
    .execute(pool.inner())
    .await;

    match insert_result {
        Ok(_) => {
            let tasks_result = sqlx::query_as!(
                Task,
                "SELECT id, title, description, label, status, priority, due_date, start_date, created_at, updated_at FROM tasks ORDER BY id DESC"
            )
            .fetch_all(pool.inner())
            .await;

            match tasks_result {
                Ok(tasks) => Ok(tasks),
                Err(err) => Err(format!("Failed to fetch tasks: {}", err)),
            }
        }
        Err(err) => Err(format!("Failed to insert task: {}", err)),
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let pool = SqlitePool::connect("sqlite:tasks.db").await.unwrap();

    tauri::Builder::default()
        .manage(pool)
        .invoke_handler(tauri::generate_handler![get_tasks, add_task])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
