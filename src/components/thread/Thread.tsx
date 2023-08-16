import "./threadStyles.scss";
import { ThreadData } from "../../types";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { Heart, MessageCircle, Repeat, Send } from "react-feather";
import ReactTimeAgo from "react-time-ago";
import ActionMenu from "../action-menu/ActionMenu";
import { NavLink } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useThread } from "../../context/ThreadContext";

interface ThreadProps {
  thread: ThreadData;
}

TimeAgo.addDefaultLocale(en);

const Thread: React.FC<ThreadProps> = ({ thread }) => {
  const seconds = thread.created_time["seconds"];
  const nanoseconds = thread.created_time["nanoseconds"];
  const timestamp: number = (seconds + nanoseconds / 1000000000) * 1000;
  const date = new Date(timestamp);
  const { currentUserData, getUserData } = useUser();

  const { handleThreadLike } = useThread();

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
            to={
              thread.user["user_name"] == currentUserData?.user_name
                ? `/Profile/you`
                : `/Profile/${thread.user["user_name"]}`
            }
            onClick={() =>
              thread.user["user_name"] && getUserData(thread.user["user_name"])
            }
          >
            <div className="user-flex-wrapper">
              <strong style={{ textTransform: "lowercase" }}>
                {thread.user["user_name"]}
              </strong>

              {thread.user["user_name"] === currentUserData?.user_name ? (
                <small>
                  {currentUserData.first_name + " " + currentUserData.last_name}
                </small>
              ) : (
                <small>Tangled since {2023} </small>
              )}
            </div>
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
            onClick={() => handleThreadLike(thread)}
            className={`icon heart-icon ${thread.has_liked ? "liked" : ""}`}
          />
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
