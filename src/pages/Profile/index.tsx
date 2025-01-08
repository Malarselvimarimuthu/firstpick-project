

// import React, { useState, useEffect } from "react";

// const Profile: React.FC = () => {
//   const [user, setUser] = useState<any>(null);
//   const [isEditing, setIsEditing] = useState(false); // For toggle edit mode
//   const [newUsername, setNewUsername] = useState(""); // To store the new username

//   useEffect(() => {
//     // Retrieve user data from localStorage
//     const userData = localStorage.getItem("user");
//     if (userData) {
//       const parsedUser = JSON.parse(userData);
//       setUser(parsedUser);
//       setNewUsername(parsedUser.username || "");
//     } else {
//       // Redirect to login page if no user is found
//       window.location.href = "/login";
//     }
//   }, []);

//   const handleEditClick = () => {
//     setIsEditing(true); // Enable editing mode
//   };

//   const handleCancel = () => {
//     setIsEditing(false); // Cancel editing
//     setNewUsername(user.username); // Reset the username to original
//   };

//   const handleSave = () => {
//     // Update username in localStorage
//     const updatedUser = { ...user, username: newUsername };
//     localStorage.setItem("user", JSON.stringify(updatedUser));

//     setUser(updatedUser); // Update the state
//     setIsEditing(false); // Disable editing mode
//   };

//   if (!user) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="max-w-lg mx-auto my-10 mt-20 px-4 sm:px-6 lg:px-8">
//       <div className="bg-gray-200 shadow-xl rounded-xl p-8 mb-8 text-center transform hover:scale-105 transition duration-300 ease-in-out">
//         <h1 className="text-3xl font-semibold text-gray-800 mb-6">Profile</h1>

//         {/* Profile Picture */}
//         <div className="mb-6">
//           <img
//             src={user.photoURL || "https://static-00.iconduck.com/assets.00/user-icon-1024x1024-dtzturco.png"}
//             alt="Profile"
//             className="w-32 h-32 mx-auto rounded-full border-4 border-sky-500 shadow-lg object-cover sm:w-40 sm:h-40 lg:w-48 lg:h-48"
//           />
//         </div>

//         {/* User Info */}
//         <div className="space-y-4">
//           <p className="text-lg text-gray-800">
//             <strong className="font-semibold text-gray-600">Name:</strong>
//             {isEditing ? (
//               <input
//                 type="text"
//                 value={newUsername}
//                 onChange={(e) => setNewUsername(e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded-md"
//               />
//             ) : (
//               ` ${user.username || "John Doe"}`
//             )}
//           </p>
//           <p className="text-lg text-gray-800">
//             <strong className="font-semibold text-gray-600">Email:</strong> {user.email || "user@example.com"}
//           </p>
//         </div>

//         {/* Edit Profile Button */}
//         <div className="mt-6">
//           {!isEditing ? (
//             <button
//               className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-300"
//               onClick={handleEditClick}
//             >
//               Edit Profile
//             </button>
//           ) : (
//             <>
//               <button
//                 className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 mr-2"
//                 onClick={handleSave}
//               >
//                 Save
//               </button>
//               <button
//                 className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300"
//                 onClick={handleCancel}
//               >
//                 Cancel
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;













import React, { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../firebase/firebaseConfig"; // Ensure this is the correct import path

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false); // For toggle edit mode
  const [newUsername, setNewUsername] = useState(""); // To store the new username
  const [successMessage, setSuccessMessage] = useState(""); // For success message

  useEffect(() => {
    // Retrieve user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setNewUsername(parsedUser.username || "");
    } else {
      // Redirect to login page if no user is found
      window.location.href = "/login";
    }
  }, []);

  const handleEditClick = () => {
    setIsEditing(true); // Enable editing mode
  };

  const handleCancel = () => {
    setIsEditing(false); // Cancel editing
    setNewUsername(user.username); // Reset the username to original
    setSuccessMessage(""); // Reset success message on cancel
  };

  const handleSave = async () => {
    if (newUsername === user.username) {
      setIsEditing(false); // If username is the same, exit editing mode
      return;
    }

    try {
      // Reference the user's document in Firestore using their unique ID
      const userRef = doc(firestore, "users", user.id);

      // Update username in Firestore
      await updateDoc(userRef, {
        username: newUsername, // Update the username field in Firestore
      });

      // Update the username in localStorage
      const updatedUser = { ...user, username: newUsername };
      localStorage.setItem("user", JSON.stringify(updatedUser)); // Save updated user data

      setUser(updatedUser); // Update local state
      setIsEditing(false); // Disable editing mode
      setSuccessMessage("Username updated successfully!"); // Set success message
    } catch (error) {
      console.error("Error updating username:", error);
      setSuccessMessage("Error updating username."); // Set error message
    }
  };

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
            <strong className="font-semibold text-gray-600">Name:</strong>
            {isEditing ? (
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            ) : (
              ` ${user.username || "John Doe"}`
            )}
          </p>
          <p className="text-lg text-gray-800">
            <strong className="font-semibold text-gray-600">Email:</strong> {user.email || "user@example.com"}
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className={`bg-green-500 text-white font-bold p-2 rounded-md my-4`}>
            {successMessage}
          </div>
        )}

        {/* Edit Profile Button */}
        <div className="mt-6">
          {!isEditing ? (
            <button
              className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 transition duration-300"
              onClick={handleEditClick}
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 mr-2"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
