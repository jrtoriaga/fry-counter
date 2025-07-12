import { openDB } from "idb";
import type { IDBPDatabase, DBSchema } from "idb";

export type Note = {
  seller?: string;
  id?: number;
};

export type Count = {
  noteId: number;
  id?: number;
  idx: number;
  count: number;
};

interface FryCounterDb extends DBSchema {
  notes: {
    key: number;
    value: Note;
  };
  counts: {
    key: number;
    value: Count;
    indexes: { by_noteId: number };
  };
}

let dbPromise: Promise<IDBPDatabase<FryCounterDb>>;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<FryCounterDb>("fry-counter", 1, {
      upgrade(db) {
        db.createObjectStore("notes", {
          keyPath: "id",
          autoIncrement: true,
        });

        const counterStore = db.createObjectStore("counts", {
          keyPath: "id",
          autoIncrement: true,
        });
        counterStore.createIndex("by_noteId", "noteId");
      },
    });
  }
  return dbPromise;
}

export async function getCountsById(noteId: number) {
  try {
    const db = await getDB();
    const items = await db.getAllFromIndex("counts", "by_noteId", Number(noteId));
    return items;
  } catch (err) {

    console.error(err);
  }

  return [];
}

export async function getNoteById(noteId: number){
  try {
    const db = await getDB();
    const note = await db.get("notes", noteId)
    return note;

  } catch(err){
    console.error(err)
  }
}


export async function createNote(seller?: string){
    try {
    const db = await getDB();
    const noteId = await db.put("notes", {seller})
    return noteId;

  } catch(err){
    console.error(err)
  }
}

export async function saveCount(idx: number, count: number, noteId: number){
  try {

    const db = await getDB();
    const countId = await db.put("counts", {idx, count, noteId})
    return countId
  } catch (err){
    console.log(err)
  }
}