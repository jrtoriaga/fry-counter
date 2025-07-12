import { useCallback, useEffect, useState } from "react";
import { calculateTotalFry } from "../lib/utils";
import CounterItem from "./CounterItem";
import {
  createNote,
  getCountsById,
  getNoteById,
  saveCount,
  type Count,
} from "../lib/db";

function Counter() {
  const [states, setStates] = useState<Count[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const [noteId, setNoteId] = useState(0);

  // for the button to add more counter
  const [isAdding, setIsAdding] = useState(false);

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
        const newNoteId = await createNote();
        if (newNoteId) {
          setNoteId(newNoteId);
        }
      })();
    } else if (!isNaN(parsed)) {
      (async () => {
        const note = await getNoteById(parsed);
        if (note) {
          const items = await getCountsById(parsed);
          setStates(items);
          setNoteId(parsed);
        }
      })();
    }
  }, []);

  const addComponent = useCallback(() => {
    // Create a noteId from the store
    setIsAdding(true);

    // Save count
    (async () => {
      const countId = await saveCount(states.length + 1, 0, noteId);
      if (countId) {
        setStates((prev) => [
          ...prev,
          {
            idx: prev.length + 1,
            count: 0,
            text: (prev.length + 1) as unknown as string,
            noteId: noteId,
            id: countId,
          },
        ]);

        setIsAdding(false);
      } else {
        console.error("There's no count id for some reason");
      }
    })();
  }, [noteId, states]);

  useEffect(() => {
    setTotalCount(
      calculateTotalFry(states.map(({ idx, count }) => ({ idx, count })))
    );
  }, [states]);

  const updateCount = useCallback((idx: number) => {
    return (updateFn: (prev: number) => number) => {
      setStates((prev) =>
        prev.map((item) =>
          item.idx === idx ? { ...item, count: updateFn(item.count) } : item
        )
      );
    };
  }, []);

  return (
    <>
      {noteId ? (
        <>
          <div className="px-4 py-4 max-h-[calc(100vh-96px)] overflow-scroll scrollbar-none">
            {states.map((item) => (
              <CounterItem
                key={item.id}
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
                : states.length > 0
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
    </>
  );
}

export default Counter;
