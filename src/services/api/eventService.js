import { delay } from '../index.js';
import eventsData from '../mockData/events.json';

let events = [...eventsData];

export const getAll = async () => {
  await delay(300);
  return [...events];
};

export const getById = async (id) => {
  await delay(200);
  const event = events.find(e => e.id === id);
  return event ? { ...event } : null;
};

export const create = async (eventData) => {
  await delay(400);
  const newEvent = {
    ...eventData,
    id: Date.now().toString()
  };
  
  events.push(newEvent);
  return { ...newEvent };
};

export const update = async (id, updates) => {
  await delay(300);
  const index = events.findIndex(e => e.id === id);
  
  if (index === -1) {
    throw new Error('Event not found');
  }
  
  events[index] = { ...events[index], ...updates };
  return { ...events[index] };
};

export const delete_ = async (id) => {
  await delay(300);
  const index = events.findIndex(e => e.id === id);
  
  if (index === -1) {
    throw new Error('Event not found');
  }
  
  events.splice(index, 1);
  return true;
};

// Alias for delete (reserved keyword)
export { delete_ as delete };