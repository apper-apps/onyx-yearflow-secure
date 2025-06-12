import { delay } from '../index.js';
import notificationsData from '../mockData/notifications.json';

let notifications = [...notificationsData];

export const getAll = async () => {
  await delay(300);
  return [...notifications];
};

export const getById = async (id) => {
  await delay(200);
  const notification = notifications.find(n => n.id === id);
  return notification ? { ...notification } : null;
};

export const create = async (notificationData) => {
  await delay(400);
  const newNotification = {
    ...notificationData,
    id: Date.now().toString()
  };
  
  notifications.push(newNotification);
  return { ...newNotification };
};

export const update = async (id, updates) => {
  await delay(300);
  const index = notifications.findIndex(n => n.id === id);
  
  if (index === -1) {
    throw new Error('Notification not found');
  }
  
  notifications[index] = { ...notifications[index], ...updates };
  return { ...notifications[index] };
};

export const delete_ = async (id) => {
  await delay(300);
  const index = notifications.findIndex(n => n.id === id);
  
  if (index === -1) {
    throw new Error('Notification not found');
  }
  
  notifications.splice(index, 1);
  return true;
};

// Alias for delete (reserved keyword)
export { delete_ as delete };