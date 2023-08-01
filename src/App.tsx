import "./index.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Feed from "./pages/feed/Feed";
import { ThreadProvider } from "./context/ThreadContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/login/LoginPage";
import { UserProvider, useUser } from "./context/UserContext";
import CurrentUserProfilePage from "./pages/profile/CurrentUserProfilePage.tsx";
function App() {
  const { user } = useAuth();

  // console.log("USER DATA: ", userData);

  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <ThreadProvider>
            <Routes>
              <Route path={`/Profile`} element={<CurrentUserProfilePage />} />
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
