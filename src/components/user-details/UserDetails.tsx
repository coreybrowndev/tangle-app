import { useUser } from "../../context/UserContext";
import "./UserDetailsStyles.scss";
import { NavLink } from "react-router-dom";

interface UserDetailsProps {
  username: string | undefined;
  profile_image: string | undefined;
}

const UserDetails: React.FC<UserDetailsProps> = ({
  username,
  profile_image,
}) => {
  const { getUserData, currentUserData } = useUser();

  return (
    <div className="user-details-wrapper">
      <div className="image-wrapper">
        <img src={profile_image} alt="Profile Picture" />
      </div>
      <NavLink
        onClick={() => username && getUserData(username)}
        to={
          username == currentUserData?.user_name
            ? "/Profile/you"
            : `/Profile/${username}`
        }
      >
        <div className="user-wrapper">
          <strong style={{ textTransform: "lowercase" }}>{username}</strong>
          {username === currentUserData?.user_name ? (
            <small>
              {currentUserData?.first_name + " " + currentUserData?.last_name}
            </small>
          ) : (
            <small>Tangled since {2023} </small>
          )}
        </div>
      </NavLink>
    </div>
  );
};

export default UserDetails;
