import { useNavigate } from "react-router-dom";

function FollowListModal({
  title,
  users,
  onClose,
}) {
  const navigate = useNavigate();

  const handleUserClick = (userId) => {
    onClose();
    navigate(`/users/${userId}`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden">

        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-xl font-bold">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 text-2xl hover:text-black"
          >
            ×
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[60vh]">

          {users.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No users found.
            </p>
          ) : (
            <div className="space-y-2">

              {users.map((user) => (
                <button
                  key={user._id}
                  onClick={() =>
                    handleUserClick(user._id)
                  }
                  className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 text-left"
                >

                  <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-600 text-white flex items-center justify-center font-bold">

                    {user.profilePicture ? (
                      <img
                        src={`${import.meta.env.VITE_SERVER_URL}${user.profilePicture}`}
                        alt={user.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user.fullName
                        .charAt(0)
                        .toUpperCase()
                    )}

                  </div>

                  <div>
                    <p className="font-semibold">
                      {user.fullName}
                    </p>

                    <p className="text-sm text-gray-500">
                      @{user.username}
                    </p>
                  </div>

                </button>
              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default FollowListModal;
