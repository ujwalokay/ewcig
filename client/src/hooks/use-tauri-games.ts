import { useState, useEffect, useCallback } from "react";
import type { LauncherGame } from "@shared/schema";

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

function convertApiGameToGameInfo(apiGame: LauncherGame): GameInfo {
  return {
    id: apiGame.id.toString(),
    name: apiGame.name,
    category: apiGame.category,
    executable_path: null,
    install_path: null,
    is_installed: false,
    platform: "custom",
    image_url: apiGame.imageUrl || "https://via.placeholder.com/460x215?text=Game"
  };
}

export function useTauriGames() {
  const [games, setGames] = useState<GameInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [isTauriApp, setIsTauriApp] = useState(false);

  useEffect(() => {
    setIsTauriApp(isTauri());
  }, []);

  useEffect(() => {
    async function fetchGamesFromApi() {
      try {
        const response = await fetch("/api/launcher/games");
        if (response.ok) {
          const apiGames: LauncherGame[] = await response.json();
          const activeGames = apiGames.filter(g => g.isActive);
          const convertedGames = activeGames.map(convertApiGameToGameInfo);
          setGames(convertedGames);
        }
      } catch (error) {
        console.error("Failed to fetch games from API:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchGamesFromApi();
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
