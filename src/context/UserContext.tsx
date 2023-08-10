import {
  useState,
  createContext,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import { useAuth } from "./AuthContext";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase-config";
import { User } from "firebase/auth";
import { ThreadData, UserData } from "../types";
import Loading from "../components/loading-state/Loading";

interface UserContextType {
  user: User | null;
  userData: null | { user_name: string; image: string };
  currentUserData: null | { user_name: string; image: string };
  userThreads: ThreadData[];
  userFollowsCount: FollowsData | null;
  getUserData: (username: string) => void;
  allUsers: UserData[] | null;
}

const UserContext = createContext<UserContextType>({
  user: null,
  userData: null,
  currentUserData: null,
  userThreads: [],
  userFollowsCount: { followers: [], following: [] } as FollowsData,
  getUserData: () => {},
  allUsers: null,
});

interface UserProviderProps {
  children: ReactNode;
}

interface FollowsData {
  followers: string[];
  following: string[];
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [currentUserData, setCurrentUserData] = useState<UserData | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userThreads, setUserThreads] = useState<ThreadData[]>([]);
  const [userFollowsCount, setUserFollowsCount] = useState<FollowsData | null>(
    null
  );
  const [allUsers, setAllUsers] = useState<UserData[] | null>(null);
  const [userID, setUserID] = useState<string>("");
  const { user } = useAuth();
  const threadsCollection = collection(db, "threads");
  const userCollection = collection(db, "users");

  const getCurrentUserData = async () => {
    try {
      if (user) {
        setLoading(true);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.exists()
          ? (userDoc.data() as { user_name: string; image: string })
          : null;
        setCurrentUserData(userData);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  //TODO: FIX ISSUE WITH NEEDING TO REFRESH EACH CONTEXT TO SEE CURRENT USER DATA

  const getUserThreads = async () => {
    try {
      if (userID) {
        setLoading(true);
        const userThreads = await getDocs(
          query(threadsCollection, where("owner_id", "==", userID))
        );
        const userThreadsData = userThreads.docs.map((doc) =>
          doc.data()
        ) as ThreadData[];

        const threadsWithUserPromises = userThreadsData.map(async (thread) => {
          const userDoc = await getDoc(doc(db, "users", thread.owner_id));
          const userData = userDoc.exists()
            ? (userDoc.data() as { user_name: string; image: string })
            : null;
          return {
            ...thread,
            user: userData,
          };
        });

        const threadsWithUser = await Promise.all(threadsWithUserPromises);
        //@ts-ignore
        setUserThreads(threadsWithUser);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const getUserFollowsCount = async () => {
    try {
      if (user && userID) {
        setLoading(true);
        const followsDocs = await getDoc(doc(db, "follows", userID));
        const followsData = followsDocs.exists()
          ? (followsDocs.data() as { followers: string[]; following: string[] })
          : null;
        setUserFollowsCount(followsData);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const getUserData = async (username: string) => {
    try {
      setLoading(true);
      if (!username) {
        setUserData(null);
        setLoading(false);
        return;
      }
      const aUser = await getDocs(
        query(userCollection, where("user_name", "==", username))
      );

      if (!aUser.empty) {
        const userData = aUser.docs.map((doc) => doc.data()) as UserData[];
        const docID = aUser.docs.map((doc) => doc.id);
        setUserID(docID[0]);
        setUserData(userData[0]);
        setLoading(false);
      } else {
        setUserData(null);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const getAllUsers = async () => {
    const allUsers = await getDocs(userCollection);

    if (!allUsers.empty) {
      const allUsersData = allUsers.docs.map((doc) => doc.data()) as UserData[];
      setAllUsers(allUsersData);
    }
  };

  useEffect(() => {
    getUserFollowsCount();
    getUserThreads();
  }, [userID]);

  useEffect(() => {
    getCurrentUserData();
    getAllUsers();
  }, []);

  const UserProvider = {
    user,
    userData,
    userThreads,
    userFollowsCount,
    currentUserData,
    getUserData,
    loading,
    allUsers,
  };

  return (
    <UserContext.Provider value={UserProvider}>
      {loading ? <Loading /> : children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};

export default UserContext;
