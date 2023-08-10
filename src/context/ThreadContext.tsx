import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { ThreadData } from "../types";
import { db } from "../config/firebase-config";
import {
  getDocs,
  collection,
  doc,
  getDoc,
  orderBy,
  query,
} from "firebase/firestore";
import { useUser } from "./UserContext";
import Loading from "../components/loading-state/Loading";
import { set } from "firebase/database";

interface ThreadContextType {
  threadsList: ThreadData[];
  setThreadsList: React.Dispatch<React.SetStateAction<ThreadData[]>>;
  getThreads: () => Promise<void>;
}

export const ThreadContext = createContext<ThreadContextType>({
  threadsList: [],
  setThreadsList: () => {},
  getThreads: async () => {},
});

interface ThreadProviderProps {
  children: ReactNode;
}

export const ThreadProvider = ({ children }: ThreadProviderProps) => {
  const [threadsList, setThreadsList] = useState<ThreadData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isThreadOwner, setIsThreadOwner] = useState<boolean>(false);
  const threadsCollection = collection(db, "threads");

  useEffect(() => {
    getThreads();
    setLoading(false);
  }, []);

  const getThreads = async () => {
    try {
      setLoading(true);
      const getDataInDescendingOrder = query(
        threadsCollection,
        orderBy("created_time", "desc")
      );
      const data = await getDocs(getDataInDescendingOrder);
      const threadsData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as ThreadData[];

      //Fetch user INFO for each Thread
      const threadsWithUserPromises = threadsData.map(async (thread) => {
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
      setThreadsList(threadsWithUser);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const ThreadProvider = {
    threadsList,
    setThreadsList,
    getThreads,
  };

  return (
    <ThreadContext.Provider value={ThreadProvider}>
      {loading ? <Loading /> : children}
    </ThreadContext.Provider>
  );
};

export const useThread = () => {
  return useContext(ThreadContext);
};
