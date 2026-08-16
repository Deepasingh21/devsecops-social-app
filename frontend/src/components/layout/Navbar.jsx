import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { searchUsers } from "../../services/userService";
import { getNotifications } from "../../services/notificationService";

import NotificationDropdown from "../notifications/NotificationDropdown";

function Navbar() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const handleAllNotificationsRead = () => {
  setUnreadCount(0);
};
  const [showNotifications, setShowNotifications] =
    useState(false);

  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();

  // Load unread notification count
  useEffect(() => {
    const loadUnreadNotifications = async () => {
      try {
        const data = await getNotifications();

        if (data.success) {
          const unread = data.notifications.filter(
            (notification) => !notification.isRead
          ).length;

          setUnreadCount(unread);
        }
      } catch (error) {
        console.error(
          "Notification count error:",
          error
        );
      }
    };

    loadUnreadNotifications();
  }, []);

  // Search users
  useEffect(() => {
    const search = async () => {
      if (!query.trim()) {
        setUsers([]);
        setShowResults(false);
        return;
      }

      try {
        const data = await searchUsers(query);

        if (data.success) {
          setUsers(data.users);
          setShowResults(true);
        }
      } catch (error) {
        console.error("Search error:", error);
      }
    };

    const timer = setTimeout(search, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleUserClick = (userId) => {
    setQuery("");
    setUsers([]);
    setShowResults(false);

    navigate(`/users/${userId}`);
  };

  const handleNotificationRead = () => {
  setUnreadCount((count) =>
    count > 0 ? count - 1 : 0
  );
};

  const handleNotificationClose = () => {
    setShowNotifications(false);
  };

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  setQuery("");
  setUsers([]);
  setShowResults(false);
  setShowNotifications(false);

  navigate("/login");
};

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <h1 className="text-2xl font-bold">
          DevSecOps Social
        </h1>

        {/* Search */}
        <div className="relative w-80">

          <input
            type="text"
            placeholder="Search users..."
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }
            onFocus={() => {
              if (users.length > 0) {
                setShowResults(true);
              }
            }}
            className="border rounded-lg px-3 py-2 w-full text-black"
          />

          {showResults && (
            <div className="absolute top-12 left-0 w-full bg-white text-black rounded-lg shadow-lg overflow-hidden z-50">

              {users.length === 0 ? (
                <div className="p-4 text-gray-500">
                  No users found
                </div>
              ) : (
                users.map((user) => (
                  <button
                    key={user._id}
                    onClick={() =>
                      handleUserClick(user._id)
                    }
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 text-left"
                  >

                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-white font-bold">

                      {user.profilePicture ? (
                        <img
                          src={`${
                            import.meta.env
                              .VITE_SERVER_URL
                          }${user.profilePicture}`}
                          alt={user.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        user.fullName
                          .charAt(0)
                          .toUpperCase()
                      )}

                    </div>

                    {/* User information */}
                    <div>
                      <p className="font-semibold">
                        {user.fullName}
                      </p>

                      <p className="text-sm text-gray-500">
                        @{user.username}
                      </p>
                    </div>

                  </button>
                ))
              )}

            </div>
          )}

        </div>

        {/* Right side */}
        <div className="flex items-center gap-6">

          {/* Notifications */}
          <div className="relative">

            <button
              type="button"
              onClick={() =>
                setShowNotifications(
                  !showNotifications
                )
              }
              className="relative text-2xl hover:scale-110 transition"
              aria-label="Notifications"
            >
              🔔

              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1">
                  {unreadCount > 99
                    ? "99+"
                    : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <NotificationDropdown
  onClose={handleNotificationClose}
  onNotificationRead={handleNotificationRead}
  onAllNotificationsRead={handleAllNotificationsRead}
/>
            )}

          </div>

          {/* Navigation */}
          <div className="flex items-center gap-5">

  <Link
    to="/"
    className="hover:text-gray-200"
  >
    Home
  </Link>

  <Link
    to="/people"
    className="hover:text-gray-200"
  >
    People
  </Link>

  <Link
    to="/profile"
    className="hover:text-gray-200"
  >
    Profile
  </Link>

  <button
    type="button"
    onClick={handleLogout}
    className="hover:text-gray-200"
  >
    Logout
  </button>

</div>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;
