#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use dotenv::dotenv;
use sqlx::migrate::Migrator;
use sqlx::sqlite::{SqliteConnectOptions, SqlitePool};
use std::collections::HashMap;
use std::env;
use std::str::FromStr;

use chrono::{DateTime, Local, NaiveDateTime, Utc};
use serde::{Deserialize, Serialize};
use tauri::State;

use sqlx::{ConnectOptions, Connection, SqliteConnection};

static MIGRATOR: Migrator = sqlx::migrate!("./migrations");

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
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
    progress: Option<i32>,
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
    progress: Option<i32>,
}

#[derive(Deserialize)]
struct UpdateTaskStatusPayload {
    task_id: i64,
    new_status: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct TaskUpdateInput {
    id: i64,
    title: Option<String>,
    description: Option<String>,
    label: Option<String>,
    status: Option<String>,
    priority: Option<String>,
    due_date: Option<String>,
    start_date: Option<String>,
    created_at: Option<String>,
    updated_at: Option<String>,
    progress: Option<i32>,
}

#[tauri::command]
async fn update_task(
    payload: TaskUpdateInput,
    pool: State<'_, SqlitePool>,
) -> Result<String, String> {
    let mut updates: HashMap<&str, &String> = HashMap::new();

    if let Some(title) = &payload.title {
        updates.insert("title", title);
    }
    if let Some(description) = &payload.description {
        updates.insert("description", description);
    }
    if let Some(label) = &payload.label {
        updates.insert("label", label);
    }
    if let Some(status) = &payload.status {
        updates.insert("status", status);
    }
    if let Some(priority) = &payload.priority {
        updates.insert("priority", priority);
    }
    if let Some(due_date) = &payload.due_date {
        updates.insert("due_date", due_date);
    }
    if let Some(start_date) = &payload.start_date {
        updates.insert("start_date", start_date);
    }

    let updated_at: String = DateTime::<Local>::from(Utc::now()).to_rfc3339();
    updates.insert("updated_at", &updated_at);

    let progress_string = match payload.progress {
        Some(p) => p.to_string(),
        None => String::new(),
    };
    if progress_string != String::new() {
        updates.insert("progress", &progress_string);
    }

    let mut query = String::from("UPDATE tasks SET ");
    let mut first = true;

    for (field, value) in &updates {
        if !first {
            query.push_str(", ");
        }

        if value.as_str() == "null" {
            query.push_str(&format!("{} = NULL", field));
        } else {
            query.push_str(&format!("{} = '{}'", field, value));
            // query.push_str(&format!("{} = '{}'", field, value.replace('\'', "''")));
        }
        first = false;
    }

    query.push_str(&format!(" WHERE id = {}", payload.id));

    match sqlx::query(&query).execute(pool.inner()).await {
        Ok(_) => Ok("Task updated successfully".to_string()),
        Err(e) => Err(format!("Failed to update task: {}", e)),
    }
}

#[tauri::command]
async fn update_task_status(
    payload: UpdateTaskStatusPayload,
    pool: State<'_, SqlitePool>,
) -> Result<String, String> {
    let UpdateTaskStatusPayload {
        task_id,
        new_status,
    } = payload;

    match sqlx::query("UPDATE tasks SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
        .bind(new_status)
        .bind(task_id)
        .execute(pool.inner())
        .await
    {
        Ok(_) => Ok("Task updated successfull".to_string()),
        Err(err) => Err(format!("Failed to update task status: {}", err)),
    }
}

async fn task_list(pool: &SqlitePool) -> Result<Vec<Task>, String> {
    let tasks = sqlx::query_as::<_, Task>(
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
            updated_at,
            progress
        FROM tasks
        ORDER BY id DESC;
        "#,
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
        date_str.and_then(|s| {
            DateTime::parse_from_rfc3339(&s)
                .ok()
                .map(|dt| dt.naive_utc())
        })
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
        updated_at: None,
        progress: task.progress,
    };

    let insert_result = sqlx::query(
        "INSERT INTO tasks (title, description, label, status, priority, due_date, start_date, created_at, progress) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    )
    .bind(task.title)
    .bind(task.description)
    .bind(task.label)
    .bind(task.status)
    .bind(task.priority)
    .bind(task.due_date)
    .bind(task.start_date)
    .bind(task.created_at)
    .bind(task.progress)
    .execute(pool.inner())
    .await;

    match insert_result {
        Ok(_) => {
            let tasks_result = sqlx::query_as::<_, Task>(
                "SELECT id, title, description, label, status, priority, due_date, start_date, created_at, updated_at, progress FROM tasks ORDER BY id DESC"
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
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").unwrap_or_else(|_| "sqlite:tasks.db".to_string());

    let conn = SqliteConnectOptions::from_str(&database_url)?
        .create_if_missing(true)
        .connect()
        .await?;

    SqliteConnection::close(conn).await?;

    let pool = SqlitePool::connect(&database_url).await.unwrap();

    MIGRATOR.run(&pool).await.expect("Failed to run migrations");

    tauri::Builder::default()
        .manage(pool)
        .invoke_handler(tauri::generate_handler![
            get_tasks,
            add_task,
            update_task_status,
            update_task
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
