import "./threadStyles.scss";
import { ThreadData } from "../../types";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import {
  MoreHorizontal,
  Heart,
  MessageCircle,
  Repeat,
  Send,
} from "react-feather";
import ReactTimeAgo from "react-time-ago";
import ActionMenu from "../action menu/ActionMenu";

interface ThreadProps {
  thread: ThreadData;
}

TimeAgo.addDefaultLocale(en);

const Thread: React.FC<ThreadProps> = ({ thread }) => {
  const seconds = thread.created_time["seconds"];
  const nanoseconds = thread.created_time["nanoseconds"];
  const timestamp: number = (seconds + nanoseconds / 1000000000) * 1000;
  const date = new Date(timestamp);

  return (
    <div className={"thread-wrapper"}>
      <div className="img-wrapper">
        <img src={thread.user["image"]} />
      </div>
      <div className="thread-container">
        <div className="thread-header-wrapper">
          <strong>{thread.user["user_name"]}</strong>
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
          <Heart className="icon" />
          <MessageCircle className="icon" />
          <Repeat className="icon" />
          <Send className="icon" />
        </div>
        <div className="interaction-status">
          <p>15 replies</p>
          <p>•</p>
          <p>{thread.likes_count} likes</p>
        </div>
      </div>
    </div>
  );
};

export default Thread;
