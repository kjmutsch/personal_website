// Session-storage persistence for in-progress game state across page transitions.

const SESSION_KEY = "game-session-v1";

export interface SavedCoin {
  x: number;
  y: number;
  id: number;
}

export interface GameSession {
  backgroundPosition: number;
  distantBackgroundPosition: number;
  coins: SavedCoin[];
  coinsCollected: number;
  lastGeneratedSegment: number;
  lastCoinIndex: number;
  enteredRoutes: string[];
}

export const loadGameSession = (): GameSession | null => {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as GameSession;
  } catch {
    return null;
  }
};

export const saveGameSession = (session: GameSession) => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const clearGameSession = () => {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
};
