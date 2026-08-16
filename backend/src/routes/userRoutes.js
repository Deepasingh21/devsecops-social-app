const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getAllUsers,
  searchUsers,
  getUserById,
} = require("../controllers/userController");

router.get("/me", authMiddleware, getProfile);

router.put("/me", authMiddleware, updateProfile);

router.put(
  "/profile-picture",
  authMiddleware,
  upload.single("profilePicture"),
  uploadProfilePicture
);

router.put(
  "/follow/:id",
  authMiddleware,
  followUser
);

router.put(
  "/unfollow/:id",
  authMiddleware,
  unfollowUser
);

router.get(
  "/:id/followers",
  authMiddleware,
  getFollowers
);

router.get(
  "/:id/following",
  authMiddleware,
  getFollowing
);

/* IMPORTANT: search must come before /:id */
router.get(
  "/search",
  authMiddleware,
  searchUsers
);

/* Get user by ID */
router.get(
  "/:id",
  authMiddleware,
  getUserById
);

router.get(
  "/",
  authMiddleware,
  getAllUsers
);

module.exports = router;
