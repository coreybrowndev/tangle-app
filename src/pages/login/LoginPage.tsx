import {
  ChangeEvent,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import "./loginPageStyles.scss";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { auth } from "../../config/firebase-config";
import { User, onAuthStateChanged } from "firebase/auth";

const LoginPage = () => {
  const loginForm = useRef<HTMLFormElement | null>(null);
  const [userInfo, setUser] = useState<User | null>(null);
  const { user, logoutUser, loginUser } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: ChangeEvent) => {};

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const email = loginForm.current?.email.value;
    const password = loginForm.current?.password.value;

    loginUser({ email, password });
  };

  onAuthStateChanged(auth, (currentUser: User | null) => {
    setUser(currentUser);
    if (currentUser) {
      navigate("/");
    }
  });

  return (
    <div className="login-page-wrapper">
      <div className="form-wrapper">
        <form onSubmit={handleSubmit} ref={loginForm}>
          <div className="field-wrapper">
            <label htmlFor="email">Email: </label>
            <input
              required
              type="email"
              name="email"
              placeholder="Enter your email..."
              onChange={(e) => {
                handleInputChange(e);
              }}
            />
          </div>

          <div className="field-wrapper">
            <label htmlFor="password">Password: </label>
            <input
              required
              type="password"
              name="password"
              onChange={(e) => {
                handleInputChange(e);
              }}
            />
          </div>

          <div className="button-wrapper">
            <input type="submit" name="Login" />
          </div>
        </form>
      </div>

      <p>
        Don't have an account? <Link to={"/register"}>Register</Link>{" "}
      </p>

      <p>Current logged in User: </p>
      {userInfo?.email}

      <button onClick={logoutUser}>Logout</button>
    </div>
  );
};

export default LoginPage;
