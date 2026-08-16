import { useEffect, useState } from "react";

import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileStats from "../components/profile/ProfileStats";
import ProfileAbout from "../components/profile/ProfileAbout";
import ProfilePosts from "../components/profile/ProfilePosts";
import FollowListModal from "../components/profile/FollowListModal";

import {
  getProfile,
  getFollowers,
  getFollowing,
} from "../services/userService";

import { getMyPosts } from "../services/postService";

function Profile() {
  const [user, setUser] = useState(null);
  const [postCount, setPostCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);

  const [followList, setFollowList] = useState([]);
  const [followListType, setFollowListType] = useState(null);
  const [followListLoading, setFollowListLoading] =
    useState(false);

  const loadProfile = async () => {
    try {
      const profileData = await getProfile();

      if (profileData.success) {
        setUser(profileData.user);
      }

      const postsData = await getMyPosts();

      if (postsData.success) {
        setPostCount(postsData.posts.length);

        const totalLikes = postsData.posts.reduce(
          (total, post) =>
            total + (post.likes?.length || 0),
          0
        );

        setLikeCount(totalLikes);
      }
    } catch (error) {
      console.error(
        "Profile loading error:",
        error
      );
    }
  };

  const openFollowList = async (type) => {
    if (!user) return;

    try {
      setFollowListLoading(true);
      setFollowListType(type);
      setFollowList([]);

      const data =
        type === "followers"
          ? await getFollowers(user._id)
          : await getFollowing(user._id);

      if (data.success) {
        setFollowList(data.users);
      } else {
        alert(
          data.message ||
            "Unable to load users."
        );
        setFollowListType(null);
      }
    } catch (error) {
      console.error(
        "Unable to load follow list:",
        error
      );

      alert("Unable to load users.");
      setFollowListType(null);
    } finally {
      setFollowListLoading(false);
    }
  };

  const closeFollowList = () => {
    setFollowListType(null);
    setFollowList([]);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (!user) {
    return (
      <div className="text-center mt-10">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">

      <ProfileHeader
        user={user}
        onProfileUpdated={loadProfile}
      />

      <ProfileStats
        user={user}
        postCount={postCount}
        likeCount={likeCount}
        onFollowersClick={() =>
          openFollowList("followers")
        }
        onFollowingClick={() =>
          openFollowList("following")
        }
      />

      <ProfileAbout user={user} />

      <ProfilePosts />

      {followListType && (
        <FollowListModal
          title={
            followListType === "followers"
              ? "Followers"
              : "Following"
          }
          users={followListLoading ? [] : followList}
          onClose={closeFollowList}
        />
      )}

    </div>
  );
}

export default Profile;
