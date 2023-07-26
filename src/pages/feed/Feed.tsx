import React, { useContext, useEffect, useState } from "react";
import Thread from "../../components/thread/Thread";
import NewThreadForm from "../../components/new thread form/NewThreadForm";
import { db } from "../../config/firebase-config";
import {
  getDocs,
  collection,
  doc,
  getDoc,
  orderBy,
  query,
} from "firebase/firestore";
import { ThreadData } from "../../types";
import { ThreadContext } from "../../context/ThreadContext";
import { useAuth } from "../../context/AuthContext";

const Feed: React.FC = () => {
  const { threadsList } = useContext(ThreadContext);
  const { logoutUser } = useAuth();

  return (
    <div className="main--container">
      <button onClick={logoutUser}>LOGOUT</button>
      <NewThreadForm />
      {threadsList.map((thread) => (
        <Thread key={thread.id} thread={thread} />
      ))}
    </div>
  );
};

export default Feed;
