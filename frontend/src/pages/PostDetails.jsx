import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { getPostById } from "../services/postService";
import PostCard from "../components/posts/PostCard";

function PostDetails() {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadPost = async () => {
    try {
      const data = await getPostById(id);

      if (data.success) {
        setPost(data.post);
      }
    } catch (error) {
      console.error("Unable to load post:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPost();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center mt-10">
        Loading post...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-600 mb-4">
          Post not found.
        </p>

        <Link
          to="/"
          className="text-blue-600 hover:underline"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">

      <Link
        to="/"
        className="text-blue-600 hover:underline"
      >
        ← Back to Home
      </Link>

      <div className="mt-6">
        <PostCard post={post} />
      </div>

    </div>
  );
}

export default PostDetails;
