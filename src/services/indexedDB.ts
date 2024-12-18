import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'police-app';
const DB_VERSION = 1;
const STORE_NAME = 'approaches';

let dbInstance: IDBPDatabase | null = null;

// Initialize the database
const initDB = async () => {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });

  return dbInstance;
};

// Function to add an approach
export const addApproach = async (approach: any) => {
  const db = await initDB();
  await db.put(STORE_NAME, approach);
};

// Function to get all approaches
export const getAllApproaches = async () => {
  const db = await initDB();
  return await db.getAll(STORE_NAME);
};

// Function to get an approach by ID
export const getApproachById = async (id: string) => {
  const db = await initDB();
  return await db.get(STORE_NAME, id);
};

// Function to delete an approach
export const deleteApproach = async (id: string) => {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
};

// Function to update an approach
export const updateApproach = async (approach: any) => {
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