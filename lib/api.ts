const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://free-fit-backend.onrender.com/api";

// Helper to get tokens from storage
const getAccessToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token");
  }
  return null;
};

const getRefreshToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("refresh_token");
  }
  return null;
};

// Helper to set tokens
const setTokens = (access: string, refresh: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
  }
};

const clearTokens = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
  }
};

// Generic fetch wrapper
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  const token = getAccessToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle token refresh on 401
    if (response.status === 401 && getRefreshToken()) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        // Retry the original request
        headers["Authorization"] = `Bearer ${getAccessToken()}`;
        const retryResponse = await fetch(url, {
          ...options,
          headers,
        });
        return handleResponse(retryResponse);
      }
    }

    return handleResponse(response);
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

// Refresh access token
async function refreshAccessToken() {
  try {
    const refresh = getRefreshToken();
    if (!refresh) return false;

    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (response.ok) {
      const data = await response.json();
      setTokens(data.access, data.refresh);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// ==================== AUTH API ====================

export const authAPI = {
  // Register new user
  register: async (email: string, password: string, confirmPassword: string) => {
    const data = await fetchAPI("/auth/register/", {
      method: "POST",
      body: JSON.stringify({ email, password, confirm_password: confirmPassword }),
    });
    return data;
  },

  // Login user
  login: async (email: string, password: string) => {
    const data = await fetchAPI("/auth/login/", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (data.access && data.refresh) {
      setTokens(data.access, data.refresh);
    }
    return data;
  },

  // Logout user
  logout: () => {
    clearTokens();
    window.location.href = "/signin";
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!getAccessToken();
  },

  // Get current tokens
  getTokens: () => ({
    access: getAccessToken(),
    refresh: getRefreshToken(),
  }),
};

// ==================== USER API ====================

export const userAPI = {
  // Get current user profile
  getProfile: async () => {
    return fetchAPI("/users/me/");
  },

  // Update user profile
  updateProfile: async (profileData: { name?: string; avatar?: string }) => {
    return fetchAPI("/users/me/", {
      method: "PATCH",
      body: JSON.stringify(profileData),
    });
  },
};

// ==================== STREAMS API ====================

export const streamsAPI = {
  // Get all streams
  getStreams: async (params?: { status?: string; sport?: string; page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append("status", params.status);
    if (params?.sport) queryParams.append("sport", params.sport);
    if (params?.page) queryParams.append("page", String(params.page));
    if (params?.limit) queryParams.append("limit", String(params.limit));

    return fetchAPI(`/streams/?${queryParams.toString()}`);
  },

  // Get single stream
  getStream: async (id: string) => {
    return fetchAPI(`/streams/${id}/`);
  },

  // Get featured streams
  getFeatured: async () => {
    return fetchAPI("/streams/featured/");
  },

  // Record stream view
  recordView: async (id: string, duration: number, quality: string) => {
    return fetchAPI(`/streams/${id}/view/`, {
      method: "POST",
      body: JSON.stringify({ duration, quality }),
    });
  },
};

// ==================== SCHEDULE API ====================

export const scheduleAPI = {
  // Get schedule
  getSchedule: async (params?: { date?: string; sport?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.date) queryParams.append("date", params.date);
    if (params?.sport) queryParams.append("sport", params.sport);

    return fetchAPI(`/schedule/?${queryParams.toString()}`);
  },

  // Set reminder
  setReminder: async (eventId: string, notifyBefore: number = 15) => {
    return fetchAPI(`/schedule/${eventId}/reminder/`, {
      method: "POST",
      body: JSON.stringify({ notify_before: notifyBefore }),
    });
  },

  // Remove reminder
  removeReminder: async (eventId: string) => {
    return fetchAPI(`/schedule/${eventId}/reminder/`, {
      method: "DELETE",
    });
  },
};

// ==================== HIGHLIGHTS API ====================

export const highlightsAPI = {
  // Get highlights
  getHighlights: async (params?: { sport?: string; type?: string; page?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.sport) queryParams.append("sport", params.sport);
    if (params?.type) queryParams.append("type", params.type);
    if (params?.page) queryParams.append("page", String(params.page));

    return fetchAPI(`/highlights/?${queryParams.toString()}`);
  },

  // Get single highlight
  getHighlight: async (id: string) => {
    return fetchAPI(`/highlights/${id}/`);
  },
};

// ==================== NEWS API ====================

export const newsAPI = {
  // Get news articles
  getNews: async (params?: { sport?: string; category?: string; page?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.sport) queryParams.append("sport", params.sport);
    if (params?.category) queryParams.append("category", params.category);
    if (params?.page) queryParams.append("page", String(params.page));

    return fetchAPI(`/news/?${queryParams.toString()}`);
  },

  // Get single article
  getArticle: async (slug: string) => {
    return fetchAPI(`/news/${slug}/`);
  },
};

// ==================== SPORTS API ====================

export const sportsAPI = {
  // Get all sports
  getSports: async () => {
    return fetchAPI("/sports/");
  },

  // Get leagues for sport
  getLeagues: async (sportSlug: string) => {
    return fetchAPI(`/sports/${sportSlug}/leagues/`);
  },

  // Get teams for league
  getTeams: async (leagueSlug: string) => {
    return fetchAPI(`/leagues/${leagueSlug}/teams/`);
  },
};

export default {
  auth: authAPI,
  user: userAPI,
  streams: streamsAPI,
  schedule: scheduleAPI,
  highlights: highlightsAPI,
  news: newsAPI,
  sports: sportsAPI,
};
