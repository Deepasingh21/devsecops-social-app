import { useEffect, useRef, useState } from "react";

import Avatar from "../ui/Avatar";
import Card from "../ui/Card";
import Button from "../ui/Button";

import { createPost } from "../../services/postService";

function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!image) {
      setPreviewUrl("");
      return;
    }

    if (!image.type.startsWith("image/")) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(image);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [image]);

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
              const selectedFile = e.target.files?.[0];

              if (!selectedFile) {
                setImage(null);
                return;
              }

              if (!selectedFile.type.startsWith("image/")) {
                alert("Please select an image file.");
                e.target.value = "";
                setImage(null);
                return;
              }

              setImage(selectedFile);
            }}
          />

          {previewUrl && (
            <div className="mt-4">
              <img
                src={previewUrl}
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
