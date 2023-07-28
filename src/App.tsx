import "./index.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Feed from "./pages/feed/Feed";
import { ThreadProvider } from "./context/ThreadContext";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/login/LoginPage";
import ProfilePage from "./pages/profile/ProfilePage";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <ThreadProvider>
            <Routes>
              <Route path="/Profile" element={<ProfilePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<Feed />} />
            </Routes>
          </ThreadProvider>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
