import { delay } from '../index.js';
import goalsData from '../mockData/goals.json';

let goals = [...goalsData];

export const getAll = async () => {
  await delay(300);
  return [...goals];
};

export const getById = async (id) => {
  await delay(200);
  const goal = goals.find(g => g.id === id);
  return goal ? { ...goal } : null;
};

export const create = async (goalData) => {
  await delay(400);
  const newGoal = {
    ...goalData,
    id: Date.now().toString(),
    notifications: goalData.notifications || []
  };
  
  goals.push(newGoal);
  return { ...newGoal };
};

export const update = async (id, updates) => {
  await delay(300);
  const index = goals.findIndex(g => g.id === id);
  
  if (index === -1) {
    throw new Error('Goal not found');
  }
  
  goals[index] = { ...goals[index], ...updates };
  return { ...goals[index] };
};

export const delete_ = async (id) => {
  await delay(300);
  const index = goals.findIndex(g => g.id === id);
  
  if (index === -1) {
    throw new Error('Goal not found');
  }
  
  goals.splice(index, 1);
  return true;
};

// Alias for delete (reserved keyword)
export { delete_ as delete };