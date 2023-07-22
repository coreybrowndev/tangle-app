import React, { useEffect, useState } from "react";
import Thread from "../components/thread/Thread";
import NewThreadForm from "../components/new thread form/NewThreadForm";
import { db } from "../config/firebase-config";
import {
  getDocs,
  collection,
  doc,
  getDoc,
  orderBy,
  query,
} from "firebase/firestore";
import { ThreadData } from "../types";

const Feed: React.FC = () => {
  const [threadsList, setThreadsList] = useState<ThreadData[]>([]);

  const threadsCollection = collection(db, "threads");

  useEffect(() => {
    getThreads();
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
          ? (userDoc.data() as { user_name: string })
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

  return (
    <div className="main--container">
      <NewThreadForm renderThreads={getThreads} />
      {threadsList.map((thread) => (
        <Thread key={thread.id} thread={thread} />
      ))}
    </div>
  );
};

export default Feed;
