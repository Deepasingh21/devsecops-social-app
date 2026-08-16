import API_URL from "./api";

export const getNotifications = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/notifications`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json();
};

export const markNotificationAsRead = async (notificationId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/notifications/${notificationId}/read`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json();
};

export const markAllNotificationsAsRead = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/notifications/read-all`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json();
};
