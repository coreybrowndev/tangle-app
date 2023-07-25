import "./index.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Feed from "./pages/feed/Feed";
import { ThreadProvider } from "./context/ThreadContext";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/login/LoginPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThreadProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Feed />} />
          </Routes>
        </ThreadProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
