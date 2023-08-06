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

  const { user } = useAuth();

  const threadsCollection = collection(db, "threads");
  const userCollection = collection(db, "users");

  const displayCurrentUser = async () => {
    try {
      if (user) {
        setLoading(false);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.exists()
          ? (userDoc.data() as { user_name: string; image: string })
          : null;
        setCurrentUserData(userData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  //Fix ISSUE WITH NEEDING TO REFRESH EACH CONTEXT TO SEE CURRENT USER DATA

  const getUserThreads = async () => {
    try {
      //Change this function to grab the threads of ANY user instead of the current user.
      if (user) {
        const userThreads = await getDocs(
          query(threadsCollection, where("owner_id", "==", user.uid))
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
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getUserFollowsCount = async () => {
    //Change this to get ANY users follows count instead of the current user
    try {
      if (user) {
        const followsDocs = await getDoc(doc(db, "follows", user.uid));
        const followsData = followsDocs.exists()
          ? (followsDocs.data() as { followers: string[]; following: string[] })
          : null;
        setUserFollowsCount(followsData);
      }
    } catch (err) {
      console.error(err);
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
        setUserData(userData[0]);
      } else {
        setUserData(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getUserThreads();

    //RESOLVE ISSUE WITH NEEDING TO REFRESH EACH CONTEXT TO SEE CURRENT USER DATA
    getUserFollowsCount();
  }, []);

  useEffect(() => {
    displayCurrentUser();
  }, []);

  const UserProvider = {
    user,
    userData,
    userThreads,
    userFollowsCount,
    currentUserData,
    getUserData,
  };

  return (
    <UserContext.Provider value={UserProvider}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};

export default UserContext;
