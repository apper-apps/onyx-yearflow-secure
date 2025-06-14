import { delay } from '../index.js';
import calendarsData from '../mockData/calendars.json';

let calendars = [...calendarsData];
let authToken = null;
let refreshToken = null;

// Google Calendar API configuration
const GOOGLE_CONFIG = {
  clientId: 'your-google-client-id',
  clientSecret: 'your-client-secret',
  redirectUri: 'http://localhost:5173/auth/callback',
  scope: 'https://www.googleapis.com/auth/calendar'
};

// OAuth helper functions
const getAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: GOOGLE_CONFIG.clientId,
    redirect_uri: GOOGLE_CONFIG.redirectUri,
    scope: GOOGLE_CONFIG.scope,
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent'
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

const exchangeCodeForTokens = async (code) => {
  await delay(800);
  // Simulate token exchange
  const mockTokens = {
    access_token: `mock_access_token_${Date.now()}`,
    refresh_token: `mock_refresh_token_${Date.now()}`,
    expires_in: 3600,
    token_type: 'Bearer'
  };
  
  authToken = mockTokens.access_token;
  refreshToken = mockTokens.refresh_token;
  return mockTokens;
};

const refreshAccessToken = async () => {
  if (!refreshToken) throw new Error('No refresh token available');
  
  await delay(500);
  // Simulate token refresh
  const newToken = `refreshed_access_token_${Date.now()}`;
  authToken = newToken;
  return newToken;
};

// Google Calendar API methods
const apiRequest = async (endpoint, options = {}) => {
  if (!authToken) throw new Error('Not authenticated');
  
  await delay(300);
  
  // Simulate API responses
  if (endpoint.includes('/calendars/primary')) {
    return {
      id: 'primary',
      summary: 'Primary Calendar',
      description: 'Your primary Google Calendar',
      timeZone: 'America/New_York'
    };
  }
  
  if (endpoint.includes('/events') && options.method === 'POST') {
    return {
      id: `event_${Date.now()}`,
      summary: options.body.summary,
      start: options.body.start,
      end: options.body.end,
      description: options.body.description,
      htmlLink: `https://calendar.google.com/event?eid=mock_${Date.now()}`
    };
  }
  
  return {};
};

export const getAll = async () => {
  await delay(300);
  return [...calendars];
};

export const getById = async (id) => {
  await delay(200);
  const calendar = calendars.find(cal => cal.id === id);
  return calendar ? { ...calendar } : null;
};

export const create = async (calendarData) => {
  await delay(400);
  
  // Mark any existing calendars as disconnected
  calendars = calendars.map(cal => ({ ...cal, connected: false }));
  
  const newCalendar = {
    ...calendarData,
    id: calendarData.id,
    connected: true,
    lastSync: new Date().toISOString()
  };
  
  calendars.push(newCalendar);
  return { ...newCalendar };
};

export const update = async (id, updates) => {
  await delay(300);
  const index = calendars.findIndex(cal => cal.id === id);
  
  if (index === -1) {
    throw new Error('Calendar not found');
  }
  
  calendars[index] = { ...calendars[index], ...updates };
  return { ...calendars[index] };
};

export const delete_ = async (id) => {
  await delay(300);
  const index = calendars.findIndex(cal => cal.id === id);
  
  if (index === -1) {
    throw new Error('Calendar not found');
  }
  
  calendars.splice(index, 1);
  return true;
};

// Google Calendar integration methods
export const requestGoogleAuth = () => {
  const authUrl = getAuthUrl();
  window.location.href = authUrl;
};

export const handleAuthCallback = async (code) => {
  const tokens = await exchangeCodeForTokens(code);
  
  // Get user's primary calendar info
  const calendarInfo = await apiRequest('/calendars/primary');
  
  const calendarData = {
    id: 'primary',
    type: 'google',
    name: calendarInfo.summary || 'Google Calendar',
    email: 'user@gmail.com', // Would come from profile API
    connected: true,
    lastSync: new Date().toISOString()
  };
  
  return await create(calendarData);
};

export const createCalendarEvent = async (goalData) => {
  if (!authToken) throw new Error('Not authenticated with Google Calendar');
  
  const startDate = new Date(goalData.targetDate);
  const endDate = new Date(startDate.getTime() + (2 * 60 * 60 * 1000)); // 2 hour event
  
  const eventData = {
    summary: `Goal: ${goalData.title}`,
    description: `YearFlow Goal\n\nDescription: ${goalData.description}\nCategory: ${goalData.category}\nProgress: ${goalData.progress}%`,
    start: {
      dateTime: startDate.toISOString(),
      timeZone: 'America/New_York'
    },
    end: {
      dateTime: endDate.toISOString(),
      timeZone: 'America/New_York'
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 1440 }, // 1 day before
        { method: 'popup', minutes: 60 }    // 1 hour before
      ]
    }
  };
  
  try {
    const event = await apiRequest('/calendars/primary/events', {
      method: 'POST',
      body: eventData
    });
    
    return {
      eventId: event.id,
      eventLink: event.htmlLink
    };
  } catch (error) {
    if (error.message.includes('401')) {
      await refreshAccessToken();
      return createCalendarEvent(goalData);
    }
    throw error;
  }
};

export const updateCalendarEvent = async (eventId, goalData) => {
  if (!authToken) throw new Error('Not authenticated with Google Calendar');
  
  const startDate = new Date(goalData.targetDate);
  const endDate = new Date(startDate.getTime() + (2 * 60 * 60 * 1000));
  
  const eventData = {
    summary: `Goal: ${goalData.title}`,
    description: `YearFlow Goal\n\nDescription: ${goalData.description}\nCategory: ${goalData.category}\nProgress: ${goalData.progress}%`,
    start: {
      dateTime: startDate.toISOString(),
      timeZone: 'America/New_York'
    },
    end: {
      dateTime: endDate.toISOString(),
      timeZone: 'America/New_York'
    }
  };
  
  try {
    return await apiRequest(`/calendars/primary/events/${eventId}`, {
      method: 'PUT',
      body: eventData
    });
  } catch (error) {
    if (error.message.includes('401')) {
      await refreshAccessToken();
      return updateCalendarEvent(eventId, goalData);
    }
    throw error;
  }
};

export const deleteCalendarEvent = async (eventId) => {
  if (!authToken) throw new Error('Not authenticated with Google Calendar');
  
  try {
    return await apiRequest(`/calendars/primary/events/${eventId}`, {
      method: 'DELETE'
    });
  } catch (error) {
    if (error.message.includes('401')) {
      await refreshAccessToken();
      return deleteCalendarEvent(eventId);
    }
    throw error;
  }
};

// Alias for delete (reserved keyword)
export { delete_ as delete };