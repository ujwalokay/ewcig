import { useState, useEffect, useCallback } from "react";

export interface GameInfo {
  id: string;
  name: string;
  category: string;
  executable_path: string | null;
  install_path: string | null;
  is_installed: boolean;
  platform: string;
  image_url: string;
}

const isTauri = () => {
  return typeof window !== "undefined" && "__TAURI__" in window;
};

async function invokeCommand<T>(command: string, args?: Record<string, unknown>): Promise<T> {
  if (!isTauri()) {
    throw new Error("Not running in Tauri environment");
  }
  const { invoke } = await import("@tauri-apps/api/core");
  return invoke<T>(command, args);
}

const defaultGames: GameInfo[] = [
  { id: "valorant", name: "Valorant", category: "FPS", executable_path: null, install_path: null, is_installed: false, platform: "riot", image_url: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/4fd6a11df4eb2c7c8e368e88b78e97ebb00f4688-1920x1080.jpg" },
  { id: "league-of-legends", name: "League of Legends", category: "MOBA", executable_path: null, install_path: null, is_installed: false, platform: "riot", image_url: "https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/4c44f7838e9c3a6ae8f02fc2f1e5a0ce66e2cf20-1920x1080.jpg" },
  { id: "cs2", name: "Counter-Strike 2", category: "FPS", executable_path: null, install_path: null, is_installed: false, platform: "steam", image_url: "https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg" },
  { id: "apex-legends", name: "Apex Legends", category: "Battle Royale", executable_path: null, install_path: null, is_installed: false, platform: "steam", image_url: "https://cdn.akamai.steamstatic.com/steam/apps/1172470/header.jpg" },
  { id: "dota2", name: "Dota 2", category: "MOBA", executable_path: null, install_path: null, is_installed: false, platform: "steam", image_url: "https://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg" },
  { id: "fortnite", name: "Fortnite", category: "Battle Royale", executable_path: null, install_path: null, is_installed: false, platform: "epic", image_url: "https://cdn2.unrealengine.com/en-eg-desktop-background-1923x1080-1923x1080-828a5d1ebb0f.jpg" },
  { id: "minecraft", name: "Minecraft", category: "Sandbox", executable_path: null, install_path: null, is_installed: false, platform: "microsoft", image_url: "https://cdn.akamai.steamstatic.com/steam/apps/1672970/header.jpg" },
  { id: "rocket-league", name: "Rocket League", category: "Sports", executable_path: null, install_path: null, is_installed: false, platform: "epic", image_url: "https://cdn.akamai.steamstatic.com/steam/apps/252950/header.jpg" },
  { id: "gta5", name: "GTA V", category: "Action", executable_path: null, install_path: null, is_installed: false, platform: "steam", image_url: "https://cdn.akamai.steamstatic.com/steam/apps/271590/header.jpg" },
  { id: "pubg", name: "PUBG", category: "Battle Royale", executable_path: null, install_path: null, is_installed: false, platform: "steam", image_url: "https://cdn.akamai.steamstatic.com/steam/apps/578080/header.jpg" },
  { id: "overwatch2", name: "Overwatch 2", category: "FPS", executable_path: null, install_path: null, is_installed: false, platform: "blizzard", image_url: "https://blz-contentstack-images.akamaized.net/v3/assets/blt2477dcaf4ebd440c/blt7f4c77fd14dff1c7/646e51bc2d39af49a3c2e0a4/ow2-homepage-hero-bg.webp" },
  { id: "fifa24", name: "FIFA 24", category: "Sports", executable_path: null, install_path: null, is_installed: false, platform: "ea", image_url: "https://cdn.akamai.steamstatic.com/steam/apps/2195250/header.jpg" },
];

export function useTauriGames() {
  const [games, setGames] = useState<GameInfo[]>(defaultGames);
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isTauriApp, setIsTauriApp] = useState(false);

  useEffect(() => {
    setIsTauriApp(isTauri());
  }, []);

  const scanForGames = useCallback(async () => {
    if (!isTauri()) {
      return;
    }

    setIsScanning(true);
    try {
      const scannedGames = await invokeCommand<GameInfo[]>("scan_installed_games");
      setGames(scannedGames);
    } catch (error) {
      console.error("Failed to scan for games:", error);
    } finally {
      setIsScanning(false);
    }
  }, []);

  const launchGame = useCallback(async (gameId: string, executablePath: string | null) => {
    if (!isTauri()) {
      return { success: false, message: "Not running in Tauri environment" };
    }

    if (!executablePath) {
      return { success: false, message: "Game not installed or path not found" };
    }

    try {
      const result = await invokeCommand<string>("launch_game", { 
        gameId, 
        executablePath 
      });
      return { success: true, message: result };
    } catch (error) {
      return { success: false, message: String(error) };
    }
  }, []);

  const addCustomGame = useCallback(async (name: string, executablePath: string, category: string) => {
    if (!isTauri()) {
      return { success: false, game: null, message: "Not running in Tauri environment" };
    }

    try {
      const newGame = await invokeCommand<GameInfo>("add_custom_game", { 
        name, 
        executablePath, 
        category 
      });
      setGames(prev => [...prev, newGame]);
      return { success: true, game: newGame, message: "Game added successfully" };
    } catch (error) {
      return { success: false, game: null, message: String(error) };
    }
  }, []);

  useEffect(() => {
    if (isTauri()) {
      scanForGames();
    }
  }, [scanForGames]);

  return {
    games,
    isLoading,
    isScanning,
    isTauriApp,
    scanForGames,
    launchGame,
    addCustomGame,
  };
}
