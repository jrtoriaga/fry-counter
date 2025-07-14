import { useCallback, useEffect, useRef, useState } from "react";
import { calculateTotalFry } from "../lib/utils";
import CounterItem from "./CounterItem";
import {
  getCountsById,
  getNoteById,
  type Count,
  type Note,
  saveNoteWithCounts,
} from "../lib/db";
import { Link, useNavigate } from "react-router-dom";

function Counter() {
  const [counts, setCounts] = useState<Count[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  // For popup
  const [showPopup, setShowPopup] = useState(false);

  const [note, setNote] = useState<Note>({});

  // for the button to add more counter

  // Saving
  const [isSaving, setSaving] = useState(false);

  // const [error, setError] = useState(false);

  // These are for no duplicate saving
  const lastSavedNoteRef = useRef<Note>({});
  const lastSavedCountsRef = useRef<Count[]>([]);

  // Get items from db if noteId exists
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("noteId");
    let parsed = Number(raw);

    if (!isNaN(parsed)) {
      (async () => {
        const note = await getNoteById(parsed);
        if (note) {
          const items = await getCountsById(parsed);
          setCounts(items);
          setNote(note);

          // ✅ Set initial saved refs
          lastSavedNoteRef.current = note;
          lastSavedCountsRef.current = items;
        }
      })();
    }
  }, []);

  const addComponent = useCallback(() => {
    // Create a noteId from the store

    // Save count
    setCounts((prev) => [
      ...prev,
      {
        idx: prev.length + 1,
        count: 0,
        noteId: note?.id || 0,
        id: 0,
      },
    ]);
  }, [counts, note]);

  useEffect(() => {
    setTotalCount(
      calculateTotalFry(counts.map(({ idx, count }) => ({ idx, count })))
    );
  }, [counts]);

  const updateCount = useCallback((idx: number) => {
    return (updateFn: (prev: number) => number) => {
      setCounts((prev) =>
        prev.map((item) =>
          item.idx === idx ? { ...item, count: updateFn(item.count) } : item
        )
      );
    };
  }, []);

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => setShowPopup(false), 3000);
      return () => clearTimeout(timer); // cleanup
    }
  }, [showPopup]);

  const save = useCallback(async () => {
    if (!note || !counts) {
      console.error("Can't save.");
      return;
    }

    // Compare current and last saved versions
    const sameNote =
      JSON.stringify(note) === JSON.stringify(lastSavedNoteRef.current);
    const sameCounts =
      JSON.stringify(counts) === JSON.stringify(lastSavedCountsRef.current);

    console.log(
      "Note changed:",
      JSON.stringify(counts) !== JSON.stringify(lastSavedCountsRef.current)
    );

    if (sameNote && sameCounts) {
      console.log("No changes, skipping save");
      return;
    }

    setSaving(true);

    const result = await saveNoteWithCounts(note, counts);
    if (result) {
      const { note: newNote, counts: newCounts } = result;
      if (newNote) {
        setNote(newNote);
        lastSavedNoteRef.current = newNote;
      }
      if (newCounts) {
        const filtered = newCounts.filter((c): c is Count => c !== undefined);
        setCounts(filtered);
        lastSavedCountsRef.current = filtered;
      }
      console.log("Successfully saved");
      setShowPopup(true)
    }

    setSaving(false);
  }, [note, counts]);

  const navigate = useNavigate();

  const edit = useCallback(async () => {
    // First save

    await save();
    navigate(`/edit?noteId=${note.id}`);
  }, [note, counts]);

  return (
    <>
      <nav className="w-full bg-lime-600 flex items-center px-4 text-white h-[66px]">
        <div className="w-1/3">
          <Link to="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </Link>
        </div>

        <div className="w-1/3 flex items-center gap-2 justify-center">
          <span className=" text-center shrink truncate max-w-full">
            {note
              ? note.title
                ? note.title
                : note.id
                ? `Note ${note.id}`
                : "Unsaved Note"
              : "Unsaved Note"}
          </span>

          {note.id && (
            <svg
              onClick={edit}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5 shrink-0 active:text-lime-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          )}
        </div>

        {/* Save cog and settings cog */}
        <div className="w-1/3 flex justify-end relative">
          <button
            className=" active:text-lime-700 disabled:text-lime-700"
            disabled={isSaving}
            onClick={save}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75h1.5m9 0h-9"
              />
            </svg>
          </button>

          {isSaving && <span className="absolute right-8">Saving</span>}
        </div>
      </nav>
      {note ? (
        <>
          <div className="px-4 py-4 max-h-[calc(100vh-96px)] overflow-scroll scrollbar-none">
            {counts.map((item) => (
              <CounterItem
                key={item.idx}
                handler={updateCount(item.idx)}
                idx={item.idx}
                count={item.count}
              />
            ))}

            <button
              className="text-xl border-dashed border p-4 text-center active:bg-gray-100 w-full disabled:bg-gray-100 mb-4"
              onClick={() => addComponent()}
            >
              {counts.length > 0 ? "Add More" : "Add Counter"}
            </button>
          </div>

          <div className="absolute bottom-0 w-full h-12 bg-lime-600 flex items-center justify-center text-white text-xl">
            {totalCount}
          </div>
        </>
      ) : (
        "Loading"
      )}

      {/* Pop up */}
      <div
        className={`fixed left-1/2 bottom-16 duration-300 transition-opacity w-3/4  transform -translate-x-1/2 text-center py-2 text-gray-600 ease-in-out
          ${showPopup ? " opacity-100" : "opacity-0"}
          `}
      >
        Note has been saved.
      </div>
    </>
  );
}

export default Counter;
