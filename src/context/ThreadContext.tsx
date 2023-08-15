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
  addDoc,
  updateDoc,
  increment,
  where,
  deleteDoc,
} from "firebase/firestore";
import { useUser } from "./UserContext";
import Loading from "../components/loading-state/Loading";

interface ThreadContextType {
  threadsList: ThreadData[];
  setThreadsList: React.Dispatch<React.SetStateAction<ThreadData[]>>;
  getThreads: () => Promise<void>;
  handleThreadLike: (thread: ThreadData) => void;
  hasLiked: boolean;
}

export const ThreadContext = createContext<ThreadContextType>({
  threadsList: [],
  setThreadsList: () => {},
  getThreads: async () => {},
  handleThreadLike: () => {},
  hasLiked: false,
});

interface ThreadProviderProps {
  children: ReactNode;
}

export const ThreadProvider = ({ children }: ThreadProviderProps) => {
  const [threadsList, setThreadsList] = useState<ThreadData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const threadsCollection = collection(db, "threads");
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [isLikeButtonDisabled, setIsLikedButtonDisabled] =
    useState<boolean>(false);
  const { user } = useUser();

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

      //Update each thread to include its own hasLiked property
      const threadWithHasLiked = threadsWithUser.map((thread) => ({
        ...thread,
        has_liked: thread.liked_by?.includes(user?.uid as string) || false,
      }));

      //@ts-ignore
      setThreadsList(threadWithHasLiked);
      setLoading(false);

      // Check if the user has liked the thread
      threadWithHasLiked.forEach((thread) => {
        if (thread.liked_by && user) {
          setHasLiked(thread.liked_by.includes(user.uid));
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleThreadLike = async (thread: ThreadData) => {
    console.log("THis thread was liked", thread.id);
    const userID = user?.uid;

    if (userID) {
      try {
        const threadRef = doc(db, "threads", thread.id);
        const threadSnapshot = await getDoc(threadRef);

        if (threadSnapshot.exists()) {
          const likedBy = threadSnapshot.data()?.liked_by as string[];
          const hasLikedThread = likedBy.includes(userID);

          if (!hasLikedThread) {
            likedBy.push(userID);
            await updateDoc(threadRef, {
              liked_by: likedBy,
              likes_count: increment(1),
            });
            setHasLiked(true);

            //Update the users liked post list
            const userRef = doc(db, "users", userID);
            const userSnapshot = await getDoc(userRef);

            if (userSnapshot.exists()) {
              const likedPosts = userSnapshot.data()?.liked_posts as string[];

              if (!likedPosts.includes(thread.id)) {
                likedPosts.push(thread.id);
                await updateDoc(userRef, {
                  liked_posts: likedPosts,
                });
              }
            }
          } else {
            //Unlike the thread
            const updatedLikedBy = likedBy.filter((id) => id !== userID);
            await updateDoc(threadRef, {
              liked_by: updatedLikedBy,
              likes_count: increment(-1),
            });

            //Update the users liked post list
            const userRef = doc(db, "users", userID);
            const userSnapshot = await getDoc(userRef);

            if (userSnapshot.exists()) {
              const likedPosts = userSnapshot.data()?.liked_posts as string[];
              const updatedLikedPosts = likedPosts.filter(
                (id) => id !== thread.id
              );
              await updateDoc(userRef, {
                liked_posts: updatedLikedPosts,
              });
            }

            setHasLiked(false);
          }

          const updatedThreadsList = threadsList.map((t) =>
            t.id === thread.id
              ? {
                  ...t,
                  has_liked: !hasLikedThread,
                  likes_count:
                    hasLikedThread == true
                      ? t.likes_count - 1
                      : t.likes_count + 1,
                }
              : t
          );

          setThreadsList(updatedThreadsList);
        }
      } catch (err) {
        throw err;
      }
    } else {
      return;
    }
  };

  const ThreadProvider = {
    threadsList,
    setThreadsList,
    getThreads,
    handleThreadLike,
    hasLiked,
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
