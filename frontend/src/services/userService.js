import API_URL from "./api";

export const getProfile = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};

export const updateProfile = async (profileData) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/users/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  return response.json();
};

export const uploadProfilePicture = async (file) => {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("profilePicture", file);

  const response = await fetch(
    `${API_URL}/users/profile-picture`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  return response.json();
};

export const getUsers = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};

export const followUser = async (userId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/users/follow/${userId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json();
};

export const unfollowUser = async (userId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/users/unfollow/${userId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json();
};

export const getUserById = async (userId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/users/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json();
};

export const searchUsers = async (query) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/users/search?q=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json();
};

export const getFollowers = async (userId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/users/${userId}/followers`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json();
};

export const getFollowing = async (userId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/users/${userId}/following`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json();
};
