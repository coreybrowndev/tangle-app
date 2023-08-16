import React from "react";
import UserDetails from "../user-details/UserDetails";
import "./suggestedPanelStyles.scss";
import { useUser } from "../../context/UserContext";

const SuggestedPanel = () => {
  const { currentUserData, allUsers } = useUser();
  const filteredUsers = allUsers?.filter(
    (user) => user.user_name !== currentUserData?.user_name
  );
  return (
    <div className="aside-panel-wrapper">
      <div className="current-user-wrapper">
        <UserDetails
          username={currentUserData?.user_name}
          profile_image={currentUserData?.image}
        />
        <div className="add-account">
          <button>Add Account</button>
        </div>
      </div>
      <div className="suggested-users-wrapper">
        <h4>Tanglers suggested for you</h4>
        {filteredUsers?.map((user) => (
          <div key={user.user_name} className="users-wrapper">
            <UserDetails
              key={user.user_name}
              username={user.user_name}
              profile_image={user.image}
            />
            <div className="follow">
              <button>Tangle</button>
            </div>
          </div>
        ))}
      </div>
      <div className="about-us-footer-wrapper"></div>
    </div>
  );
};

export default SuggestedPanel;
