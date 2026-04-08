import axios from "axios";

const BASE_URL = "http://localhost:3001/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});
export const surveyAPI = {
  submit: (data: SurveyData) => api.post("/surveys/submit", data),
  getWeeklyStatus: () => api.get("/surveys/weekly-status"),
  getMySurveys: () => api.get("/surveys/my-surveys"),
};
export const adminAPI = {
  getOverview: () => api.get("/admin/overview"),
  getParticipants: () => api.get("/admin/participants"),
  getParticipantDetail: (userId: string) =>
    api.get(`/admin/participants/${userId}`),
  getRecentActivity: () => api.get("/admin/activity"),
};
// Automatically attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("aldss_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const authAPI = {
  register: (data: RegisterData) => api.post("/auth/register", data),
  login: (data: LoginData) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
};

// Events
export const eventAPI = {
  log: (data: EventData) => api.post("/events/log", data),
  getMyEvents: () => api.get("/events/my-events"),
};

// Types
export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  consentGiven: boolean;
  ageRange?: string;
  studyLevel?: string;
  fieldOfStudy?: string;
  weeklyStudyHours?: number;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface EventData {
  eventType: string;
  contentId?: string;
  trackId?: string;
  depthScore?: number;
  metadata?: Record<string, any>;
}

export interface SurveyData {
  surveyType: string;
  weekNumber?: number;
  perceivedProgress?: number;
  motivationScore?: number;
  studyHours?: number;
  mainChallenge?: string;
  responses?: Record<string, any>;
}
export const contentAPI = {
  getTracks: () => api.get("/content/tracks"),
  getModules: (trackId: string) =>
    api.get(`/content/tracks/${trackId}/modules`),
  getModule: (moduleId: string) => api.get(`/content/modules/${moduleId}`),
  submitQuiz: (moduleId: string, answers: Record<string, number>) =>
    api.post(`/content/modules/${moduleId}/quiz`, { answers }),
  logPathSwitch: (fromTrackId: string, toTrackId: string) =>
    api.post("/content/path-switch", { fromTrackId, toTrackId }),
};

export default api;
