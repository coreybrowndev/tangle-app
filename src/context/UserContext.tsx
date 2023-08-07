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
import { set } from "firebase/database";

interface UserContextType {
  user: User | null;
  userData: null | { user_name: string; image: string };
  currentUserData: null | { user_name: string; image: string };
  userThreads: ThreadData[];
  userFollowsCount: FollowsData | null;
  getUserData: (username: string) => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  userData: null,
  currentUserData: null,
  userThreads: [],
  userFollowsCount: { followers: [], following: [] } as FollowsData,
  getUserData: () => {},
});

interface UserProviderProps {
  children: ReactNode;
}

interface FollowsData {
  followers: string[];
  following: string[];
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [currentUserData, setCurrentUserData] = useState<UserData | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userThreads, setUserThreads] = useState<ThreadData[]>([]);
  const [userFollowsCount, setUserFollowsCount] = useState<FollowsData | null>(
    null
  );
  const [userID, setUserID] = useState<string>("");

  const { user } = useAuth();

  const threadsCollection = collection(db, "threads");
  const userCollection = collection(db, "users");

  const getCurrentUserData = async () => {
    try {
      if (user) {
        // setLoading(false);
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

  //Fix ISSUE WITH NEEDING TO REFRESH EACH CONTEXT TO SEE CURRENT USER DATA

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
    //Change this to get ANY users follows count instead of the current user
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
    //Get the data of ANY user that was clicked on
    try {
      const aUser = await getDocs(
        query(userCollection, where("user_name", "==", username))
      );

      if (!aUser.empty) {
        const userData = aUser.docs.map((doc) => doc.data()) as UserData[];
        const docID = aUser.docs.map((doc) => doc.id);
        setUserID(docID[0]);
        setUserData(userData[0]);
      } else {
        setUserData(null);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserFollowsCount();
    getUserThreads();
  }, [userID]);

  useEffect(() => {
    getCurrentUserData();
  }, []);

  const UserProvider = {
    user,
    userData,
    userThreads,
    userFollowsCount,
    currentUserData,
    getUserData,
    loading,
  };

  return (
    <UserContext.Provider value={UserProvider}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};

export default UserContext;
