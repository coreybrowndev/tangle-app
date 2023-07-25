import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { User, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase-config";

interface AuthContextType {
  user: {} | null;
  loginUser: (userInfo: { email: string; password: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loginUser: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setLoading(false);
  }, []);

  const loginUser = async (userInfo: { email: string; password: string }) => {
    console.log("User INFO: ", userInfo);

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

  const AuthProvider = {
    user,
    loginUser,
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
