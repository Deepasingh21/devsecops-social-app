import { useRef, useState } from "react";

import EditProfileModal from "./EditProfileModal";
import { uploadProfilePicture } from "../../services/userService";

function ProfileHeader({ user, onProfileUpdated }) {
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);
  const handleImageUpload = async (e) => {
  const file = e.target.files[0];

  if (!file) return;

  try {
    const data = await uploadProfilePicture(file);

    if (!data.success) {
      alert(data.message);
      return;
    }

    if (onProfileUpdated) {
      onProfileUpdated();
    }
  } catch (error) {
    alert("Unable to upload profile picture.");
  }
};

  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Cover */}
        <div className="h-52 bg-gradient-to-r from-blue-600 to-indigo-700"></div>

        {/* Profile Info */}
        <div className="relative px-8 pb-8">

          {/* Avatar */}
          <div className="-mt-16 relative">

  <input
    type="file"
    accept="image/*"
    ref={fileInputRef}
    className="hidden"
    onChange={handleImageUpload}
  />

  <div
    onClick={() => fileInputRef.current.click()}
    className="w-32 h-32 rounded-full border-4 border-white overflow-hidden cursor-pointer bg-blue-600 flex items-center justify-center text-5xl font-bold text-white"
  >
    {user.profilePicture ? (
      <img
        src={`${import.meta.env.VITE_SERVER_URL}${user.profilePicture}`}
        alt="Profile"
        className="w-full h-full object-cover"
      />
    ) : (
      user.fullName.charAt(0).toUpperCase()
    )}
  </div>

</div>

          <div className="mt-4">
            <h2 className="text-3xl font-bold">
              {user.fullName}
            </h2>

            <p className="text-gray-500">
              @{user.username}
            </p>

            <p className="mt-3 text-gray-600">
              {user.bio || "No bio added yet."}
            </p>

            <button
              onClick={() => setShowModal(true)}
              className="mt-5 px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Edit Profile
            </button>
          </div>

        </div>
      </div>

      {showModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowModal(false)}
          onUpdated={onProfileUpdated}
        />
      )}
    </>
  );
}

export default ProfileHeader;
