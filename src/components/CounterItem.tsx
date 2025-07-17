import { useCallback } from "react";

// Remove the arguments once you figure out how to properly implement this
export default function CounterItem({
  handler,
  idx,
  count,
  lastItemHandler,
}: {
  handler: (updater: (prev: number) => number) => void;
  idx: number;
  count: number;
  lastItemHandler?: () => void;
}) {
  // const [count, setCount] = useState(0);

  const handleClick = useCallback((increase: number) => {
    // setCount((prev) => {
    //   if (prev + increase < 0) {
    //     return 0;
    //   } else {
    //     return prev + increase;
    //   }
    // });
    handler((prev) => {
      const next = prev + increase;
      return next < 0 ? 0 : next;
    });
  }, []);

  return (
    <div className="flex items-center py-4 gap-4">
      <div className="py-2 px-4 text-2xl bg-cyan-400 text-gray-900 font-medium relative">
        {idx}

        {lastItemHandler && (
          <button
            className="absolute -top-1 -right-1 bg-red-600 border-red-800 rounded-full text-xs text-white border px-1"
            onClick={() => lastItemHandler()}
          >
            x
          </button>
        )}
      </div>

      <button
        className="py-2 px-4 text-2xl bg-lime-400 text-gray-900 font-medium active:bg-lime-500"
        onClick={() => handleClick(1)}
      >
        +
      </button>
      <span className="py-2 px-4 text-2xl flex-1 text-gray-900 text-center font-medium border border-dashed">
        {count}
      </span>
      <button
        className="py-2 px-4 text-2xl bg-rose-400 text-gray-900 font-medium active:bg-rose-500 disabled:bg-rose-100"
        disabled={count === 0}
        onClick={() => handleClick(-1)}
      >
        -
      </button>
    </div>
  );
}
