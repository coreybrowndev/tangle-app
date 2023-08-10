import React, { useContext, useState } from "react";
import "./actionMenuStyles.scss";
import { MoreHorizontal, Trash2 } from "react-feather";
import { ThreadContext } from "../../context/ThreadContext";
import { collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import { ThreadData } from "../../types";
import { useUser } from "../../context/UserContext";

interface ActionMenuProps {
  thread: ThreadData;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ thread }) => {
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const { setThreadsList } = useContext(ThreadContext);

  const threadsCollection = collection(db, "threads");
  const { user } = useUser();

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleThreadDeletion = async (threadId: string) => {
    try {
      await deleteDoc(doc(threadsCollection, threadId));

      setThreadsList((prevState) =>
        prevState.filter((item) => item.id !== thread.id)
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="three-dot-action-menu-wrapper">
      <MoreHorizontal onClick={toggleMenu} />
      {menuVisible && (
        <ul className="menu-list">
          <li>
            <button>Get embeded code</button>
          </li>
          <li>
            {thread.owner_id === user?.uid ? (
              <button onClick={() => handleThreadDeletion(thread.id)}>
                <Trash2 style={{ color: "red" }} />
                <span>Delete</span>
              </button>
            ) : (
              <button>Report</button>
            )}
          </li>
        </ul>
      )}
    </div>
  );
};

export default ActionMenu;
