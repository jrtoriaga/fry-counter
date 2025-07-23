import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Counter from "./components/Counter";
import AllNotes from "./components/AllNotes";
import EditPage from "./components/EditPage";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<Layout />}>
          <Route index element={<AllNotes />} />
          <Route path="/counter" element={<Counter />} />
          <Route path="/edit" element={<EditPage />} />
          </Route>

      </Routes>
    </Router>
  );
}

export default App;
