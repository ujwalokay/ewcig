#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::process::Command;
use tauri::Manager;

#[derive(Debug, Serialize, Deserialize)]
struct SessionStatus {
    active: bool,
    time_remaining: i32,
    balance: f64,
    username: String,
    member_tier: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct TerminalConfig {
    terminal_id: String,
    server_url: String,
    terminal_name: String,
}

#[tauri::command]
fn get_terminal_config() -> TerminalConfig {
    TerminalConfig {
        terminal_id: std::env::var("TERMINAL_ID").unwrap_or_else(|_| "PC-01".to_string()),
        server_url: std::env::var("SERVER_URL").unwrap_or_else(|_| "http://192.168.1.100:5000".to_string()),
        terminal_name: std::env::var("TERMINAL_NAME").unwrap_or_else(|_| "Gaming PC 1".to_string()),
    }
}

#[tauri::command]
fn launch_game(game_path: String) -> Result<String, String> {
    match Command::new(&game_path).spawn() {
        Ok(_) => Ok(format!("Launched: {}", game_path)),
        Err(e) => Err(format!("Failed to launch game: {}", e)),
    }
}

#[tauri::command]
fn lock_workstation() -> Result<String, String> {
    #[cfg(target_os = "windows")]
    {
        match Command::new("rundll32.exe")
            .args(["user32.dll,LockWorkStation"])
            .spawn()
        {
            Ok(_) => Ok("Workstation locked".to_string()),
            Err(e) => Err(format!("Failed to lock: {}", e)),
        }
    }
    #[cfg(not(target_os = "windows"))]
    {
        Err("Lock only supported on Windows".to_string())
    }
}

#[tauri::command]
fn disable_task_manager(disable: bool) -> Result<String, String> {
    #[cfg(target_os = "windows")]
    {
        let value = if disable { "1" } else { "0" };
        match Command::new("reg")
            .args([
                "add",
                "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\System",
                "/v",
                "DisableTaskMgr",
                "/t",
                "REG_DWORD",
                "/d",
                value,
                "/f",
            ])
            .output()
        {
            Ok(_) => Ok(format!("Task Manager disabled: {}", disable)),
            Err(e) => Err(format!("Failed: {}", e)),
        }
    }
    #[cfg(not(target_os = "windows"))]
    {
        Err("Only supported on Windows".to_string())
    }
}

#[tauri::command]
fn get_system_info() -> serde_json::Value {
    serde_json::json!({
        "os": std::env::consts::OS,
        "arch": std::env::consts::ARCH,
        "hostname": hostname::get().map(|h| h.to_string_lossy().to_string()).unwrap_or_default()
    })
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            get_terminal_config,
            launch_game,
            lock_workstation,
            disable_task_manager,
            get_system_info
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
