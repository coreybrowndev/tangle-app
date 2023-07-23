import React, { useContext, useEffect, useState } from "react";
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
import { ThreadContext } from "../context/ThreadContext";

const Feed: React.FC = () => {
  const { threadsList } = useContext(ThreadContext);

  return (
    <div className="main--container">
      <NewThreadForm />
      {threadsList.map((thread) => (
        <Thread key={thread.id} thread={thread} />
      ))}
    </div>
  );
};

export default Feed;
