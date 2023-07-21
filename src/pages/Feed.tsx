import React from "react";
import Thread from "../components/thread/Thread";

const Feed: React.FC = () => {
  return (
    <div className="main--container">
      <Thread />
      <Thread />
      <Thread />
    </div>
  );
};

export default Feed;
