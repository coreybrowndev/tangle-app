import "./threadStyles.scss";
import { ThreadData } from "../../types";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { db } from "../../config/firebase-config";
import {
  addDoc,
  collection,
  getDoc,
  doc,
  updateDoc,
  increment,
  where,
  query,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { Heart, MessageCircle, Repeat, Send } from "react-feather";
import ReactTimeAgo from "react-time-ago";
import ActionMenu from "../action-menu/ActionMenu";
import { useEffect, useState } from "react";
import { NavLink, Navigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

interface ThreadProps {
  thread: ThreadData;
}

TimeAgo.addDefaultLocale(en);

const Thread: React.FC<ThreadProps> = ({ thread }) => {
  const seconds = thread.created_time["seconds"];
  const nanoseconds = thread.created_time["nanoseconds"];
  const timestamp: number = (seconds + nanoseconds / 1000000000) * 1000;
  const date = new Date(timestamp);

  const likesCollection = collection(db, "likes");
  const { getUserData } = useUser();
  const { user } = useUser();

  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [isLikeButtonDisabled, setIsLikedButtonDisabled] =
    useState<boolean>(false);
  const [threadInstance, setThreadInstance] = useState<ThreadData>(thread);

  useEffect(() => {
    checkUserLike();
  }, []);

  const checkUserLike = async () => {
    const userID = user?.uid;

    const likeQuerySnapshot = await getDocs(
      query(
        likesCollection,
        where("thread_id", "==", thread.id),
        where("user_id", "==", userID)
      )
    );

    //If querySnapshot has any documents, user has liked the thread
    setHasLiked(!likeQuerySnapshot.empty);
  };

  const handleNewLike = async () => {
    const userID = user?.uid;

    //Add a new like document to the likes collection
    if (!hasLiked) {
      try {
        setIsLikedButtonDisabled(true);

        await addDoc(likesCollection, {
          thread_id: thread.id,
          user_id: userID,
          timestamp: new Date(),
        });

        setHasLiked(true);

        const docRef = doc(db, "threads", thread.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setThreadInstance(docSnap.data() as ThreadData);
          await updateDoc(docRef, {
            likes_count: increment(1),
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLikedButtonDisabled(false);
      }
    } else {
      //If user has liked thread, then remove like

      try {
        const likeQuerySnapshot = await getDocs(
          query(
            likesCollection,
            where("thread_id", "==", thread.id),
            where("user_id", "==", userID)
          )
        );

        if (!likeQuerySnapshot.empty) {
          //If there is a like document, delete it
          const likeDoc = likeQuerySnapshot.docs[0];
          await deleteDoc(doc(likesCollection, likeDoc.id));

          setHasLiked(false);

          const docRef = doc(db, "threads", thread.id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setThreadInstance(docSnap.data() as ThreadData);
            await updateDoc(docRef, {
              likes_count: increment(-1),
            });
          }
        }
      } catch (err) {
        console.error(err);
      }
    }

    const updatedThread = await fetchUpdatedThread(thread.id);
    if (updatedThread) {
      setThreadInstance(updatedThread);
    }
  };

  const fetchUpdatedThread = async (threadId: string) => {
    try {
      const docRef = doc(db, "threads", threadId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as ThreadData;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUserClick = (username: string) => {
    getUserData(username);
  };

  return (
    <div className={"thread-wrapper"}>
      <div className="left-content">
        <div className="img-wrapper">
          <img src={thread.user["image"]} />
        </div>
        <div className="line"></div>
      </div>
      <div className="thread-container">
        <div className="thread-header-wrapper">
          <NavLink
            to={`/Profile/${thread.user["user_name"]}`}
            onClick={() => handleUserClick(thread.user["user_name"])}
          >
            <strong style={{ textTransform: "lowercase" }}>
              {thread.user["user_name"]}
            </strong>
          </NavLink>
          <div className="thread-action-options">
            <p>{<ReactTimeAgo date={date} locale="en-US" />}</p>
            <ActionMenu thread={thread} />
          </div>
        </div>
        <div className="thread-body">
          <p>{thread.body}</p>

          {thread.image && (
            <img className="imported-thread-image" src={thread.image} />
          )}
        </div>
        <div className="interaction-options">
          <Heart
            onClick={handleNewLike}
            className={`icon heart-icon ${hasLiked ? "liked" : ""}`}
          />
          <MessageCircle className="icon" />
          <Repeat className="icon" />
          <Send className="icon" />
        </div>
        <div className="interaction-status">
          <p>15 replies</p>
          <p>•</p>
          <p>{threadInstance.likes_count} likes</p>
        </div>
      </div>
    </div>
  );
};

export default Thread;
