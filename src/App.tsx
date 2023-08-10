import "./index.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Feed from "./pages/feed/Feed";
import { ThreadProvider } from "./context/ThreadContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/login/LoginPage";
import { UserProvider, useUser } from "./context/UserContext";
import UserProfilePage from "./pages/profile/UserProfilePage.tsx";
import SideBar from "./components/side-bar/SideBar.tsx";
import CurrentUserProfile from "./pages/profile/current-user/CurrentUserProfile.tsx";
function App() {
  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <ThreadProvider>
            <Routes>
              <Route path="/Profile/you" element={<CurrentUserProfile />} />
              <Route
                path={`/Profile/:user_name`}
                element={<UserProfilePage />}
              />
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
