import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Counter from "./components/Counter";
import AllNotes from "./components/AllNotes";

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<AllNotes />} />
          <Route path="/counter" element={<Counter />} />
      </Routes>
    </Router>
  );
}

export default App;
