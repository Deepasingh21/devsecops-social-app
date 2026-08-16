import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../services/notificationService";

function NotificationDropdown({
  onClose,
  onNotificationRead,
  onAllNotificationsRead,
}) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const loadNotifications = async () => {
    try {
      const data = await getNotifications();

      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error("Notification error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const handleRead = async (notificationId) => {
  try {
    const notification = notifications.find(
      (item) => item._id === notificationId
    );

    if (!notification || notification.isRead) {
      return;
    }

    const data = await markNotificationAsRead(notificationId);

    if (data.success) {
      setNotifications((previous) =>
        previous.map((notification) =>
          notification._id === notificationId
            ? {
                ...notification,
                isRead: true,
              }
            : notification
        )
      );

      if (onNotificationRead) {
        onNotificationRead(notificationId);
      }
    }
  } catch (error) {
    console.error("Unable to mark notification as read:", error);
  }
};

  const handleNotificationClick = async (notification) => {
  try {
    await handleRead(notification._id);

    if (onClose) {
      onClose();
    }

    if (notification.type === "follow") {
      if (notification.sender?._id) {
        navigate(`/users/${notification.sender._id}`);
      }

      return;
    }

    if (
      notification.type === "like" ||
      notification.type === "comment"
    ) {
      if (notification.post?._id) {
        navigate(`/posts/${notification.post._id}`);
      }

      return;
    }
  } catch (error) {
    console.error(
      "Notification click error:",
      error
    );
  }
};    
       

  const handleMarkAllRead = async () => {
  try {
    const data = await markAllNotificationsAsRead();

    if (data.success) {
      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );

      if (onAllNotificationsRead) {
        onAllNotificationsRead();
      }
    }
  } catch (error) {
    console.error(
      "Unable to mark all notifications as read:",
      error
    );
  }
};

  const getIcon = (type) => {
    if (type === "like") {
      return "❤️";
    }

    if (type === "comment") {
      return "💬";
    }

    if (type === "follow") {
      return "👤";
    }

    return "🔔";
  };

  return (
    <div className="absolute right-0 top-12 w-96 bg-white text-black rounded-xl shadow-xl border z-50 overflow-hidden">

      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">

        <h2 className="font-bold text-lg">
          Notifications
        </h2>

        <button
          onClick={handleMarkAllRead}
          className="text-sm text-blue-600 hover:underline"
        >
          Mark all as read
        </button>

      </div>

      {/* Notifications */}
      <div className="max-h-96 overflow-y-auto">

        {loading ? (
          <div className="p-5 text-center text-gray-500">
            Loading...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-5 text-center text-gray-500">
            No notifications
          </div>
        ) : (
          notifications.map((notification) => (
              <button
  key={notification._id}
  onClick={() =>
    handleNotificationClick(notification)
  }
              className={`w-full text-left p-4 border-b hover:bg-gray-100 ${
                !notification.isRead
                  ? "bg-blue-50"
                  : "bg-white"
              }`}
            >

              <div className="flex gap-3">

                {/* Icon */}
                <div className="text-xl">
                  {getIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1">

                  <p className="text-sm">
                    {notification.message}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(
                      notification.createdAt
                    ).toLocaleString()}
                  </p>

                </div>

                {/* Unread indicator */}
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                )}

              </div>

            </button>
          ))
        )}

      </div>

      {/* Footer */}
      <div className="p-3 text-center border-t">

        <button
          onClick={onClose}
          className="text-sm text-gray-600 hover:text-black"
        >
          Close
        </button>

      </div>

    </div>
  );
}

export default NotificationDropdown;
