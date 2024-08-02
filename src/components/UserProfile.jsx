import { useEffect, useState, useContext } from "react";

import { AuthContext } from "../context/AuthContext";
import { UserContext } from "../context/UserContext";
import DashboardContent from "./DashboardContent";
import DashboardAdminContent from "./DashboardAdminContent";
import DashboardAgentContent from "./DashboardAgentContent";

const UserProfile = () => {
  const [imageURL, setImageURL] = useState(null);
  useContext(AuthContext);
  const user = useContext(UserContext);

  useEffect(() => {
    if (user && user.image) {
      setImageURL(`http://127.0.0.1:8000${user.image}`);
    }
  }, [user]);

  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="flex flex-col items-right">
      <div className="bg-white  shadow-lg  mt-14 z-50 fixed top-0 right-0 rounded-md ">
        <ul className="flex items-center">
          <li className="px-4 py-2">
            {imageURL && (
              <img
                src={imageURL}
                alt="Profil"
                className="w-10 h-10 rounded-full"
              />
            )}
          </li>
          <li className="px-4">
            {user.role === "admin" ? (
              <span className="font-bold dark:text-gray-950">
                Bonjour Administrateur
              </span>
            ) : (
              <span className="dark:text-gray-950">Bonjour {user.name}</span>
            )}
          </li>
        </ul>
      </div>
      <div className="mt-14">
        {user.role === "admin" ? (
          <DashboardAdminContent />
        ) : user.role === "agent" ? (
          <DashboardAgentContent />
        ) : (
          <DashboardContent />
        )}
      </div>
    </div>
  );
};

export default UserProfile;
