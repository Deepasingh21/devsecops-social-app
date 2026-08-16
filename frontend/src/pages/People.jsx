import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getUsers,
  followUser,
  unfollowUser,
} from "../services/userService";

function People() {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    try {
      const data = await getUsers();

      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleFollow = async (userId, isFollowing) => {
    try {
      if (isFollowing) {
        await unfollowUser(userId);
      } else {
        await followUser(userId);
      }

      loadUsers();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">
        People
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {users.map((user) => {
          const isFollowing = user.followers.includes(
            JSON.parse(localStorage.getItem("user"))._id
          );

          return (
            <div
              key={user._id}
              className="bg-white rounded-xl shadow-md p-6 flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold overflow-hidden">
                  {user.profilePicture ? (
                    <img
                      src={`${import.meta.env.VITE_SERVER_URL}${user.profilePicture}`}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  ) : (
                    user.fullName.charAt(0).toUpperCase()
                  )}
                </div>

                <div>
                  <Link to={`/users/${user._id}`}>

  <h2 className="font-bold hover:text-blue-600">
    {user.fullName}
  </h2>

  <p className="text-gray-500">
    @{user.username}
  </p>

</Link>

                  <p className="text-sm text-gray-400">
                    {user.followers.length} Followers
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  handleFollow(user._id, isFollowing)
                }
                className={`px-5 py-2 rounded-lg text-white ${
                  isFollowing
                    ? "bg-gray-500"
                    : "bg-blue-600"
                }`}
              >
                {isFollowing
                  ? "Following"
                  : "Follow"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default People;
