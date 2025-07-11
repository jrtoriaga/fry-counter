import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Counter from "./components/Counter";
import AllNotes from "./components/AllNotes";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<AllNotes />} />
          <Route path="/counter" element={<Counter />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
