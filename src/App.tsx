import "./index.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Feed from "./pages/Feed";
import { ThreadProvider } from "./context/ThreadContext";

function App() {
  return (
    <ThreadProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Feed />} />
        </Routes>
      </Router>
    </ThreadProvider>
  );
}

export default App;
