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
    const items = await db.getAllFromIndex(
      "counts",
      "by_noteId",
      Number(noteId)
    );
    return items;
  } catch (err) {
    console.error(err);
  }

  return [];
}

export async function getNoteById(noteId: number) {
  try {
    const db = await getDB();
    const note = await db.get("notes", noteId);
    return note;
  } catch (err) {
    console.error(err);
  }
}

export async function updateOrInsertNote(note: Note) {
  try {
    const db = await getDB();
    const noteId = await db.put("notes", note);

    const noteWithId = await db.get("notes", noteId)

    return noteWithId
  } catch (err) {
    console.error(err);
  }
}

export async function updateOrInsertCount(count: Count) {
  try {
    const db = await getDB();
    const countId = await db.put("counts", count);
  
    const countWithId = await db.get("counts", countId)
    return countWithId
  } catch (err) {
    console.log(err);
  }
}

export async function saveNote(note: Note, counts: Count[]) {
  try {
    const db = await getDB();

    // Get a note id
    const cleanedNote = Object.fromEntries(Object.entries(note).filter(([_, v]) => v))
    const id = await db.put("notes", cleanedNote)

    if (id){
      // Save the counts

      // Filter
      counts.forEach((count) => {
        if (count.id === 0){
          delete count.id
        }
      })

      counts.forEach((count) => {
        const newCount = updateOrInsertCount({...count, noteId: id})
        Object.assign(count, newCount)

      })
    }

    return {note: {...note, noteId: id}, counts: counts}


  } catch (err) {
    console.log(err);
  }
}
