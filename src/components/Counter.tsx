import { useCallback, useEffect, useState } from "react";
import { calculateTotalFry } from "../lib/utils";
import CounterItem from "./CounterItem";
import {
  updateOrInsertNote,
  getCountsById,
  getNoteById,
  updateOrInsertCount,
  type Count,
  type Note,
  saveNote,
} from "../lib/db";
import { useLocation, useNavigate } from "react-router-dom";

function Counter() {
  const [counts, setCounts] = useState<Count[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const [note, setNote] = useState<Note>();

  // for the button to add more counter
  const [isAdding, setIsAdding] = useState(false);

  // Saving
  const [isSaving, setSaving] = useState(false);

  // For url changing
  const location = useLocation()
  const navigate = useNavigate()

  // const [error, setError] = useState(false);

  // Get items from db if noteId exists
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const create = params.get("create");
    const raw = params.get("noteId");
    let parsed = Number(raw);

    if (create === "true") {
      // Only create a new note if explicitly requested
      (async () => {
        const newNoteWithId = await updateOrInsertNote({});
        if (newNoteWithId) {
          setNote(newNoteWithId);

          // Also change the url
          navigate({
            pathname: location.pathname,
            search: `noteId=${newNoteWithId.id}`
          }, {replace: true})


        }
      })();
    } else if (!isNaN(parsed)) {
      (async () => {
        const note = await getNoteById(parsed);
        if (note) {
          const items = await getCountsById(parsed);
          setCounts(items);
          setNote(note);
        }
      })();
    }
  }, []);

  const addComponent = useCallback(() => {
    // Create a noteId from the store

    // Save count
    if (note?.id) {
      setCounts((prev) => [
        ...prev,
        {
          idx: prev.length + 1,
          count: 0,
          noteId: note?.id!,
          id: 0,
        },
      ]);
    } else {
      console.error("No note exists");
    }
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

  // TODO Create overall save button

const save = useCallback(async () => {
  if (!note || !counts) {
    console.error("Can't save.");
    return;
  }

  setSaving(true);

  const result = await saveNote(note, counts);
  if (result) {
    const { note: newNote, counts: newCounts } = result;
    setNote(newNote);
    setCounts(newCounts);
    console.log("Successfully saved");
  }

  setSaving(false);
}, [note, counts]);


  return (
    <>
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
              className="text-xl border-dashed border p-4 text-center active:bg-gray-100 w-full disabled:bg-gray-100"
              disabled={isAdding}
              onClick={() => addComponent()}
            >
              {isAdding
                ? "Adding. Please wait."
                : counts.length > 0
                ? "Add More"
                : "Add Counter"}
            </button>
          </div>

          <div className="absolute bottom-0 w-full h-12 bg-lime-600 flex items-center justify-center text-white text-xl">
            {totalCount}
          </div>
        </>
      ) : (
        "Loading"
      )}

      <div className="fixed bottom-4 right-4">
        <button onClick={save}>Save</button>
      </div>
    </>
  );
}

export default Counter;
