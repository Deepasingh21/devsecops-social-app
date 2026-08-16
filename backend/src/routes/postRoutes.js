const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const {
  createPost,
  getPosts,
  getMyPosts,
  getUserPosts,
  getFeed,
  getPostById,
  likePost,
  addComment,
  deletePost,
  deleteComment,
} = require("../controllers/postController");

router.post(
  "/",
  authMiddleware,
  upload.single("postImage"),
  createPost
);

router.get("/me", authMiddleware, getMyPosts);

router.get("/feed", authMiddleware, getFeed);

router.get("/", authMiddleware, getPosts);

router.get(
  "/user/:id",
  authMiddleware,
  getUserPosts
);

router.get(
  "/:id",
  authMiddleware,
  getPostById
);

router.put(
  "/:id/like",
  authMiddleware,
  likePost
);

router.post(
  "/:id/comment",
  authMiddleware,
  addComment
);

router.delete(
  "/:postId/comment/:commentId",
  authMiddleware,
  deleteComment
);

router.delete("/:id", authMiddleware, deletePost);

module.exports = router;
