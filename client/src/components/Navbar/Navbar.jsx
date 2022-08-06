import React from "react";
import AdminNavbar from "./Admin/AdminNavbar";
import PublicNavbar from "./Public/PublicNavbar";
import PrivateNavbar from "./Private/PrivateNavbar";
import { useSelector } from "react-redux";
const Navbar = () => {
  const { userAuth } = useSelector((state) => state.user); // accessing the user slice of the state

  return (
    <>
      {/* If user is not logged in show Public navbar, if user is logged in and isAdmin then show admin navbar , else private navbar (i.e for a logged in user) */}
      {userAuth ? (
        userAuth.isAdmin ? (
          <AdminNavbar />
        ) : (
          <PrivateNavbar />
        )
      ) : (
        <PublicNavbar />
      )}
    </>
  );
};

export default Navbar;
