import React from "react";
import "./currentUserProfilePageStyles.scss";
import { useUser } from "../../context/UserContext";
import { MoreHorizontal, Settings } from "react-feather";
import UserThreads from "../../components/profile-page-components/UserThreads";
import SideBar from "../../components/side-bar/SideBar";

const CurrentUserProfilePage = () => {
  const { userData, userFollowsCount } = useUser();

  console.log("USER DATA---s-s-s: ", userData);

  return (
    <div className="profile-page-wrapper">
      <SideBar />
      <div className="profile-page-container">
        <div className="profile-page-header">
          <div className="profile-page-name-desc-followers-wrapper">
            <h1>{userData?.user_name}</h1>
            <p>Soon you will be able to add personalized descriptions🔥</p>
            <div className="followers-following-wrapper">
              <h3>{userFollowsCount?.followers.length} followers</h3>
              <p>·</p>
              <h3>following {userFollowsCount?.following.length}</h3>
            </div>
          </div>
          <div className="profile-page-header-image-action-items-wrapper">
            <div className="profile-page-header-image-wrapper">
              <img src={userData?.image} alt="" />
            </div>
            <div className="action-items-wrapper">
              <button>
                <Settings />
              </button>
              <button>
                <MoreHorizontal />
              </button>
            </div>
          </div>
        </div>

        <div className="user-threads-wrapper">
          <h3 className="profile-page-threads-header">Threads</h3>
          <div className="line-wrapper"></div>
          <UserThreads />
        </div>
      </div>
    </div>
  );
};

export default CurrentUserProfilePage;
