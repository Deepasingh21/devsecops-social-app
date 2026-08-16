import { useState } from "react";

import { addComment } from "../../services/postService";

function CommentSection({ postId, onCommentAdded }) {
  const [text, setText] = useState("");

  const handleSubmit = async () => {
    if (!text.trim()) return;

    try {
      const data = await addComment(postId, text);

      if (!data.success) {
        alert(data.message);
        return;
      }

      setText("");

      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      alert("Unable to add comment");
    }
  };

  return (
    <div className="mt-4">
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 border rounded-lg p-3"
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-5 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default CommentSection;
