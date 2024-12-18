/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { IoMdHome } from "react-icons/io";

const Navbar = ({ user, onLogout }) => {
  const [authUser, setAuthUser] = useState(user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setAuthUser(currentUser);
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    onLogout();
  };

  return (
    <nav className="sticky top-0 p-4 shadow-lg bg-white shadow-gray-100">
      <div className="mx-auto flex justify-between items-center">
        <Link to="/" className="">
          <span className="text-xl font-bold text-blue-600 hidden md:block">GarmentConnect</span>
          <span className="md:hidden text-2xl text-blue-500"><IoMdHome /></span>
        </Link>
        <div className="text-blue-500 flex gap-3 items-center">

          <Link to="/inbox" className=" hover:text-green-500">
            Inbox
          </Link>
          <Link to="/about" className=" hover:text-green-500">
            About
          </Link>
        </div>

        <div className="space-x-4">
          {authUser ? (
            <div className="flex items-center space-x-4">
              <span className="font-medium text-black">
                Hello,{" "}
                <span className="text-blue-500">
                  {authUser.displayName || "User"}
                </span>
              </span>
              <button
                className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-white px-4">
              <button className="bg-green-400 py-1 px-3 rounded hover:bg-green-500">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
