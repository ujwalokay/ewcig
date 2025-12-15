#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod lib;

use lib::{scan_installed_games, get_all_games, launch_game, add_custom_game};

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            scan_installed_games,
            get_all_games,
            launch_game,
            add_custom_game
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
