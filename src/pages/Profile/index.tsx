import React, { useState, useEffect } from "react";

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Retrieve user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } else {
      // Redirect to login page if no user is found
      window.location.href = "/login";
    }
  }, []);

  if (!user) {
    return <div>Loading...</div>; // Show loading if user data is not yet available
  }

  return (
    <div className="max-w-lg mx-auto my-10 mt-20 px-4 sm:px-6 lg:px-8">
      <div className="bg-gray-200 shadow-xl rounded-xl p-8 mb-8 text-center transform hover:scale-105 transition duration-300 ease-in-out">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Profile</h1>

        {/* Profile Picture */}
        <div className="mb-6">
          <img
            src={user.photoURL || "https://static-00.iconduck.com/assets.00/user-icon-1024x1024-dtzturco.png"}
            alt="Profile"
            className="w-32 h-32 mx-auto rounded-full border-4 border-sky-500 shadow-lg object-cover sm:w-40 sm:h-40 lg:w-48 lg:h-48"
          />
        </div>

        {/* User Info */}
        <div className="space-y-4">
          <p className="text-lg text-gray-800">
            <strong className="font-semibold text-gray-600">Name:</strong> {user.username || "John Doe"}
          </p>
          <p className="text-lg text-gray-800">
            <strong className="font-semibold text-gray-600">Email:</strong> {user.email || "user@example.com"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
