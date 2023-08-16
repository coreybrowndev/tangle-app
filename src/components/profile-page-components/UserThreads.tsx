import "./userThreadsStyles.scss";
import { useUser } from "../../context/UserContext";
import Thread from "../thread/Thread";
import { useThread } from "../../context/ThreadContext";

const UserThreads = () => {
  const { userID } = useUser();
  const { threadsList } = useThread();

  //Render threads specific to a user
  const filteredThreads = threadsList.filter(
    (thread) => thread.owner_id === userID
  );

  return (
    <div className="user-threads-container">
      {filteredThreads.map((thread) => (
        <Thread key={thread.id} thread={thread} />
      ))}
    </div>
  );
};

export default UserThreads;
