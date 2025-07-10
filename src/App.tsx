import { useCallback, useEffect, useState } from "react";
import "./App.css";
import Counter from "./components/Counter";
import { calculateTotalFry } from "./lib/utils";

function App() {
  const [states, setStates] = useState<
    { idx: number; count: number; text: string }[]
  >([]);

  const [totalCount, setTotalCount] = useState(0);

  const addComponent = useCallback(() => {
    setStates((prev) => [
      ...prev,
      {
        idx: prev.length,
        count: 0,
        text: (prev.length + 1) as unknown as string,
      },
    ]);
  }, []);

  useEffect(() => {
    setTotalCount(calculateTotalFry(states.map(({idx, count})=> ({idx, count}))))
  }, [states])

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
      <nav className="w-full h-12 bg-lime-600"></nav>
      {/* body */}
      <div className="px-4 py-4 max-h-[calc(100vh-96px)] overflow-scroll scrollbar-none">
        {states.map((item) => (
          <Counter
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
          {states.length > 0 ? 'Add More': 'Add Counter'}
        </button>
      </div>

      {/* bottom nav */}
      <div className="absolute bottom-0 w-full h-12 bg-lime-600 flex items-center justify-center text-white text-xl">
        {totalCount}
      </div>
    </>
  );
}

export default App;
