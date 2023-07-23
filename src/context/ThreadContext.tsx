import { ReactNode, createContext, useEffect, useState } from "react";
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

  const threadsCollection = collection(db, "threads");

  useEffect(() => {
    getThreads();
  }, []);

  useEffect(() => {
    console.log("THREAD LIST!", threadsList);
  }, []);

  const getThreads = async () => {
    try {
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
      {children}
    </ThreadContext.Provider>
  );
};
