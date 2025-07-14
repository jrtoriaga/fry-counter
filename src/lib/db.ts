import { openDB } from "idb";
import type { IDBPDatabase, DBSchema } from "idb";

export type Note = {
  seller?: string;
  id?: number;
  title?: string;
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

    const noteWithId = await db.get("notes", noteId);

    return noteWithId;
  } catch (err) {
    console.error(err);
  }
}

export async function updateOrInsertCount(count: Count) {
  try {
    const db = await getDB();
    const countId = await db.put("counts", count);

    const countWithId = await db.get("counts", countId);
    return countWithId;
  } catch (err) {
    console.log(err);
  }
}

export async function saveNoteWithCounts(note: Note, counts: Count[]) {
  try {
    const db = await getDB();

    // Get a note id
    const cleanedNote = Object.fromEntries(
      Object.entries(note).filter(([_, v]) => v)
    );
    const id = await db.put("notes", cleanedNote);

    if (id && counts) {
      // Save the counts
      const updatedCounts = await Promise.all(
        counts.map((count) => {
          if (count.id === 0) delete count.id;
          return updateOrInsertCount({ ...count, noteId: id });
        })
      );

      return { note: { ...note, id }, counts: updatedCounts };
    }
    return { ...note, id };
  } catch (err) {
    console.log(err);
  }
}

export async function saveNote(note: Note) {
  try {
    const db = await getDB();
    // Get a note id
    const cleanedNote = Object.fromEntries(
      Object.entries(note).filter(([_, v]) => v)
    );
    const id = await db.put("notes", cleanedNote);

    // WARN This assumes that we're saving the complete note so we no longer have to get the note from the db
    return { ...note, id } as Note;
  } catch (err) {
    console.log(err);
  }
}

export async function getAllNotes() {
  try {
    const db = await getDB();
    const notes = await db.getAll("notes");
    return notes;
  } catch (err) {
    console.log(err);
  }
}


export async function deleteNoteById(noteId: number){
  try {

    const db = await getDB()

    await db.delete("notes", noteId)
  } catch (err){

    console.log(err)
  }
}