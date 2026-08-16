import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  getUserById,
  followUser,
  unfollowUser,
} from "../services/userService";

import { getUserPosts } from "../services/postService";
import PostCard from "../components/posts/PostCard";

function UserProfile() {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(
    localStorage.getItem("user")
  );

  const loadUser = async () => {
    try {
      setLoading(true);

      const userData = await getUserById(id);

      if (!userData.success) {
        setUser(null);
        return;
      }

      setUser(userData.user);

      const following =
        userData.user.followers?.some(
          (followerId) =>
            followerId.toString() ===
            currentUser?._id?.toString()
        );

      setIsFollowing(!!following);

      const postsData = await getUserPosts(id);

      if (postsData.success) {
        setPosts(postsData.posts);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error(
        "User profile loading error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, [id]);

  const handleFollow = async () => {
    try {
      setFollowLoading(true);

      const data = isFollowing
        ? await unfollowUser(id)
        : await followUser(id);

      if (!data.success) {
        alert(data.message || "Unable to update follow status.");
        return;
      }

      await loadUser();
    } catch (error) {
      console.error("Follow error:", error);

      alert(
        "Unable to update follow status."
      );
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          Loading profile...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold">
            User not found
          </h2>

          <Link
            to="/people"
            className="inline-block mt-4 text-blue-600 hover:underline"
          >
            Back to People
          </Link>
        </div>
      </div>
    );
  }

  const isOwnProfile =
    currentUser?._id?.toString() ===
    user._id?.toString();

  return (
    <div className="max-w-5xl mx-auto p-6">

      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">

        {/* Cover */}
        <div className="h-52 bg-gradient-to-r from-blue-600 to-indigo-700"></div>

        <div className="relative px-8 pb-8">

          {/* Profile Picture */}
          <div className="-mt-16">

            <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-blue-600 flex items-center justify-center text-5xl font-bold text-white">

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

          </div>

          {/* User information */}
          <div className="mt-4">

            <h1 className="text-3xl font-bold">
              {user.fullName}
            </h1>

            <p className="text-gray-500">
              @{user.username}
            </p>

            <p className="mt-3 text-gray-600">
              {user.bio || "No bio available."}
            </p>

            {/* Follow button */}
            {!isOwnProfile && (
              <button
                onClick={handleFollow}
                disabled={followLoading}
                className={`mt-5 px-6 py-2 rounded-lg text-white ${
                  isFollowing
                    ? "bg-gray-500 hover:bg-gray-600"
                    : "bg-blue-600 hover:bg-blue-700"
                } disabled:opacity-50`}
              >
                {followLoading
                  ? "Please wait..."
                  : isFollowing
                  ? "Following"
                  : "Follow"}
              </button>
            )}

          </div>

        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-xl shadow-md p-6 mt-6 grid grid-cols-3 gap-6">

        <div className="text-center">
          <h3 className="text-2xl font-bold">
            {posts.length}
          </h3>

          <p className="text-gray-500 mt-2">
            Posts
          </p>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold">
            {user.followers?.length || 0}
          </h3>

          <p className="text-gray-500 mt-2">
            Followers
          </p>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold">
            {user.following?.length || 0}
          </h3>

          <p className="text-gray-500 mt-2">
            Following
          </p>
        </div>

      </div>

      {/* Posts */}
      <div className="mt-8">

        <h2 className="text-2xl font-bold mb-6">
          {isOwnProfile
            ? "My Posts"
            : `${user.fullName}'s Posts`}
        </h2>

        {posts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-6 text-center text-gray-500">
            No posts yet.
          </div>
        ) : (
          <div className="space-y-6">

            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
              />
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default UserProfile;
