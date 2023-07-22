import React, { useEffect, useState } from "react";
import Thread from "../components/thread/Thread";
import { db } from "../config/firebase-config";
import { getDocs, collection } from "firebase/firestore";
import { ThreadData } from "../types";

const Feed: React.FC = () => {
  const [threadsList, setThreadsList] = useState<ThreadData[]>([]);

  const threadsCollection = collection(db, "threads");

  useEffect(() => {
    const getThreads = async () => {
      try {
        const data = await getDocs(threadsCollection);
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as ThreadData[];
        console.log(filteredData);
        setThreadsList(filteredData);
      } catch (err) {
        console.error(err);
      }
    };

    getThreads();
  }, []);

  return (
    <div className="main--container">
      {threadsList.map((thread) => (
        <Thread key={thread.id} thread={thread} />
      ))}
    </div>
  );
};

export default Feed;
