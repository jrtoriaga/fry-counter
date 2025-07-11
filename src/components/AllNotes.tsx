import { Link } from "react-router-dom";

export default function AllNotes() {
  return (
    <div className="p-4 flex gap-4 flex-col">
      {/* List of notes */}
      <div className="p-4 border rounded-md border-gray-300 text-gray-700">
        Note 1
      </div>

      <div className="p-4 border rounded-md border-gray-300 text-gray-700">
        Note 1
      </div>

      {/* Fab */}
      <div className="fixed bottom-20 right-8 z-10">
        <Link to='/counter'>Counter</Link>
      </div>
    </div>
  );
}
