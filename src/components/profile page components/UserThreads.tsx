import React from "react";
import "./userThreadsStyles.scss";
import { useUser } from "../../context/UserContext";
import Thread from "../thread/Thread";

const UserThreads = () => {
  const { userThreads } = useUser();

  return (
    <div className="user-threads-container">
      {userThreads.map((thread) => (
        <Thread key={thread.id} thread={thread} />
      ))}
    </div>
  );
};

export default UserThreads;
