import "./index.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Feed from "./pages/Feed";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Feed />} />
      </Routes>
    </Router>
  );
}

export default App;
