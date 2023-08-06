import React, { useState } from "react";
import "./sidebarStyles.scss";
import appLogo from "../../assets/twitter-x-seeklogo.com-4.svg";
import { NavLink } from "react-router-dom";
import { Home, Search, PlusSquare, Heart, Menu } from "react-feather";
import tempProfilePic from "../../assets/TEMP-IMG.jpg";
import { useAuth } from "../../context/AuthContext";
import SideBarActionMenu from "./sidebar-action-menu/SideBarActionMenu";
import { useUser } from "../../context/UserContext";

const SideBar = () => {
  const { currentUserData } = useUser();

  return (
    <div className="sidebar-container">
      <div className={"logo-image-wrapper"}>
        <img src={appLogo} />
      </div>
      <div className="nav-container">
        <NavLink to={"/"}>
          <button>
            <div className={"nav-btn-content"}>
              <Home />
              <h3>Home</h3>
            </div>
          </button>
        </NavLink>
        <NavLink to={"/Search"}>
          <button>
            <div className={"nav-btn-content"}>
              <Search />
              <h3>Search</h3>
            </div>
          </button>
        </NavLink>
        <NavLink to={"/Create"}>
          <button>
            <div className={"nav-btn-content"}>
              <PlusSquare />
              <h3>Create</h3>
            </div>
          </button>
        </NavLink>
        <NavLink to={"/Activity"}>
          <button>
            <div className={"nav-btn-content"}>
              <Heart />
              <h3>Activity</h3>
            </div>
          </button>
        </NavLink>
        <NavLink to={`/Profile/you`}>
          <button>
            <div className={"nav-btn-content"}>
              <div className="profile-image-wrapper">
                <img src={currentUserData?.image} alt="" />
              </div>
              <h3>Profile</h3>
            </div>
          </button>
        </NavLink>
        <NavLink className={"align-bottom"} to={""}>
          <button>
            <div className={"nav-btn-content sidebar-hamburger-menu"}>
              <SideBarActionMenu />
              <h3>More</h3>
            </div>
          </button>
        </NavLink>
      </div>
    </div>
  );
};

export default SideBar;
