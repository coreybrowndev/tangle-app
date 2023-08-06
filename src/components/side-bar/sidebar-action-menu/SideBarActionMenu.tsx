import "./sidebarActionMenuStyles.scss";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Menu, LogOut } from "react-feather";

const SideBarActionMenu = () => {
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const { logoutUser } = useAuth();

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };
  return (
    <div className="hamburger-action-menu-wrapper">
      <Menu onClick={toggleMenu} />
      {menuVisible && (
        <ul className="menu-list">
          <li>
            <button onClick={logoutUser}>
              Logout <LogOut />{" "}
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default SideBarActionMenu;
