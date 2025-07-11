import { useCallback, useEffect, useState } from "react";
import { calculateTotalFry } from "../lib/utils";
import CounterItem from "./CounterItem";
import { getCountsById, type Count } from "../lib/db";

function Counter() {
  const [states, setStates] = useState<Count[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const [noteId, setNoteId] = useState(0);

  // Get items from db if noteId exists
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("noteId");
    const parsed = Number(raw);

    if (!isNaN(parsed)) {
      console.log("Parsed noteId:", parsed);
      setNoteId(parsed);

      (async () => {
        const items = await getCountsById(parsed);
        console.log(items);
        setStates(items);
      })();
    } else {
      console.warn("Invalid noteId in URL:", raw);
      // Handle invalid noteId (e.g., redirect or show modal)
    }
  }, []);

  const addComponent = useCallback(() => {
    // Create a noteId from the store

    setStates((prev) => [
      ...prev,
      {
        idx: prev.length,
        count: 0,
        text: (prev.length + 1) as unknown as string,
        noteId: 0,
        id: 0,
      },
    ]);
  }, [noteId]);

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
      {/* body */}
      <div className="px-4 py-4 max-h-[calc(100vh-96px)] overflow-scroll scrollbar-none">
        {states.map((item) => (
          <CounterItem
            key={item.idx}
            handler={updateCount(item.idx)}
            idx={item.idx}
            count={item.count}
          />
        ))}

        {/* Add more */}
        <button
          className="text-xl border-dashed border p-4 text-center active:bg-gray-100 w-full"
          onClick={() => addComponent()}
        >
          {states.length > 0 ? "Add More" : "Add Counter"}
        </button>
      </div>

      {/* bottom nav */}
      <div className="absolute bottom-0 w-full h-12 bg-lime-600 flex items-center justify-center text-white text-xl">
        {totalCount}
      </div>
    </>
  );
}

export default Counter;
