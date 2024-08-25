// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use chrono::NaiveDateTime;
use serde::Serialize;
use sqlx::sqlite::SqlitePool;
use tauri::State;

#[derive(Debug, Serialize)]
struct Task {
    id: i64,
    title: String,
    description: Option<String>,
    label: Option<String>,
    status: Option<String>,
    priority: Option<String>,
    created_at: Option<NaiveDateTime>,
    updated_at: Option<NaiveDateTime>,
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
            created_at,
            updated_at
        FROM tasks;
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

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let pool = SqlitePool::connect("sqlite:tasks.db").await.unwrap();

    tauri::Builder::default()
        .manage(pool)
        .invoke_handler(tauri::generate_handler![get_tasks])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
