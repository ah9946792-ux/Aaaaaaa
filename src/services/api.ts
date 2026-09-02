import {
  AuthGooglePayload,
  AuthResponse,
  GameModeInfo,
  GlobalMarketPlayer,
  MultiplayerTournament,
  UserProfile,
} from '../types';

const API_BASE = '/api';

export class ApiService {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {},
    timeoutMs = 8000
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const url = `${API_BASE}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      const contentType = response.headers.get('content-type') || '';
      const rawText = await response.text();

      // Detect HTML response (e.g. 404 HTML fallback or gateway error)
      const isHtml =
        contentType.includes('text/html') ||
        rawText.trim().toLowerCase().startsWith('<!doctype') ||
        rawText.trim().toLowerCase().startsWith('<html');

      if (isHtml) {
        if (response.status === 404) {
          throw new Error(`API endpoint ${endpoint} was not found on the backend server (HTTP 404).`);
        }
        if (response.status >= 500) {
          throw new Error(
            `Backend server error (HTTP ${response.status}). The server returned an HTML error page.`
          );
        }
        throw new Error(
          `Unexpected HTML response from server at ${endpoint} (HTTP ${response.status}).`
        );
      }

      let data: any = {};
      if (rawText && rawText.trim().length > 0) {
        try {
          data = JSON.parse(rawText);
        } catch (parseError) {
          throw new Error(
            `Failed to parse server JSON response from ${endpoint} (HTTP ${response.status}). Raw snippet: ${rawText.slice(0, 100)}`
          );
        }
      }

      if (!response.ok) {
        const errorMsg =
          data?.error ||
          data?.message ||
          `Request to ${endpoint} failed with HTTP status ${response.status}`;
        throw new Error(errorMsg);
      }

      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`Network timeout: Request to ${endpoint} timed out after ${timeoutMs / 1000}s.`);
        }
        if (
          error instanceof TypeError &&
          (error.message.includes('fetch') ||
            error.message.includes('network') ||
            error.message.includes('Failed to fetch'))
        ) {
          throw new Error(
            `Network error: Failed to connect to server at ${url}. Please verify server availability.`
          );
        }
        throw error;
      }
      throw new Error(`Unknown error while requesting ${endpoint}`);
    }
  }

  static async checkHealth(): Promise<{ status: string; game: string }> {
    return this.request<{ status: string; game: string }>('/health');
  }

  static async getGameModes(): Promise<GameModeInfo[]> {
    const res = await this.request<{ modes: GameModeInfo[] }>('/modes');
    return res.modes;
  }

  static async loginWithGoogle(payload: AuthGooglePayload): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/google', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  static async getProfile(googleId: string): Promise<{ success: boolean; user: UserProfile }> {
    return this.request<{ success: boolean; user: UserProfile }>(
      `/profile/${encodeURIComponent(googleId)}`
    );
  }

  static async updateProfile(
    googleId: string,
    updates: Partial<UserProfile>
  ): Promise<{ success: boolean; user: UserProfile }> {
    return this.request<{ success: boolean; user: UserProfile }>(
      `/profile/${encodeURIComponent(googleId)}`,
      {
        method: 'PUT',
        body: JSON.stringify(updates),
      }
    );
  }

  // --- MANAGER MODE API ---

  static async getGlobalMarket(): Promise<GlobalMarketPlayer[]> {
    const res = await this.request<{ success: boolean; players: GlobalMarketPlayer[] }>(
      '/manager/market'
    );
    return res.players || [];
  }

  static async signPlayerExclusively(
    googleId: string,
    playerId: string
  ): Promise<{ success: boolean; message: string; user: UserProfile; player: GlobalMarketPlayer }> {
    return this.request<{
      success: boolean;
      message: string;
      user: UserProfile;
      player: GlobalMarketPlayer;
    }>('/manager/sign', {
      method: 'POST',
      body: JSON.stringify({ googleId, playerId }),
    });
  }

  static async releasePlayerExclusively(
    googleId: string,
    playerId: string
  ): Promise<{ success: boolean; message: string; user: UserProfile; sellValue?: number }> {
    return this.request<{
      success: boolean;
      message: string;
      user: UserProfile;
      sellValue?: number;
    }>('/manager/release', {
      method: 'POST',
      body: JSON.stringify({ googleId, playerId }),
    });
  }

  static async sellPlayerExclusively(
    googleId: string,
    playerId: string
  ): Promise<{ success: boolean; message: string; user: UserProfile; sellValue?: number }> {
    return this.releasePlayerExclusively(googleId, playerId);
  }

  static async getTournaments(): Promise<MultiplayerTournament[]> {
    const res = await this.request<{ success: boolean; tournaments: MultiplayerTournament[] }>(
      '/manager/tournaments'
    );
    return res.tournaments || [];
  }

  static async registerTournament(
    googleId: string,
    tournamentId: string
  ): Promise<{ success: boolean; message: string; tournament: MultiplayerTournament; user: UserProfile }> {
    return this.request<{
      success: boolean;
      message: string;
      tournament: MultiplayerTournament;
      user: UserProfile;
    }>('/manager/tournaments/register', {
      method: 'POST',
      body: JSON.stringify({ googleId, tournamentId }),
    });
  }
}

