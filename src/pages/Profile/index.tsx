import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAuth, signOut } from "firebase/auth";

const Profile: React.FC = () => {
  const { user } = useAuth();
 
  const handleLogout = async  () => {
    // Clear user data from localStorage
    const auth = getAuth();
    await signOut(auth);
    localStorage.removeItem("user");
    // Redirect to login page 
    window.location.href = "/login";
  };

  if (!user) {
    return <div>Loading...</div>; // Show loading if user data is not yet available
  }

  return (
    <div className="max-w-lg mx-auto my-10 mt-20 px-4 sm:px-6 lg:px-8">
      <div className="bg-gray-200 shadow-xl rounded-xl p-8 mb-8 text-center transform hover:scale-105 transition duration-300 ease-in-out">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Profile</h1>


        <div className="mb-6">
          <img
            src={user.photoURL || "https://static-00.iconduck.com/assets.00/user-icon-1024x1024-dtzturco.png"}
            alt="Profile"
            className="w-32 h-32 mx-auto rounded-full border-4 border-sky-500 shadow-lg object-cover sm:w-40 sm:h-40 lg:w-48 lg:h-48"
          />
        </div>

        <div className="space-y-4">
          <p className="text-lg text-gray-800">
            <strong className="font-semibold text-gray-600">Name:</strong> {user.displayName }
          </p>
          <p className="text-lg text-gray-800">
            <strong className="font-semibold text-gray-600">Email:</strong> {user.email }
          </p>
        </div>

        <div className="mt-6">
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
