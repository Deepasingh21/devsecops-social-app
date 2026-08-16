import { useEffect, useState } from "react";

import CreatePost from "../components/posts/CreatePost";
import PostCard from "../components/posts/PostCard";

import { getFeed } from "../services/postService";

function Home() {
  const [posts, setPosts] = useState([]);

  const loadPosts = async () => {
    try {
      const data = await getFeed();

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
    <>
      <CreatePost onPostCreated={loadPosts} />

      <div className="mt-6">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">
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
    </>
  );
}

export default Home;
