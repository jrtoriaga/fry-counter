import { useEffect, useState } from "react";
import { getNoteById, saveNote, type Note } from "../lib/db";
import { useNavigate } from "react-router-dom";

export default function EditPage() {
  const [title, setTitle] = useState<string>("");
  const [seller, setSeller] = useState<string>("");
  const [note, setNote] = useState<Note>();

  const [showPopup, setShowPopup] = useState(false);
  const [isSaving, setSaving] = useState(false);


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("noteId");
    let parsed = Number(raw);

    if (!isNaN(parsed)) {
      (async () => {
        const note = await getNoteById(parsed);
        if (note) {
          setNote(note);
          setTitle(note.title || "");
          setSeller(note.seller || "");
        } else {
          console.error("No note found.");
        }
      })();
    }
  }, []);

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => setShowPopup(false), 3000);
      return () => clearTimeout(timer); // cleanup
    }
  }, [showPopup]);

  if (!note) {
    return "No note found";
  } else {
  }

  //   TODO: Show a saved notification of sort when it's saved. A pop up or something
  const saveNoteHandler = () => {
    const newNote: Note = { ...note, seller, title };

    const hasChanged = note?.seller !== seller || note?.title !== title;

    if (!hasChanged) return; // skip if nothing changed

    setSaving(true);

    (async () => {
      saveNote(newNote).then((newNote) => {
        if (newNote) {
          setShowPopup(true);

          setSaving(false);
          // navigate(`/counter?noteId=${newNote.id}`);
        }
      });
    })();
  };

  return (
    <>
      <nav className="w-full bg-lime-600 flex items-center px-4 text-white h-[66px]"></nav>

      {/* title input */}
      <div className="flex flex-col p-4 mt-6 font-semibold gap-1">
        <label htmlFor="title" className="text-xs text-gray-600">
          Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border px-4 py-3 border-gray-300 focus-visible:outline-0 font-normal"
          placeholder="Note Title"
        />
      </div>

      {/* seller input */}
      <div className="flex flex-col p-4 font-semibold gap-1">
        <label htmlFor="seller" className="text-xs text-gray-600">
          Seller
        </label>
        <input
          type="text"
          name="title"
          id="seller"
          value={seller}
          onChange={(e) => setSeller(e.target.value)}
          className="border px-4 py-3 border-gray-300 focus-visible:outline-0 font-normal"
          placeholder="Seller Name"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-8 px-4 mt-4">
        <button
          className="px-4 py-3 text-white bg-lime-600 active:bg-lime-700 w-1/2 disabled:bg-lime-700"
          onClick={saveNoteHandler}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Note"}
        </button>
        <button className="px-4 py-3 text-white bg-red-800 active:bg-red-900 w-1/2">
          Delete Note
        </button>
      </div>

      {/* Note summary */}
      <div className="mt-8 p-4 text-gray-600 gap-2 flex flex-col border mx-4 border-gray-300">
        <span className="font-semibold ">Note Info</span>

        <div className="flex">id: {note.id}</div>

        {/* Created Date */}
        <div className=" flex justify-between">
          <span className="w-1/2">Created Date:</span>

          <span className="w-1/2 text-end">Jan 21, 2025 6:04 PM</span>
        </div>

        {/* Modified Date */}
        <div className=" flex justify-between">
          <span className="w-1/2">Last Modified Date:</span>

          <span className="w-1/2 text-end">Jan 21, 2025 6:04 PM</span>
        </div>
      </div>

      {/* Pop up */}
      <div
        className={`fixed left-1/2 bottom-8 duration-300 transition-opacity w-3/4  transform -translate-x-1/2 text-center py-2 text-gray-600 ease-in-out
          ${showPopup ? " opacity-100" : "opacity-0"}
          `}
      >
        Note has been saved.
      </div>
    </>
  );
}
