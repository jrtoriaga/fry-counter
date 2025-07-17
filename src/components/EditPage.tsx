import { useCallback, useEffect, useState } from "react";
import { deleteNoteById, getNoteById, saveNote, type Note } from "../lib/db";
import { Link, useNavigate } from "react-router-dom";
import { formatDate } from "../lib/utils";

export default function EditPage() {
  const [title, setTitle] = useState<string>("");
  const [seller, setSeller] = useState<string>("");
  const [note, setNote] = useState<Note>();

  const [showPopup, setShowPopup] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [isDeleting, setDeleting] = useState(false);

  const navigate = useNavigate();

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

  // All hooks first
  const deleteHandler = useCallback(async () => {
    if (note?.id) {
      console.log("Deleting note: " + note.id);
      await deleteNoteById(note.id);
      console.log("Note deleted.");
      navigate("/");
    }
  }, [note?.id]);

  if (!note) {
    return null;
  }

  //   TODO: Show a saved notification of sort when it's saved. A pop up or something
  const saveNoteHandler = () => {
    const newNote: Note = { ...note, seller, title };

    const hasChanged = note.seller !== seller || note.title !== title;

    if (!hasChanged) return; // skip if nothing changed

    setSaving(true);

    (async () => {
      saveNote(newNote).then((newNote) => {
        if (newNote) {
          setNote(newNote)
          setShowPopup(true);

          setSaving(false);
          // navigate(`/counter?noteId=${newNote.id}`);
        }
      });
    })();
  };

  return (
    <>
      <nav className="w-full bg-lime-600 flex items-center px-4 text-white h-[66px] gap-2">

        <Link to={'/counter?noteId=' + note.id}>
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
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
        </svg>

            </Link>
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
            d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z"
          />
        </svg>
      </nav>

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

        <div className="relative w-1/2">
          <button
            className={`px-4 py-3 text-white bg-red-800 active:bg-red-900 w-full ${
              isDeleting && "hidden"
            }`}
            onClick={() => setDeleting(true)}
            disabled={isDeleting}
          >
            Delete Note
          </button>

          <div
            className={`bg-green-600 h-full w-full absolute left-0 top-0 flex items-center ${
              isDeleting ? "block" : "hidden"
            }`}
          >
            <span className="-top-6 absolute text-gray-600">Are you sure?</span>
            <button
              className="w-1/2 h-full text-white bg-red-800 active:bg-red-900"
              onClick={deleteHandler}
            >
              Yes
            </button>
            <button
              className="w-1/2 h-full text-white bg-lime-600 active:bg-lime-700"
              onClick={() => setDeleting(false)}
            >
              No
            </button>
          </div>
        </div>
      </div>

      {/* Note summary */}
      <div className="mt-8 p-4 text-gray-600 gap-2 flex flex-col border mx-4 border-gray-300">
        <span className="font-semibold ">Note Info</span>

        <div className="flex">id: {note.id}</div>

        {/* Created Date */}
        <div className=" flex justify-between">
          <span className="w-1/2">Created Date:</span>

          <span className="w-1/2 text-end">{note.createdDate ? formatDate(note.createdDate): ''}</span>
        </div>

        {/* Modified Date */}
        <div className=" flex justify-between">
          <span className="w-1/2">Last Modified Date:</span>

          <span className="w-1/2 text-end">{note.modifiedDate ? formatDate(note.modifiedDate): ''}</span>
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
