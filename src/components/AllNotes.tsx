import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllNotes, type Note } from "../lib/db";

export default function AllNotes() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    (async () => {
      const notes = await getAllNotes();
      if (notes) {
        setNotes(notes);
      }
    })();
  }, []);

  return (
    <>
      {" "}
      <nav className="w-full bg-lime-600 flex items-center justify-between text-2xl px-4 text-white h-[66px]">
        JRT
      </nav>
      <div className="p-4 flex gap-4 flex-col">
        {/* List of notes */}

        {notes && notes.map((note) => (
          <Link to={`/counter?noteId=${note.id}`} key={note.id}>
            <div className="p-4 border rounded-md border-gray-300 text-gray-700">
              {note.title ? note.title : `Note ${note.id}`}
            </div>
          </Link>
        ))}

        {notes.length === 0 && (<div className="text-xl my-12 text-gray-700">No notes found.</div>)}

        {/* Create new note button */}
        <Link
          to="/counter"
          className="bg-lime-500 p-4 gap-4 text-white active:bg-lime-600 flex items-center justify-center"
        >
          {notes.length === 0 ? 'Create a Note': 'Create a New Note'}
        </Link>
      </div>
    </>
  );
}
