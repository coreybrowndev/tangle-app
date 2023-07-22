import React from "react";
import "./threadStyles.scss";
import { ThreadData } from "../../types";

import {
  MoreHorizontal,
  Heart,
  MessageCircle,
  Repeat,
  Send,
} from "react-feather";

interface ThreadProps {
  thread: ThreadData;
}

const Thread: React.FC<ThreadProps> = ({ thread }) => {
  return (
    <div className={"thread-wrapper"}>
      <div className="img-wrapper">
        <img src="https://avatars.githubusercontent.com/u/100534355?s=400&u=1f756db747d8b9ad45cdbd59558429f5dab85213&v=4" />
      </div>
      <div className="thread-container">
        <div className="thread-header-wrapper">
          <strong>{thread.owner_id}</strong>
          <div className="thread-action-options">
            <p>5h</p>
            <MoreHorizontal />
          </div>
        </div>
        <div className="thread-body">
          <p>{thread.body}</p>
        </div>
        <div className="interaction-options">
          <Heart className="icon" />
          <MessageCircle className="icon" />
          <Repeat className="icon" />
          <Send className="icon" />
        </div>
        <div className="interaction-status">
          <p>5 replies</p>
          <p>•</p>
          <p>15 likes</p>
        </div>
      </div>
    </div>
  );
};

export default Thread;
