import { useEffect, useRef, useState } from "react";

import Avatar from "../ui/Avatar";
import Card from "../ui/Card";
import Button from "../ui/Button";

import { createPost } from "../../services/postService";

function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!image || !image.type.startsWith("image/")) {
      const canvas = canvasRef.current;

      if (canvas) {
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
      }

      return;
    }

    let cancelled = false;
    let bitmap = null;

    const drawImagePreview = async () => {
      try {
        bitmap = await createImageBitmap(image);

        if (cancelled) {
          bitmap.close();
          return;
        }

        const canvas = canvasRef.current;

        if (!canvas) {
          bitmap.close();
          return;
        }

        const maxWidth = 192;
        const maxHeight = 192;

        const scale = Math.min(
          maxWidth / bitmap.width,
          maxHeight / bitmap.height,
          1
        );

        const width = Math.round(bitmap.width * scale);
        const height = Math.round(bitmap.height * scale);

        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");

        context.clearRect(0, 0, width, height);
        context.drawImage(bitmap, 0, 0, width, height);

        bitmap.close();
        bitmap = null;
      } catch (error) {
        console.error("Unable to preview image:", error);
      }
    };

    drawImagePreview();

    return () => {
      cancelled = true;

      if (bitmap) {
        bitmap.close();
      }
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

          {image && (
            <div className="mt-4">
              <canvas
                ref={canvasRef}
                className="w-48 rounded-lg border"
                aria-label="Selected image preview"
              />
            </div>
          )}

          <div className="flex justify-between items-center mt-4">
            <div className="space-x-4 text-gray-600">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
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
