import { useState } from "react";

import Avatar from "../ui/Avatar";
import Card from "../ui/Card";
import CommentSection from "./CommentSection";

import {
  likePost,
  deletePost,
  deleteComment,
} from "../../services/postService";

function PostCard({ post, onPostUpdated }) {
  const [showComments, setShowComments] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const currentUser = JSON.parse(
    localStorage.getItem("user")
  );

  const isLiked = post.likes?.some(
    (like) => {
      const likeId =
        typeof like === "string"
          ? like
          : like?._id;

      return likeId === currentUser?._id;
    }
  );

  const handleLike = async () => {
  if (likeLoading) return;

  try {
    setLikeLoading(true);

    const data = await likePost(post._id);

    if (!data.success) {
      alert(data.message || "Unable to update like.");
      return;
    }

    if (onPostUpdated) {
      await onPostUpdated();
    }
  } catch (error) {
    console.error("Like error:", error);
    alert("Unable to update like.");
  } finally {
    setLikeLoading(false);
  }
};

const handleDelete = async () => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this post?"
  );

  if (!confirmDelete) return;

  try {
    const data = await deletePost(post._id);

    if (!data.success) {
      alert(data.message);
      return;
    }

    if (onPostUpdated) {
      onPostUpdated();
    }
  } catch (error) {
    alert("Unable to delete post.");
  }
};

const handleDeleteComment = async (commentId) => {
  const confirmDelete = window.confirm(
    "Delete this comment?"
  );

  if (!confirmDelete) return;

  try {
    const data = await deleteComment(
      post._id,
      commentId
    );

    if (!data.success) {
      alert(data.message);
      return;
    }

    if (onPostUpdated) {
      onPostUpdated();
    }
  } catch (error) {
    alert("Unable to delete comment.");
  }
};


const isOwner = currentUser?._id === post.author?._id;
  return (
    <Card className="mt-6">
      <div className="flex gap-4">
        <Avatar name={post.author?.fullName || "User"} />

        <div className="flex-1">
          <div className="flex justify-between">
  <div>
    <h3 className="font-bold">
      {post.author?.fullName}
    </h3>

    <p className="text-sm text-gray-500">
      {new Date(post.createdAt).toLocaleString()}
    </p>
  </div>

  {isOwner && (
    <button
      onClick={handleDelete}
      className="text-red-600 hover:text-red-800 font-semibold"
    >
      🗑 Delete
    </button>
  )}
</div>

          <p className="mt-4">
            {post.content}
          </p>
          
          {post.image && (
            <div className="mt-4">
              <img
                src={`${import.meta.env.VITE_SERVER_URL}${post.image}`}
                alt="Post"
                className="w-full rounded-xl max-h-[500px] object-cover"
              />
            </div>
          )}


          <div className="flex justify-around mt-6 border-t pt-4">
            <button
  onClick={handleLike}
  disabled={likeLoading}
  className={`px-4 py-2 rounded-lg transition ${
    isLiked
      ? "text-red-600 font-semibold"
      : "text-gray-700 hover:text-red-600"
  } ${
    likeLoading
      ? "opacity-50 cursor-not-allowed"
      : ""
  }`}
>
  {likeLoading
    ? "Please wait..."
    : isLiked
    ? `❤️ Liked ${post.likes.length}`
    : `♡ Like ${post.likes.length}`}
</button>

            <button
              onClick={() =>
                setShowComments(!showComments)
              }
            >
              💬 {post.comments.length} Comment
              {post.comments.length !== 1 ? "s" : ""}
            </button>

            <button>
              🔄 Share
            </button>
          </div>

          {showComments && (
            <div className="mt-4">

              {post.comments.length > 0 && (
                <div className="mb-4">
                  {post.comments.map((comment) => (
                    <div
                      key={comment._id}
                      className="border rounded-lg p-3 mb-2"
                    >
                      <div className="flex justify-between">
  <p className="font-semibold">
    {comment.user?.fullName || "User"}
  </p>

  {currentUser?._id === comment.user?._id && (
    <button
      onClick={() =>
        handleDeleteComment(comment._id)
      }
      className="text-red-600 hover:text-red-800"
    >
      🗑
    </button>
  )}
</div>

<p>{comment.text}</p>
                    </div>
                  ))}
                </div>
              )}

              <CommentSection
                postId={post._id}
                onCommentAdded={onPostUpdated}
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export default PostCard;
