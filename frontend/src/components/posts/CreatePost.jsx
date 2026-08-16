import { useRef, useState } from "react";

import Avatar from "../ui/Avatar";
import Card from "../ui/Card";
import Button from "../ui/Button";

import { createPost } from "../../services/postService";

function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const fileInputRef = useRef(null);


  const handleSubmit = async () => {
  if (!content.trim() && !image) {
    alert("Please add text or an image.");
    return;
  }

  try {
    const data = await createPost({
      content,
      image,
    });

    if (!data.success) {
      alert(data.message);
      return;
    }

    alert("Post created successfully!");

    setContent("");
    setImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (onPostCreated) {
      onPostCreated();
    }

  } catch (error) {
    alert(error.message || "Unable to create post.");
  }
};


  return (
    <Card>
  <div className="flex gap-4">
    <Avatar />

    <div className="flex-1">
      <textarea
        rows="4"
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border rounded-lg p-3 resize-none"
      />

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => {
          if (e.target.files.length > 0) {
            setImage(e.target.files[0]);
          }
        }}
      />

      {image && (
        <div className="mt-4">
          <img
            src={URL.createObjectURL(image)}
            alt="Preview"
            className="w-48 rounded-lg border"
          />
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <div className="space-x-4 text-gray-600">
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
          >
            📷 Photo
          </button>

          <button type="button">
            🎥 Video
          </button>

          <button type="button">
            😊 Feeling
          </button>
        </div>

        <div className="w-32">
          <Button
            type="button"
            onClick={handleSubmit}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  </div>
</Card>
  );
}

export default CreatePost;
