import { openDB } from 'idb';

const DB_NAME = 'police-app';
const DB_VERSION = 1;
const STORE_NAME = 'approaches';

// Initialize the database
const initDB = async () => {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    },
  });
  return db;
};

// Function to add an approach
export const addApproach = async (approach) => {
  const db = await initDB();
  await db.put(STORE_NAME, approach);
};

// Function to get all approaches
export const getAllApproaches = async () => {
  const db = await initDB();
  return await db.getAll(STORE_NAME);
};

// Function to get an approach by ID
export const getApproachById = async (id) => {
  const db = await initDB();
  return await db.get(STORE_NAME, id);
};

// Function to delete an approach
export const deleteApproach = async (id) => {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
};

// Function to update an approach
export const updateApproach = async (approach) => {
  const db = await initDB();
  await db.put(STORE_NAME, approach);
};

// Exporting the Approach type
export interface Approach {
  id: string;
  name: string;
  date: string;
  location: string;
  companions?: string[];
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
}
