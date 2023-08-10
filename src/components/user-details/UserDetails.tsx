import "./UserDetailsStyles.scss";

interface UserDetailsProps {
  username: string | undefined;
  profile_image: string | undefined;
}

const UserDetails: React.FC<UserDetailsProps> = ({
  username,
  profile_image,
}) => {
  return (
    <div className="user-details-wrapper">
      <div className="image-wrapper">
        <img src={profile_image} alt="Profile Picture" />
      </div>
      <div className="user-wrapper">
        <strong style={{ textTransform: "lowercase" }}>{username}</strong>
      </div>
    </div>
  );
};

export default UserDetails;
