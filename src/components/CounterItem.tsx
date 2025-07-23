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
    <div className="flex items-center gap-4 max-h-[52px]">
      <div className="rounded-full text-xl aspect-square bg-white/80 font-medium h-[48px] min-w-[48px] flex items-center justify-center">
        {idx}

        {/* {lastItemHandler && (
          <button
            className="absolute -top-1 -right-1 bg-red-600 border-red-800 rounded-full text-xs text-white border px-1"
            onClick={() => lastItemHandler()}
          >
            x
          </button>
        )} */}
      </div>

      <div className="flex items-center w-full justify-between bg-white/80 rounded-2xl py-1 px-3">
        <button
          className="rounded-full aspect-square w-[40px] text-white bg-blue-500 font-medium active:bg-blue-600"
          onClick={() => handleClick(1)}
        >
          +
        </button>
        <span className="py-2 flex-grow px-4 text-xl flex-1 text-gray-900 text-center font-medium">
          <span className="relative">
          {count}

          {lastItemHandler && (
            <button
              className="absolute -top-2 left-4 bg-red-500 rounded-full text-xs text-white border px-1"
              onClick={() => lastItemHandler()}
            >
              x
            </button>
        )}
          </span>

        </span>
        <button
          className="rounded-full aspect-square w-[40px] text-2xl text-white bg-red-500 font-medium active:bg-red-600 disabled:bg-red-300"
          disabled={count === 0}
          onClick={() => handleClick(-1)}
        >
          -
        </button>
      </div>
    </div>
  );
}
