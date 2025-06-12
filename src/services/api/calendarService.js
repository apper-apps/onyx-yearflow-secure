import { delay } from '../index.js';
import calendarsData from '../mockData/calendars.json';

let calendars = [...calendarsData];

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

// Alias for delete (reserved keyword)
export { delete_ as delete };