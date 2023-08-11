import React from "react";
import UserDetails from "../user-details/UserDetails";
import "./asidePanelStyles.scss";
import { useUser } from "../../context/UserContext";

const AsidePanel = () => {
  const { currentUserData, allUsers } = useUser();
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
        <h4>Suggested for you</h4>
        {allUsers?.map((user) => (
          <div key={user.user_name} className="users-wrapper">
            <UserDetails
              key={user.user_name}
              username={user.user_name}
              profile_image={user.image}
            />
            <div className="follow">
              <button>Follow</button>
            </div>
          </div>
        ))}
      </div>
      <div className="about-us-footer-wrapper"></div>
    </div>
  );
};

export default AsidePanel;
