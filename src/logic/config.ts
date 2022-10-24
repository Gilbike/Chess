import { PieceColor } from "./constants";

const defaultConfig: ChessGameConfig = {
  startingFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
  startingSide: PieceColor.WHITE,
  lightPlayerName: "Player1",
  darkPlayerName: "Player2",
  lightTileColor: "#e0e0e0",
  darkTileColor: "#a1887f",
};

let GameConfig: ChessGameConfig = defaultConfig;

export function SetConfig(config?: ChessGameConfig) {
  const loadedConfig = config == undefined ? {} : config;
  GameConfig = { ...GameConfig, ...loadedConfig };
}

export function GetConfig(): ChessGameConfig {
  return GameConfig;
}
