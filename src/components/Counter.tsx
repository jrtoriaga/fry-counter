import { useCallback, useEffect, useRef, useState } from "react";
import { calculateTotalFry } from "../lib/utils";
import CounterItem from "./CounterItem";
import {
  getCountsById,
  getNoteById,
  type Count,
  type Note,
  saveNoteWithCounts,
  deleteCountById,
} from "../lib/db";
import { useNavigate } from "react-router-dom";

import saveSVG from "../assets/save.svg";

function Counter() {
  const [counts, setCounts] = useState<Count[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  // For popup
  const [popUpText, setPopUpText] = useState("");
  const [isPopupShowing, setShowPopup] = useState(false);

  const showPopUp = useCallback((text: string) => {
    setPopUpText(text);
    setShowPopup(true);
  }, []);

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

    if (raw === null) {
      // If no notes exist, create a single count
      if (counts.length <= 0) {
        console.log("Adding first counter");
        setCounts((prev) =>
          prev.length ? prev : [...prev, { id: 0, idx: 1, noteId: 0, count: 0 }]
        );
      }
    }
  }, []);

  // Deleted Counts
  const deletedCounts = useRef<Count[]>([]);

  // TODO: Add logic to handler adding ones that are in the deletedCountsWithId
  const addComponent = useCallback(() => {
    console.log("Adding component");
    if (deletedCounts.current.length !== 0) {
      const lastDeleted = deletedCounts.current.pop();
      console.log("Adding previously deleted item with id: " + lastDeleted?.id);
      const count = 0;

      if (lastDeleted) {
        setCounts((prev) => [
          ...prev,
          {
            ...lastDeleted,
            count,
          },
        ]);
      }
      // Check deletedCountsWith Id if an item exists
      // If it has an item, append the item back to counts
      // Save count
    } else {
      console.log("Adding new item as usual");
      setCounts((prev) => [
        ...prev,
        {
          idx: prev.length + 1,
          count: 0,
          noteId: note?.id || 0,
          id: 0,
        },
      ]);
    }
  }, [note, deletedCounts]);

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

  // TODO: Add logic to handler ones already existing in the database
  const lastItemHandler = useCallback(() => {
    // Get the last item.
    // If the last item has an ID, add to deletedCountsWithId

    setCounts((prev) => {
      const last = prev.at(-1);
      if (last && !deletedCounts.current.includes(last) && last.id !== 0) {
        console.log("Adding to deleted count " + last.id);
        deletedCounts.current.push(last);
      }
      return prev.slice(0, -1);
    });
  }, [counts, deletedCounts]);

  // Show pop up logic
  useEffect(() => {
    if (isPopupShowing) {
      const timer = setTimeout(() => setShowPopup(false), 3000);
      return () => clearTimeout(timer); // cleanup
    }
  }, [isPopupShowing]);

  // Saving note logic
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
      showPopUp("No changes detected.");
      // Because this function is needed to return an id and the note exits
      return note.id;
    }

    setSaving(true);

    // Delete deleted counts before they get recollected by saveNoteWithCounts
    if (deletedCounts.current.length !== 0) {
      await Promise.all(
        deletedCounts.current.map((item) => deleteCountById(item.id!))
      );
    }

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
      showPopUp("Count has been saved.");
    }

    setSaving(false);
    return result?.note?.id
  }, [note, counts]);

  const navigate = useNavigate();

  const edit = useCallback(async () => {
    // First save
    const noteId = await save();
    if (noteId) navigate(`/edit?noteId=${noteId}`);
  }, [note, counts]);

  return (
    <>
      {note ? (
        <>
          <div className="flex gap-4 flex-col mt-4">
            {/* Note title */}
            <div className="flex items-center  justify-between bg-white/80 px-4 min-h-[54px] rounded-2xl font-medium">
              <span className="flex-grow select-none max-w-full truncate">
                {note.title || "Untitled Count"}
              </span>

              {/* icon edit */}

              {/* Saving shouldn't exist if there's no counter */}
              {counts.length > 0 && (
                <div className="w-fit">
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
                </div>
              )}
            </div>

            {/* max height is statically calculated, which I hate. Basically, all top are 174px and the ones at the bottom are 158*/}
            {counts.length > 0 && (
              <div className="max-h-[calc(100dvh-174px-158px)] flex flex-col gap-4 overflow-scroll scrollbar-none">
                {/* Counters */}
                {counts.map((item, i) => (
                  <CounterItem
                    key={item.idx}
                    handler={updateCount(item.idx)}
                    idx={item.idx}
                    count={item.count}
                    lastItemHandler={
                      i === counts.length - 1 ? lastItemHandler : undefined
                    }
                  />
                ))}
              </div>
            )}

            <button
              className="font-medium rounded-2xl border-dashed border py-3 px-4 text-center active:bg-green-100 w-full disabled:bg-gray-100 mb-4"
              onClick={() => addComponent()}
            >
              Add Counter
            </button>
          </div>

          <div className="fixed rounded-2xl left-1/2 -translate-x-1/2 bottom-8 w-fit py-2 font-medium px-4 bg-white/80 flex items-center justify-center text-xl">
            {totalCount}
          </div>

          {/* Save button */}

          {counts.length > 0 && (
            <button
              className="fixed bottom-8 bg-green-500 rounded-full px-2 py-2 w-[44px] aspect-square disabled:bg-green-200"
              disabled={isSaving}
              onClick={save}
            >
              <img src={saveSVG} className="w-ful" alt="Save button" />
            </button>
          )}
        </>
      ) : (
        "Loading"
      )}

      {/* Pop up */}
      <div
        className={`fixed left-1/2 bottom-8 rounded-2xl bg-gray-100 duration-300 transition-opacity w-3/5  pointer-events-none transform -translate-x-1/2 text-center py-2 text-gray-600 ease-in-out
          ${isPopupShowing ? " opacity-100" : "opacity-0"}
          `}
      >
        {popUpText}
      </div>
    </>
  );
}

export default Counter;
