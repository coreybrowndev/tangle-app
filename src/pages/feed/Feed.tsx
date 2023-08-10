import React, { useContext, useEffect, useState } from "react";
import Thread from "../../components/thread/Thread";
import NewThreadForm from "../../components/new-thread-form/NewThreadForm";
import { ThreadContext } from "../../context/ThreadContext";
import { useAuth } from "../../context/AuthContext";
import SideBar from "../../components/side-bar/SideBar";
import AsidePanel from "../../components/aside-panel/AsidePanel";

const Feed: React.FC = () => {
  const { threadsList } = useContext(ThreadContext);

  return (
    <div className="main--wrapper">
      <SideBar />
      <div className="main--container">
        <NewThreadForm />
        {threadsList.map((thread) => (
          <Thread key={thread.id} thread={thread} />
        ))}
      </div>
      <AsidePanel />
    </div>
  );
};

export default Feed;
