import axios from 'axios'

const BASE_URL = 'http://localhost:3001/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})

// Automatically attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('aldss_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth
export const authAPI = {
  register: (data: RegisterData) => api.post('/auth/register', data),
  login: (data: LoginData) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me')
}

// Events
export const eventAPI = {
  log: (data: EventData) => api.post('/events/log', data),
  getMyEvents: () => api.get('/events/my-events')
}

// Survey
export const surveyAPI = {
  submit: (data: SurveyData) => api.post('/surveys/submit', data)
}

// Types
export interface RegisterData {
  email: string
  password: string
  fullName: string
  consentGiven: boolean
  ageRange?: string
  studyLevel?: string
  fieldOfStudy?: string
  weeklyStudyHours?: number
}

export interface LoginData {
  email: string
  password: string
}

export interface EventData {
  eventType: string
  contentId?: string
  trackId?: string
  depthScore?: number
  metadata?: Record<string, any>
}

export interface SurveyData {
  surveyType: string
  weekNumber?: number
  perceivedProgress?: number
  motivationScore?: number
  studyHours?: number
  mainChallenge?: string
  responses?: Record<string, any>
}

export default api