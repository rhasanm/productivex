// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::Serialize;

#[derive(Debug, Serialize)]
struct Task {
    id: String,
    title: String,
    status: String,
    label: String,
    priority: String,
}

#[tauri::command]
fn get_tasks() -> Vec<Task> {
    let tasks = vec![
    Task {
        id: String::from("TASK-8782"),
        title: String::from("You can't compress the program without quantifying the open-source SSD pixel!"),
        status: String::from("in progress"),
        label: String::from("documentation"),
        priority: String::from("medium"),
    },
    Task {
        id: String::from("TASK-7878"),
        title: String::from("Try to calculate the EXE feed, maybe it will index the multi-byte pixel!"),
        status: String::from("backlog"),
        label: String::from("documentation"),
        priority: String::from("medium"),
    },
    Task {
        id: String::from("TASK-7839"),
        title: String::from("We need to bypass the neural TCP card!"),
        status: String::from("todo"),
        label: String::from("bug"),
        priority: String::from("high"),
    },
    Task {
        id: String::from("TASK-5562"),
        title: String::from("The SAS interface is down, bypass the open-source pixel so we can back up the PNG bandwidth!"),
        status: String::from("backlog"),
        label: String::from("feature"),
        priority: String::from("medium"),
    },
    Task {
        id: String::from("TASK-8686"),
        title: String::from("I'll parse the wireless SSL protocol, that should driver the API panel!"),
        status: String::from("canceled"),
        label: String::from("feature"),
        priority: String::from("medium"),
    },
    Task {
        id: String::from("TASK-1280"),
        title: String::from("Use the digital TLS panel, then you can transmit the haptic system!"),
        status: String::from("done"),
        label: String::from("bug"),
        priority: String::from("high"),
    },
    Task {
        id: String::from("TASK-7262"),
        title: String::from("The UTF8 application is down, parse the neural bandwidth so we can back up the PNG firewall!"),
        status: String::from("done"),
        label: String::from("feature"),
        priority: String::from("high"),
    },
    Task {
        id: String::from("TASK-1138"),
        title: String::from("Generating the driver won't do anything, we need to quantify the 1080p SMTP bandwidth!"),
        status: String::from("in progress"),
        label: String::from("feature"),
        priority: String::from("medium"),
    },
    Task {
        id: String::from("TASK-7184"),
        title: String::from("We need to program the back-end THX pixel!"),
        status: String::from("todo"),
        label: String::from("feature"),
        priority: String::from("low"),
    },
    Task {
        id: String::from("TASK-5160"),
        title: String::from("Calculating the bus won't do anything, we need to navigate the back-end JSON protocol!"),
        status: String::from("in progress"),
        label: String::from("documentation"),
        priority: String::from("high"),
    },
];
    tasks
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_tasks])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
