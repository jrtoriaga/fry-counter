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
      <div className="py-4 flex gap-4 flex-col">
        {/* List of notes */}

        {notes &&
          notes.map((note, i) => (
            <Link to={`/counter?noteId=${note.id}`} key={note.id}>
              <div className="p-4 text-gray-700 font-medium flex items-center gap-2 bg-white/40 backdrop-blud-md  rounded-xl">
                <span>{i + 1}.</span>
                {note.title ? note.title : 'Untitled'}
              </div>
            </Link>
          ))}

        {notes.length === 0 && (
          <div className="bg-white/40 backdrop-blud-md  flex items-center rounded-2xl px-4">

            <div className="text-xl my-12 text-gray-700">No counts found.</div>
          </div>
        )}

        {/* Create new note button */}
        <Link
          to="/counter"
          className="bg-green-500 text-lg py-2 gap-4 text-white font-semibold active:bg-lime-600 flex items-center justify-center rounded-2xl"
        >
          {notes.length === 0 ? "Create a Count" : "Create a New Count"}
        </Link>
      </div>
    </>
  );
}
