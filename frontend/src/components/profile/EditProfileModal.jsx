import { useState } from "react";
import { updateProfile } from "../../services/userService";

function EditProfileModal({ user, onClose, onUpdated }) {
  const [fullName, setFullName] = useState(user.fullName || "");
  const [username, setUsername] = useState(user.username || "");
  const [bio, setBio] = useState(user.bio || "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    try {
      setSaving(true);

      const data = await updateProfile({
        fullName,
        username,
        bio,
      });

      if (!data.success) {
        alert(data.message);
        return;
      }

      if (onUpdated) {
        await onUpdated();
      }

      onClose();
    } catch (error) {
      console.error("Profile update error:", error);
      alert("Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-6 text-2xl font-bold">
          Edit Profile
        </h2>

        <label className="block mb-2 font-medium">
          Full Name
        </label>

        <input
          type="text"
          className="w-full border rounded-lg p-3 mb-4"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <label className="block mb-2 font-medium">
          Username
        </label>

        <input
          type="text"
          className="w-full border rounded-lg p-3 mb-4"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="block mb-2 font-medium">
          Bio
        </label>

        <textarea
          className="w-full border rounded-lg p-3 mb-6"
          rows="4"
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 border rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProfileModal;
