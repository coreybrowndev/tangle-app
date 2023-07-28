import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "../config/firebase-config";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  loginUser: (userInfo: { email: string; password: string }) => Promise<void>;
  logoutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loginUser: async () => {},
  logoutUser: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginUser = async (userInfo: { email: string; password: string }) => {
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        userInfo.email,
        userInfo.password
      );
      console.log(user);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const logoutUser = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const AuthProvider = {
    user,
    loginUser,
    logoutUser,
  };

  return (
    <AuthContext.Provider value={AuthProvider}>
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
