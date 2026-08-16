import { useEffect, useState } from "react";

import PostCard from "../posts/PostCard";

import { getMyPosts } from "../../services/postService";

function ProfilePosts() {
  const [posts, setPosts] = useState([]);

  const loadPosts = async () => {
    try {
      const data = await getMyPosts();

      if (data.success) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        My Posts
      </h2>

      {posts.length === 0 ? (
        <p className="text-gray-500">
          No posts yet.
        </p>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onPostUpdated={loadPosts}
          />
        ))
      )}
    </div>
  );
}

export default ProfilePosts;
