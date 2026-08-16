const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} = require("../controllers/notificationController");

router.get(
  "/",
  authMiddleware,
  getNotifications
);

router.put(
  "/:id/read",
  authMiddleware,
  markNotificationAsRead
);

router.put(
  "/read-all",
  authMiddleware,
  markAllNotificationsAsRead
);

module.exports = router;
