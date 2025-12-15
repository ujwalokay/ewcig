use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;
use std::process::Command;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GameInfo {
    pub id: String,
    pub name: String,
    pub category: String,
    pub executable_path: Option<String>,
    pub install_path: Option<String>,
    pub is_installed: bool,
    pub platform: String,
    pub image_url: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct GameDatabase {
    pub games: HashMap<String, GameInfo>,
}

fn get_known_games() -> Vec<GameInfo> {
    vec![
        GameInfo {
            id: "valorant".to_string(),
            name: "Valorant".to_string(),
            category: "FPS".to_string(),
            executable_path: None,
            install_path: None,
            is_installed: false,
            platform: "riot".to_string(),
            image_url: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/4fd6a11df4eb2c7c8e368e88b78e97ebb00f4688-1920x1080.jpg".to_string(),
        },
        GameInfo {
            id: "league-of-legends".to_string(),
            name: "League of Legends".to_string(),
            category: "MOBA".to_string(),
            executable_path: None,
            install_path: None,
            is_installed: false,
            platform: "riot".to_string(),
            image_url: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/4c44f7838e9c3a6ae8f02fc2f1e5a0ce66e2cf20-1920x1080.jpg".to_string(),
        },
        GameInfo {
            id: "cs2".to_string(),
            name: "Counter-Strike 2".to_string(),
            category: "FPS".to_string(),
            executable_path: None,
            install_path: None,
            is_installed: false,
            platform: "steam".to_string(),
            image_url: "https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg".to_string(),
        },
        GameInfo {
            id: "apex-legends".to_string(),
            name: "Apex Legends".to_string(),
            category: "Battle Royale".to_string(),
            executable_path: None,
            install_path: None,
            is_installed: false,
            platform: "steam".to_string(),
            image_url: "https://cdn.akamai.steamstatic.com/steam/apps/1172470/header.jpg".to_string(),
        },
        GameInfo {
            id: "dota2".to_string(),
            name: "Dota 2".to_string(),
            category: "MOBA".to_string(),
            executable_path: None,
            install_path: None,
            is_installed: false,
            platform: "steam".to_string(),
            image_url: "https://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg".to_string(),
        },
        GameInfo {
            id: "fortnite".to_string(),
            name: "Fortnite".to_string(),
            category: "Battle Royale".to_string(),
            executable_path: None,
            install_path: None,
            is_installed: false,
            platform: "epic".to_string(),
            image_url: "https://cdn2.unrealengine.com/en-eg-desktop-background-1923x1080-1923x1080-828a5d1ebb0f.jpg".to_string(),
        },
        GameInfo {
            id: "minecraft".to_string(),
            name: "Minecraft".to_string(),
            category: "Sandbox".to_string(),
            executable_path: None,
            install_path: None,
            is_installed: false,
            platform: "microsoft".to_string(),
            image_url: "https://cdn.akamai.steamstatic.com/steam/apps/1672970/header.jpg".to_string(),
        },
        GameInfo {
            id: "rocket-league".to_string(),
            name: "Rocket League".to_string(),
            category: "Sports".to_string(),
            executable_path: None,
            install_path: None,
            is_installed: false,
            platform: "epic".to_string(),
            image_url: "https://cdn.akamai.steamstatic.com/steam/apps/252950/header.jpg".to_string(),
        },
        GameInfo {
            id: "gta5".to_string(),
            name: "GTA V".to_string(),
            category: "Action".to_string(),
            executable_path: None,
            install_path: None,
            is_installed: false,
            platform: "steam".to_string(),
            image_url: "https://cdn.akamai.steamstatic.com/steam/apps/271590/header.jpg".to_string(),
        },
        GameInfo {
            id: "pubg".to_string(),
            name: "PUBG".to_string(),
            category: "Battle Royale".to_string(),
            executable_path: None,
            install_path: None,
            is_installed: false,
            platform: "steam".to_string(),
            image_url: "https://cdn.akamai.steamstatic.com/steam/apps/578080/header.jpg".to_string(),
        },
        GameInfo {
            id: "overwatch2".to_string(),
            name: "Overwatch 2".to_string(),
            category: "FPS".to_string(),
            executable_path: None,
            install_path: None,
            is_installed: false,
            platform: "blizzard".to_string(),
            image_url: "https://blz-contentstack-images.akamaized.net/v3/assets/blt2477dcaf4ebd440c/blt7f4c77fd14dff1c7/646e51bc2d39af49a3c2e0a4/ow2-homepage-hero-bg.webp".to_string(),
        },
        GameInfo {
            id: "fifa24".to_string(),
            name: "FIFA 24".to_string(),
            category: "Sports".to_string(),
            executable_path: None,
            install_path: None,
            is_installed: false,
            platform: "ea".to_string(),
            image_url: "https://cdn.akamai.steamstatic.com/steam/apps/2195250/header.jpg".to_string(),
        },
    ]
}

#[cfg(target_os = "windows")]
fn scan_steam_games() -> Vec<(String, String)> {
    let mut found_games = Vec::new();
    
    let steam_paths = vec![
        r"C:\Program Files (x86)\Steam\steamapps\common",
        r"C:\Program Files\Steam\steamapps\common",
        r"D:\Steam\steamapps\common",
        r"D:\SteamLibrary\steamapps\common",
        r"E:\Steam\steamapps\common",
        r"E:\SteamLibrary\steamapps\common",
    ];

    let game_exe_map: HashMap<&str, &str> = [
        ("Counter-Strike Global Offensive", "cs2.exe"),
        ("Counter-Strike 2", "cs2.exe"),
        ("Apex Legends", "r5apex.exe"),
        ("dota 2 beta", "dota2.exe"),
        ("PUBG", "TslGame.exe"),
        ("Grand Theft Auto V", "GTA5.exe"),
    ].iter().cloned().collect();

    for steam_path in steam_paths {
        let path = PathBuf::from(steam_path);
        if path.exists() {
            if let Ok(entries) = fs::read_dir(&path) {
                for entry in entries.flatten() {
                    let game_folder = entry.path();
                    let folder_name = game_folder.file_name()
                        .and_then(|n| n.to_str())
                        .unwrap_or("");
                    
                    if let Some(exe_name) = game_exe_map.get(folder_name) {
                        let exe_path = game_folder.join(exe_name);
                        if exe_path.exists() {
                            found_games.push((folder_name.to_string(), exe_path.to_string_lossy().to_string()));
                        }
                    }
                }
            }
        }
    }
    
    found_games
}

#[cfg(target_os = "windows")]
fn scan_riot_games() -> Vec<(String, String)> {
    let mut found_games = Vec::new();
    
    let riot_paths = vec![
        r"C:\Riot Games",
        r"D:\Riot Games",
    ];

    for riot_path in riot_paths {
        let path = PathBuf::from(riot_path);
        
        let valorant_exe = path.join("VALORANT").join("live").join("VALORANT.exe");
        if valorant_exe.exists() {
            found_games.push(("Valorant".to_string(), valorant_exe.to_string_lossy().to_string()));
        }
        
        let lol_exe = path.join("League of Legends").join("LeagueClient.exe");
        if lol_exe.exists() {
            found_games.push(("League of Legends".to_string(), lol_exe.to_string_lossy().to_string()));
        }
    }
    
    found_games
}

#[cfg(target_os = "windows")]
fn scan_epic_games() -> Vec<(String, String)> {
    let mut found_games = Vec::new();
    
    let epic_paths = vec![
        r"C:\Program Files\Epic Games",
        r"D:\Epic Games",
    ];

    for epic_path in epic_paths {
        let path = PathBuf::from(epic_path);
        
        let fortnite_exe = path.join("Fortnite").join("FortniteGame").join("Binaries").join("Win64").join("FortniteClient-Win64-Shipping.exe");
        if fortnite_exe.exists() {
            found_games.push(("Fortnite".to_string(), fortnite_exe.to_string_lossy().to_string()));
        }
        
        let rocket_league = path.join("rocketleague").join("Binaries").join("Win64").join("RocketLeague.exe");
        if rocket_league.exists() {
            found_games.push(("Rocket League".to_string(), rocket_league.to_string_lossy().to_string()));
        }
    }
    
    found_games
}

#[cfg(target_os = "windows")]
fn scan_blizzard_games() -> Vec<(String, String)> {
    let mut found_games = Vec::new();
    
    let blizzard_paths = vec![
        r"C:\Program Files (x86)\Overwatch",
        r"D:\Overwatch",
    ];

    for blizzard_path in blizzard_paths {
        let path = PathBuf::from(blizzard_path);
        let ow_exe = path.join("_retail_").join("Overwatch.exe");
        if ow_exe.exists() {
            found_games.push(("Overwatch 2".to_string(), ow_exe.to_string_lossy().to_string()));
        }
    }
    
    found_games
}

#[cfg(not(target_os = "windows"))]
fn scan_steam_games() -> Vec<(String, String)> {
    Vec::new()
}

#[cfg(not(target_os = "windows"))]
fn scan_riot_games() -> Vec<(String, String)> {
    Vec::new()
}

#[cfg(not(target_os = "windows"))]
fn scan_epic_games() -> Vec<(String, String)> {
    Vec::new()
}

#[cfg(not(target_os = "windows"))]
fn scan_blizzard_games() -> Vec<(String, String)> {
    Vec::new()
}

#[tauri::command]
pub fn scan_installed_games() -> Vec<GameInfo> {
    let mut games = get_known_games();
    
    let mut found_exes: HashMap<String, String> = HashMap::new();
    
    for (name, exe_path) in scan_steam_games() {
        found_exes.insert(name.to_lowercase(), exe_path);
    }
    
    for (name, exe_path) in scan_riot_games() {
        found_exes.insert(name.to_lowercase(), exe_path);
    }
    
    for (name, exe_path) in scan_epic_games() {
        found_exes.insert(name.to_lowercase(), exe_path);
    }
    
    for (name, exe_path) in scan_blizzard_games() {
        found_exes.insert(name.to_lowercase(), exe_path);
    }
    
    for game in &mut games {
        let search_name = game.name.to_lowercase();
        if let Some(exe_path) = found_exes.get(&search_name) {
            game.is_installed = true;
            game.executable_path = Some(exe_path.clone());
            if let Some(parent) = PathBuf::from(exe_path).parent() {
                game.install_path = Some(parent.to_string_lossy().to_string());
            }
        }
    }
    
    games
}

#[tauri::command]
pub fn get_all_games() -> Vec<GameInfo> {
    get_known_games()
}

#[tauri::command]
pub fn launch_game(game_id: String, executable_path: Option<String>) -> Result<String, String> {
    let exe_path = match executable_path {
        Some(path) => path,
        None => return Err("No executable path provided".to_string()),
    };
    
    let path = PathBuf::from(&exe_path);
    if !path.exists() {
        return Err(format!("Game executable not found: {}", exe_path));
    }
    
    #[cfg(target_os = "windows")]
    {
        let working_dir = path.parent().unwrap_or(&path);
        
        match Command::new(&exe_path)
            .current_dir(working_dir)
            .spawn()
        {
            Ok(_) => Ok(format!("Successfully launched game: {}", game_id)),
            Err(e) => Err(format!("Failed to launch game: {}", e)),
        }
    }
    
    #[cfg(target_os = "macos")]
    {
        match Command::new("open")
            .arg("-a")
            .arg(&exe_path)
            .spawn()
        {
            Ok(_) => Ok(format!("Successfully launched game: {}", game_id)),
            Err(e) => Err(format!("Failed to launch game: {}", e)),
        }
    }
    
    #[cfg(target_os = "linux")]
    {
        let working_dir = path.parent().unwrap_or(&path);
        
        match Command::new(&exe_path)
            .current_dir(working_dir)
            .spawn()
        {
            Ok(_) => Ok(format!("Successfully launched game: {}", game_id)),
            Err(e) => Err(format!("Failed to launch game: {}", e)),
        }
    }
}

#[tauri::command]
pub fn add_custom_game(name: String, executable_path: String, category: String) -> Result<GameInfo, String> {
    let path = PathBuf::from(&executable_path);
    if !path.exists() {
        return Err(format!("Executable not found: {}", executable_path));
    }
    
    let id = name.to_lowercase().replace(" ", "-");
    
    Ok(GameInfo {
        id,
        name,
        category,
        executable_path: Some(executable_path.clone()),
        install_path: path.parent().map(|p| p.to_string_lossy().to_string()),
        is_installed: true,
        platform: "custom".to_string(),
        image_url: "".to_string(),
    })
}
